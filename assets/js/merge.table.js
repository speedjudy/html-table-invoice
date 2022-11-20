let startColPos = -1;
let endColPos = -1;
let startRowPos = -1;
let endRowPos = -1;
let selectedTd = null;

$(document).ready(function () {
  tdSelectFucInit();

  $.contextMenu({
    selector: "td.selected-td",
    callback: function (key, options) {
      if (key == "merge") {
        cellsMerge();
      }
    },
    items: {
      merge: { name: "Merge", icon: "code-merge" },
      sep1: "---------",
      quit: { name: "Cancel", icon: "quit" },
    },
  });
});

function tdSelectFucInit() {
	$(document).on(
    "mousedown mouseup",
    "." + currDoc + " .table td",
    function (e) {
      if (e.which == 3) {
        selectedTd = $(this);
        return;
      };

      if (e.type === "mousedown") {
        startColPos = $(this).attr("ind");
        startRowPos = $(this).parent().attr("ind");

        $(".selected-td").removeClass("selected-td");
      } else {
        endColPos = $(this).attr("ind");
        endRowPos = $(this).parent().attr("ind");

        if (startColPos > -1 && endColPos > -1) {
          if (startColPos > endColPos) {
            const tempVal = startColPos * 1 + endColPos * 1;
            startColPos = endColPos * 1;
            endColPos = tempVal - startColPos * 1;
          }
        }
        if (startRowPos > -1 && endRowPos > -1) {
          if (startRowPos > endRowPos) {
            const tempVal = startRowPos * 1 + endRowPos * 1;
            startRowPos = endRowPos * 1;
            endRowPos = tempVal - startRowPos * 1;
          }
        }
        // console.log(startColPos, endColPos, "col");
        // console.log(startRowPos, endRowPos, "row");
        if (startColPos == endColPos && startRowPos == endRowPos) return;

        for (var i = startColPos; i <= endColPos; i++) {
          for (let r = startRowPos; r <= endRowPos; r++) {
            $("." + currDoc + " .table")
              .find("tr[ind=" + r + "]")
              .find("td[ind=" + i + "]")
              .addClass("selected-td");
          }
        }
      }
    }
  );
}

function cellsMerge() {
  const rCnt = endRowPos * 1 - startRowPos * 1 + 1;
  const mCnt = endColPos * 1 - startColPos * 1 + 1;
	const firstNode = $("." + currDoc + " .table")
		.find("tr[ind=" + startRowPos + "]")
		.find("td[ind=" + startColPos + "]");
	if(rCnt > 1){
		firstNode.attr("rowspan", rCnt);
	}
	if(mCnt > 1) {
		firstNode.attr("colspan", mCnt);
	}
		
  for (var r = startRowPos; r <= endRowPos; r++) {
    for (var c = startColPos; c <= endColPos; c++) {
			const trNode = $("." + currDoc + " .table").find("tr[ind=" + r + "]");
      const tdNode = trNode.find("td[ind=" + c + "]");
      if (tdNode.attr("ind") != startColPos || trNode.attr("ind") != startRowPos) {
        tdNode.remove();
      }
    }
  }
  $(".selected-td").removeClass("selected-td");
}
