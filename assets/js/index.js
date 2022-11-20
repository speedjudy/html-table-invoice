$(document).ready(function(){
  $(document).on("mouseover mouseleave", ".doc-control-section>button", function(e){
    if(e.type == "mouseleave"){
      $(this).find("span").hide();
    } else {
      $(this).find("span").show();
    }
  });
  
  $.contextMenu({
    selector: ".doc-container td",
    callback: function (key, options) {
      if (key == "editable") {
        selectedTd.attr("contenteditable", "true");
        console.log(selectedTd.width());
        selectedTd.css({"max-width": selectedTd.width(),"overflow":"hidden"});
        selectedTd.css({"line-height": "10px", "text-indent": "1px","font-size": "10px"});
        selectedTd.focus();
        selectedTd.blur(function(){
          selectedTd.attr("contenteditable", "false");
        })
      } else if(key == "insertImg") {
        clickInsertImageBtn();
      } else if(key == "addRow") {
        addRowInTable();
      }
    },
    items: {
      editable: { name: "Editable", icon: "edit" },
      // insertImg: { name: "Insert image", icon: "add" },
      // addRow: { name: "Add row", icon: "add" },
      sep1: "---------",
      quit: { name: "Cancel", icon: "quit" },
    },
  });

  $(document).on("change", "#putImageInTd", function(input) {
    let file = input.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
      selectedTd.append(`<img src='${reader.result}' />`);
    };
    reader.onloadend = function () {
      $("#putImageInTd").remove();
    };
  })
  
});

function clickInsertImageBtn() {
  const inputString = `<input type="file" id="putImageInTd" accept="image/*" style="display:none"></input>`;
  $('body').append(inputString);
  $("#putImageInTd").click();
}

function addRowInTable() {
  const trNode = selectedTd.parent();
  const tableNode = selectedTd.parents("tbody");
  const tdCnt = trNode.children().length - 1;
  const trCnt = tableNode.find("tr").length;

  const trStr = document.createElement("tr");
  trStr.setAttribute("ind", trCnt);
  trStr.setAttribute("style", 'height:'+trNode.height()+'px');
  let tdStr = ``;
  for (var j = 0; j <= tdCnt; j++) {
    tdStr += `<td ind="${j}"></td>`;
  }
  trStr.innerHTML = tdStr;
  tableNode.append(trStr);
  createResizableTable($("."+currDoc+" .table")[0]);
}