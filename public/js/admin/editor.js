//#region
//-------------
var dropdown = document.getElementsByClassName("dropdown");
var i;
for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
}
//#endregion

//Quản lý người dùng-----------------------------------------------------------------------------------
//#region

function openDetailAccountEditor(r, strCatID, catManagementHTML) {//tiếp tục
    $('#DetailAccountModal').modal({ backdrop: 'static' }, 'show');
    document.getElementById('btnAssignEditor').style.display = 'flex';
    document.getElementById('AssignEditor-container').style.display = 'none';
    document.getElementById('DetailAccountModal-footer').style.display = 'flex';

    //Set giá trị
    var table = document.getElementById("editor-management-table");
    document.getElementById("txtDetailID").value = table.rows[r.rowIndex].cells[0].innerHTML;
    document.getElementById("txtDetailName").value = table.rows[r.rowIndex].cells[1].innerHTML;
    document.getElementById("txtDetailEmail").value = table.rows[r.rowIndex].cells[2].innerHTML;
    document.getElementById("txtDetailDOB").value = table.rows[r.rowIndex].cells[3].innerHTML;
    document.getElementById("category-editor").innerHTML = catManagementHTML;

    document.getElementById('AssignForm').action = '/admin/assign/' + table.rows[r.rowIndex].cells[0].innerHTML;
    document.getElementById('btnBan').href = '/admin/ban/' + table.rows[r.rowIndex].cells[0].innerHTML;
    //set giá trị cho selection
    $.each($("#selectCatManagement option:selected"), function() {
        $(this).prop('selected', false);
     });
     var text ="";
    $.each(strCatID.split(" "), function (i, e) {
        $("#selectCatManagement option[value='" + e + "']").prop("selected", true);
    });
    
    $('#selectCatManagement').selectpicker('refresh');
}

function BackMainDetailAccount(id_container) {
    document.getElementById(id_container).style.display = 'none';
    document.getElementById('DetailAccountModal-footer').style.display = 'flex';
}

function openContainerActionDetailAccount(id_container) {
    document.getElementById(id_container).style.display = 'block';
    document.getElementById('DetailAccountModal-footer').style.display = 'none';
    // $('#DetailPostModal').animate({ scrollTop: $('#DetailPostModal .modal-dialog').height() }, 500);
    $("#DetailAccountModal").scrollTop($("#DetailAccountModal").height());
}

//#endregion
