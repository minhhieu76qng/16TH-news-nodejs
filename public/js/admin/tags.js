// Nhãn tag -------------------------------------------------------------------------------------------
//#region
var isDeletingTag = 0;

function openAddTag() {
    document.getElementById('TagModalLabel').innerHTML = "Thêm nhãn tag";
    document.getElementById('btnEditTag').style.display = "none";
    document.getElementById('divIDTag').style.display = "none";
    document.getElementById('btnAddTag').style.display = "inline-block";
    document.getElementById("txtTag").value = "";
    document.getElementById("txtTagID").value = "";
    document.getElementById('TagForm').action = "/admin/tag/add";
}

function openEditTag(r) {
    if (isDeletingTag === 1) {
        return;
    }
    var table = document.getElementById("tableTag");
    var tag = document.getElementById("txtTag");
    document.getElementById('TagModalLabel').innerHTML = "Chỉnh sửa nhãn tag";
    document.getElementById('btnEditTag').style.display = "inline-block";
    document.getElementById('btnAddTag').style.display = "none";
    document.getElementById('divIDTag').style.display = "block";
    //Set giá trị tương ứng với row được click
    document.getElementById("txtTagID").value = table.rows[r.rowIndex].cells[0].innerHTML;
    tag.value = table.rows[r.rowIndex].cells[1].innerHTML;
    document.getElementById('TagForm').action = "/admin/tag/update";
    $('#TagModal').modal('show');
}

function openDeleteTag() {
    var btnAdd = document.getElementById("addTag");
    var btnDelete = document.getElementById("deleteTag");
    var colDelete = document.getElementsByClassName("colDeleteTag");
    if (colDelete[0].style.display === "table-cell") {//đang thưc hiện delete

        isDeletingTag = 0;

        btnAdd.style.display = "inline-block";
        btnDelete.style.backgroundColor = "#007bff";
        btnDelete.innerHTML = "Xóa";
        for (var i = 0; i < colDelete.length; i++) {
            colDelete[i].style.display = "none";
        }
    }
    else {
        isDeletingTag = 1;

        btnAdd.style.display = "none";
        btnDelete.style.backgroundColor = "#dc3545";
        btnDelete.innerHTML = "Hoàn tất";
        for (var i = 0; i < colDelete.length; i++) {
            colDelete[i].style.display = "table-cell";
        }
    }
}
//#endregion

