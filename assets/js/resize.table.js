// document.addEventListener('DOMContentLoaded', function () {   
// createResizableTable(document.getElementById('mainTable'));
// });

const createResizableTable = function (table) {
    const cols = table.querySelectorAll('td');
    [].forEach.call(cols, function (col) {
        createColumnResizable(col, 'C');
    });

    const rows = table.querySelectorAll('tr');
    [].forEach.call(rows, function (row) {
        createColumnResizable(row, 'R');
    });

    createTableResizable(table);
};

const createColumnResizable = function (dom, flag) {
    let downFlag = 0;
    let x = 0;
    let w = 0;
    let y = 0;
    let h = 0;
    let columns = $("#columns").val();
    let rows = $("#rows").val();
    let tdWidths = [];
    let trHeights = [];
    let workFlag = true;
    const mouseDownHandler = function (e) {
        if (!downFlag) return;

        if (flag === "C")
            x = e.clientX;
        else
            y = e.clientY;

        const styles = window.getComputedStyle(dom);
        if (flag === "C")
            w = parseInt(styles.width, 10);
        else
            h = parseInt(styles.height, 10);

        const siblingTds = $(dom).parent().children();
        let index = 0;
        let trs = $(dom).parent().parent().children().children();
        for (let ri = 0; ri < trs.length; ri++) {
            const trHeight = $(trs[ri]).height();
            trHeights[ri] = trHeight;
        }
        for (let i = 0; i < siblingTds.length; i++) {
            const selTd = $(siblingTds[i]).width();
            let colspan = parseInt($(siblingTds[i]).attr('colspan'));
            if (colspan > 0 && siblingTds[i + 1] != undefined) {
                tdWidths[index] = selTd;
                for (let j = 0; j < colspan; j++) {
                    index++;
                    tdWidths[index] = NaN;
                }
                continue;
            } else {
                tdWidths[index] = selTd;
                index++;
            }
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        if (flag === "C") {
            const diffX = e.clientX * 1 - x * 1;
            const domInd = $(dom).attr('ind') * 1;
            let newTdWidths = [];
            for (let i = 0; i < tdWidths.length; i++) {
                let tdWidth = tdWidths[i];
                if (domInd == i) {
                    if (tdWidth + diffX > 0) {
                        newTdWidths[i] = tdWidth + diffX;
                        workFlag = true;
                    } else {
                        workFlag = false;
                        newTdWidths[i] = 0;
                    }
                } else if (domInd + 1 == i) {
                    if (tdWidth - diffX > 0) {
                        newTdWidths[i] = tdWidth - diffX;
                    } else {
                        workFlag = false;
                        newTdWidths[i] = 0;
                    }
                } else {
                    newTdWidths[i] = tdWidth;
                }
            }
            for (let i = 0; i < newTdWidths.length; i++) {
                if (workFlag) {
                    let tdWidth = newTdWidths[i];
                    $("." + currDoc + " .table tr").find('td[ind=' + i + ']').width(tdWidth);
                }
            }

        } else {
            const diffY = e.clientY * 1 - y * 1;
            const domInd = $(dom).attr('ind') * 1;
            let newTrHeights = [];
            for (let hi = 0; hi < trHeights.length; hi++) {
                let trHeight = trHeights[hi];
                if (domInd == hi) {
                    if (trHeight + diffY > 0) {
                        newTrHeights[hi] = trHeight + diffY;
                        workFlag = true;
                    } else {
                        workFlag = false;
                        newTrHeights[hi] = 0;
                    }
                } else if (domInd + 1 == hi) {
                    if (trHeight - diffY > 0) {
                        newTrHeights[hi] = trHeight - diffY;
                        // workFlag = true;
                    } else {
                        workFlag = false;
                        newTrHeights[hi] = 0;
                    }
                } else {
                    newTrHeights[hi] = trHeight;
                }
            }
            for (let i = 0; i < newTrHeights.length; i++) {
                if (workFlag) {
                    let trHeight = newTrHeights[i];
                    $("." + currDoc + " .table").find('tr[ind=' + i + ']').height(trHeight);
                }
            }
            // dom.style.height = `${h + diffY}px`;
        }

    };

    const mouseUpHandler = function () {
        const mainTbHtm = $("#tb_source").html();
        $(".block-markdown__pre").text(mainTbHtm.trim());
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveOnRowHandler = function (e) {
        const styles = window.getComputedStyle(dom);
        if (flag === "R") {
            const ab_h = parseInt(styles.height, 10);
            if (e.offsetY > (ab_h - 5)) {
                if ($(dom)[0].nodeName == "TR") {
                    if ($(dom).attr("ind") != rows - 1) {
                        dom.classList.add('row-resizer');
                        downFlag = 1;
                    }
                }
            } else {
                dom.classList.remove('row-resizer');
                downFlag = 0;
            }
        } else {
            const ab_w = parseInt(styles.width, 10);
            if (e.offsetX > (ab_w - 5)) {
                if ($(dom)[0].nodeName == "TD") {
                    if ($(dom).attr("ind") != columns - 1) {
                        dom.classList.add('col-resizer');
                        downFlag = 1;
                    }
                }
            } else {
                dom.classList.remove('col-resizer');
                downFlag = 0;
            }
        }
    };

    dom.addEventListener('mousemove', mouseMoveOnRowHandler);
    dom.addEventListener('mousedown', mouseDownHandler);
};

const createTableResizable = function (table) {
    let editableFlag = 0;
    let w = 0;
    let h = 0
    let downPosX = 0;
    let downPosY = 0;
    let tbMLeft = 0;
    let tbMTop = 0;
    let tbMBottom = 0;
    $(document).on("mousedown mousemove mouseout", ".tb-resize-top-cursor", function (e) {
        if (e.type == "mousedown") {
            editableFlag = 1;
            w = $("." + currDoc).width();
            h = $("." + currDoc).height();
            tbMLeft = parseInt($("." + currDoc).css('margin-left'));
            tbMTop = parseInt($("." + currDoc).css('margin-top'));
            downPosX = e.clientX;
            downPosY = e.clientY;
        }
    });
    $(document).on("mousedown mousemove mouseup", ".tb-resize-bottom-cursor", function (e) {
        if (e.type == "mousedown") {
            editableFlag = 3;
            w = $("." + currDoc).width();
            h = $("." + currDoc).height();
            tbMBottom = parseInt($("." + currDoc).css('margin-bottom'));
            downPosX = e.clientX;
            downPosY = e.clientY;
        }
    });
    $(document).on("mousemove mouseup", function (e) {
        if (e.type == "mousemove") {
            if (editableFlag == 3) {
                const diffX = e.clientX * 1 - downPosX * 1;
                const diffY = e.clientY * 1 - downPosY * 1;
                let offsetLeft = $(".table-container")[0].offsetLeft + w + diffX;
                const docHeight = h + diffY;
                if (offsetLeft <= 340) {
                    $("." + currDoc).width(w + diffX);
                }
                if (tbMBottom - diffY > -476) {
                    $("." + currDoc).css({
                        "margin-bottom": tbMBottom - diffY + "px",
                    });
                    const trNum = $("." + currDoc + " .table tr").length;
                    const trHeight = docHeight / trNum;
                    $("." + currDoc + " .table tr").css({
                        "height": trHeight + "px",
                    });
                }

            } else if (editableFlag == 1) {
                let diffX = e.clientX * 1 - downPosX * 1;
                let diffY = e.clientY * 1 - downPosY * 1;
                let offsetTop = $(".table-container")[0].offsetTop;
                let offsetLeft = $(".table-container")[0].offsetLeft;
                console.log(tbMLeft + diffX, offsetLeft, $(".table-container").height());
                if (offsetTop >= 0) {
                    const docHeight = h - diffY;
                    var marginTop = (tbMTop + diffY < 0) ? 0 : tbMTop + diffY;
                    if ($(".table-container").height() > 15) {
                        $("." + currDoc).css({
                            "margin-top": marginTop + "px"
                        });
                    }
                    const trNum = $("." + currDoc + " .table tr").length;
                    if (tbMTop + diffY >= 0) {
                        const trHeight = docHeight / trNum;
                        $("." + currDoc + " .table tr").css({
                            "height": trHeight + "px",
                        });
                    }
                }
                if (offsetLeft >= 0) {
                    if (tbMLeft + diffX >= 0) {
                        if ($(".table-container").width() > 15) {
                            $("." + currDoc).css({
                                "margin-left": tbMLeft + diffX + "px"
                            });
                        }
                        $("." + currDoc).css({
                            "width": w - diffX + "px"
                        });
                    }
                }
            }
        } else {
            editableFlag = 0;
        }
    })
}