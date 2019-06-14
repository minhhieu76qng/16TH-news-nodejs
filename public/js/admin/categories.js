//biến toàn cục
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


//array chuyên mục
var categories = [
    { name: "Thời trang", parent: "4", sizePosts: 20 },
    { name: "Tin tuyển sinh", parent: "1", sizePosts: 15 }
]

//array chuyên mục lớn
var ParentCategories = {
    "Giáo dục": "1",
    "Thể thao": "2",
    "Công nghệ": "3",
    "Giải trí": "4",
    "Sức khỏe": "5"
};

var isDeletingCategory = 0; // Đang delete giá trị là 1

var rowIndex = 0;

// Chuyên mục -----------------------------------------------------------------------------------------
//#region
function openAddCategory() {
    document.getElementById('CategoryModalLabel').innerHTML = "Thêm chuyên mục";
    document.getElementById('btnEditCategory').style.display = "none";
    document.getElementById('divID').style.display = "none";
    document.getElementById('btnAddCategory').style.display = "inline-block";
    document.getElementById("parent-category").value = "1";
    document.getElementById("txtCategory").value = "";
    document.getElementById("txtCatID").value = "";
    document.getElementById('CategoryForm').action = "/admin/add";
}

function openEditCategory(r) {
    if (isDeletingCategory === 1) {
        return;
    }
    rowIndex = r.rowIndex;
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
    parentCategory.value = ParentCategories[table.rows[r.rowIndex].cells[2].innerHTML];
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

// function addCategory() {
//     let category = document.getElementById("txtCategory");
//     let parentCategory = document.getElementById("parent-category");

//     categoryModel.add(category.value, parentCategory.selectedIndex).then(id => {
//         $('#CategoryModal').modal('hide');
//         categoryModel.getList()
//             .then(rows => {
//                 res.render('management/admin/vWCategories/categories.hbs', {
//                     categories: rows
//                 });
//             }).catch(err => {
//                 console.log(err);
//                 res.end('error occured.')
//             });
//         // console.log(id);
//         //res.render('admin/vwCategories/add');
//     }).catch(err => {
//         console.log(err);
//         res.end('error occured.')
//     });
// }


// function editCategory() {
//     var table = document.getElementById("tableCategory");
//     let category = document.getElementById("txtCategory");
//     let parentCategory = document.getElementById("parent-category");

//     //Set lại giá trị của phần tử trong array
//     categories[rowIndex - 1].name = category.value;
//     categories[rowIndex - 1].parent = parentCategory.options[parentCategory.selectedIndex].value;

//     //update table
//     table.rows[rowIndex].cells[1].innerHTML = category.value;
//     table.rows[rowIndex].cells[2].innerHTML = parentCategory.options[parentCategory.selectedIndex].text;
//     $('#CategoryModal').modal('hide');
// }

// function deleteCategory(r) {
//     var index = r.parentNode.parentNode.rowIndex;
//     var table = document.getElementById("tableCategory");
//     //Xóa array 
//     categories.splice(r.insertRow - 1);

//     table.deleteRow(index);
//     for (var i = index; i < table.rows.length; i++) {
//         table.rows[i].cells[0].innerHTML = i;
//     }
// }
//#endregion