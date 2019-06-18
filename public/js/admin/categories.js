//biến toàn cục
var isDeletingCategory = 0; // Đang delete giá trị là 1

// Chuyên mục -----------------------------------------------------------------------------------------
//#region
function openAddCategory() {
    document.getElementById('CategoryModalLabel').innerHTML = "Thêm chuyên mục";
    document.getElementById('btnEditCategory').style.display = "none";
    document.getElementById('divID').style.display = "none";
    document.getElementById('btnAddCategory').style.display = "inline-block";
    document.getElementById("parent-category").value = "";
    document.getElementById("txtCategory").value = "";
    document.getElementById("txtCatID").value = "";
    document.getElementById('CategoryForm').action = "/admin/add";
}

function openEditCategory(r, parentCatID) {
    if (isDeletingCategory === 1) {
        return;
    }
    var table = document.getElementById("tableCategory");
    var category = document.getElementById("txtCategory");
    var parentCategory = document.getElementById("parent-category");
    document.getElementById('divID').style.display = "block";
    document.getElementById('CategoryModalLabel').innerHTML = "Chỉnh sửa chuyên mục";
    document.getElementById('btnEditCategory').style.display = "inline-block";
    document.getElementById('btnAddCategory').style.display = "none";

    //Set giá trị tương ứng với row được click
    document.getElementById("txtCatID").value = table.rows[r.rowIndex].cells[0].innerHTML;
    category.value = table.rows[r.rowIndex].cells[1].innerHTML;
    parentCategory.value = parentCatID;//
    document.getElementById('CategoryForm').action = "/admin/update";
    $('#CategoryModal').modal('show');
}

function openDeleteCategory() {
    var btnAdd = document.getElementById("addCategory");
    var btnDelete = document.getElementById("deleteCategory");
    var colDelete = document.getElementsByClassName("colDeleteCategory");

    if (colDelete[0].style.display === "table-cell") {//đang thưc hiện delete

        isDeletingCategory = 0;

        btnAdd.style.display = "inline-block";
        btnDelete.style.backgroundColor = "#007bff";
        btnDelete.innerHTML = "Xóa";
        for (var i = 0; i < colDelete.length; i++) {
            colDelete[i].style.display = "none";
        }
    }
    else {
        isDeletingCategory = 1;

        btnAdd.style.display = "none";
        btnDelete.style.backgroundColor = "#dc3545";
        btnDelete.innerHTML = "Hoàn tất";
        for (var i = 0; i < colDelete.length; i++) {
            colDelete[i].style.display = "table-cell";
        }
    }
}

//#endregion