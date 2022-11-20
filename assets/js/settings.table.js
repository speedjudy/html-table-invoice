let tbSetting_origin = {};
let tbSetting = {};
let currDoc = "doc-header";
let tbNum = 0;
let defaultTbWidth = 0;
let imageFlag = 0;
$(document).ready(function () {
  $("#columns").change(function () {
    tbSetting_origin.columns = tbSetting.columns;
    const _thisVal = $(this).val();
    tbSetting.columns = _thisVal;
  });

  $("#rows").change(function () {
    tbSetting_origin.rows = tbSetting.rows;
    const _thisVal = $(this).val();
    tbSetting.rows = _thisVal;
  });

  $("#table_height").change(function () {
    const _thisVal = $(this).val();

    if (_thisVal > 570) {
      alert("The table will be outsite window. Table height limit is 570.");
	tbSetting.table_height=570;
    } else {
      tbSetting.table_height = _thisVal;
    }
  });

  $("#table_width").change(function () {
    const _thisVal = $(this).val();
    if (_thisVal > 330) {
      alert("The table will be outsite window. Table width limit is 330.");
tbSetting.table_width=330;
    } else {
      tbSetting.table_width = _thisVal;
    }
  });

  $("#header_color").change(function () {
    const _thisVal = $(this).val();
    tbSetting.header_color = _thisVal;
  });

  $("#border_color").change(function () {
    const _thisVal = $(this).val();
    tbSetting.border_color = _thisVal;
  });

  $("#border_style").change(function () {
    const _thisVal = $(this).val();
    tbSetting.border_style = _thisVal;
  });

  $("#border_width").change(function () {
    const _thisVal = $(this).val();
    tbSetting.border_width = _thisVal;
  });

  $("#border_collapse").change(function () {
    const _thisVal = $(this).val();
    tbSetting.border_collapse = _thisVal;
  });

  $("#border_spacing").change(function () {
    const _thisVal = $(this).val();
    tbSetting.border_spacing = _thisVal;
  });

  $("#text_align").change(function () {
    const _thisVal = $(this).val();
    tbSetting.text_align = _thisVal;
  });

  $("#padding").change(function () {
    const _thisVal = $(this).val();
    tbSetting.padding = _thisVal;
  });

  $("#caption_side").change(function () {
    const _thisVal = $(this).val();
    tbSetting.caption_side = _thisVal;
  });

  $("#upload_image").click(function (e) {
    $("#fileElem").click();
    e.preventDefault(); // prevent navigation to "#"
  });

  $("#fileElem").change(function (input) {
    let file = input.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
      imageFlag = 1;
      $("#doc-background").attr("src", reader.result);
    };
    reader.onloadend = function () {
      setDocSize();
    };
    reader.onerror = function () {
      console.log(reader.error);
    };
  });

  $("#make_table").click(function () {
    // if( !imageFlag ) {
    //   alert("Please Upload Image"); return;
    // }

    tbNum++;
    currDoc = "doc-table-" + tbNum;
    
    getTableSetting();
    renderTable(tbSetting);
    setTableSetting(currDoc);
    createResizableTable($("."+currDoc+" .table")[0]);
    const mainTbHtm = $("#tb_source").html();
    $(".block-markdown__pre").text(mainTbHtm.trim());

    $("#make_table").hide();
    $("#change_table").show();
  });
  $("#change_table").click(function(){
    getTableSetting();  
    if(tbSetting_origin.columns != tbSetting.columns || tbSetting_origin.rows != tbSetting.rows){
      // console.log(tbSetting_origin, tbSetting)
      $(".doc-container").html("");
      renderTable(tbSetting);
      createResizableTable($("."+currDoc+" .table")[0]);
    }
    setTableSetting(currDoc);
  });

	$(document).on('mouseover','.table-container', function(e) {
		currDoc = $(this).attr("target_id");
		tdSelectFucInit();
	})

  initailFunc();
});

function initailFunc() {
  $("#change_table").hide();

  setDocSize();
}

function setDocSize() {
  defaultTbWidth = $("#doc-background").width();
  const tbCml = ($(".doc-container").width() - defaultTbWidth) / 2;
  // $("."+currDoc).width(defaultTbWidth);
  $("."+currDoc).css("margin-left", tbCml + "px");
}

function renderTable(tableSetting) {
  let divHtm = document.createElement("div");
  divHtm.setAttribute("class", `table-container ${currDoc}`);
  divHtm.setAttribute("target_id", currDoc);
  let tableHtm = document.createElement("table");
	tableHtm.setAttribute("class", "table table-bordered mainTable");
  let tbHtm = document.createElement("tbody");
  const { rows, columns } = tableSetting;
  const tdWidth = defaultTbWidth / columns;

  for (var i = 0; i < rows; i++) {
    const trStr = document.createElement("tr");
    trStr.setAttribute("ind", i);
    let tdStr = ``;
    for (var j = 0; j < columns; j++) {
      tdStr += `<td ind="${j}" style="width:${tdWidth}"></td>`;
    }
    trStr.innerHTML = tdStr;
    tbHtm.append(trStr);
  }
	$(tableHtm).html(tbHtm);
  $(divHtm).append(`<div class="tb-resize-top-cursor"></div>`);
	$(divHtm).append(tableHtm);
  $(divHtm).append(`<div class="tb-resize-bottom-cursor"></div>`);
  $(".doc-container").append(divHtm);
}

function getTableSetting() {
  tbSetting.columns = $("#columns").val();
  tbSetting.rows = $("#rows").val();
  tbSetting.table_height = ($("#table_height").val()>570?570:$("#table_height").val());
  tbSetting.table_width = ($("#table_width").val()>330?330:$("#table_width").val());
  tbSetting.border_color = $("#border_color").val();
  tbSetting.border_width = $("#border_width").val();
  tbSetting.border_collapse = $("#border_collapse").val();
  tbSetting.border_spacing = $("#border_spacing").val();
  tbSetting.text_align = $("#text_align").val();
  tbSetting.padding = $("#padding").val();
  tbSetting.caption_side = $("#caption_side").val();
}

function setTableSetting(selectedDoc) {
  $("."+selectedDoc).width(tbSetting.table_width);
  $("."+selectedDoc+" .table").width("100%");
  const tableHeight = tbSetting.table_height / tbSetting.rows;
  $("."+selectedDoc+" .table tr").css("height", tableHeight);
  $("."+selectedDoc+" thead").css("color", tbSetting.header_color);
  $(
    "."+selectedDoc+" .table, ."+selectedDoc+" .table th, ."+selectedDoc+" .table tr, ."+selectedDoc+" .table td"
  ).css("border-color", tbSetting.border_color);
  $(
    "."+selectedDoc+" .table th, ."+selectedDoc+" .table tr, ."+selectedDoc+" .table td"
  ).css("border-style", tbSetting.border_style);
  $(
    "."+selectedDoc+" .table, ."+selectedDoc+" .table th, ."+selectedDoc+" .table tr, ."+selectedDoc+" .table td"
  ).css("border-width", tbSetting.border_width + "px");
  $("."+selectedDoc+" .table").css("border-collapse", tbSetting.border_collapse);
  $("."+selectedDoc+" .table").css("border-spacing", tbSetting.border_spacing);
  $("."+selectedDoc+" .table").css("text-align", tbSetting.text_align);
  $(
    "."+selectedDoc+" .table, ."+selectedDoc+" .table th, ."+selectedDoc+" .table tr, ."+selectedDoc+" .table td"
  ).css("padding", tbSetting.padding + "px");
  $("."+selectedDoc+" .table").css("caption-side", tbSetting.caption_side);
  setDocSize();
}