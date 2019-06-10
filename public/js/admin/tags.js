// Nhãn tag -------------------------------------------------------------------------------------------
//#region

//array nhãn tag
var tags = [
    { name: "Thời sự", sizePosts: 20 },
    { name: "Bóng đá", sizePosts: 15 }
]

var isDeletingTag = 0;
var rowIndex = 0;

function openAddTag() {
    document.getElementById('TagModalLabel').innerHTML = "Thêm nhãn tag";
    document.getElementById('btnEditTag').style.display = "none";
    document.getElementById('btnAddTag').style.display = "inline-block";
    document.getElementById("txtTag").value = "";
}

function openEditTag(r) {
    if (isDeletingTag === 1) {
        return;
    }
    rowIndex = r.rowIndex;
    var table = document.getElementById("tableTag");
    var tag = document.getElementById("txtTag");
    document.getElementById('TagModalLabel').innerHTML = "Chỉnh sửa nhãn tag";
    document.getElementById('btnEditTag').style.display = "inline-block";
    document.getElementById('btnAddTag').style.display = "none";
    //Set giá trị tương ứng với row được click
    // console.log(ParentCategories[table.rows[r.rowIndex].cells[2].innerHTML]);
    tag.value = table.rows[r.rowIndex].cells[1].innerHTML;
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


function addTag() {
    var table = document.getElementById("tableTag");
    let tag = document.getElementById("txtTag");
    //insert vào đầu bảng
    var row = table.insertRow(1);
    row.onclick = function () { openEditTag(this) };
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = 1;
    cell2.innerHTML = tag.value;
    cell3.innerHTML = "0";
    cell4.innerHTML = '<button class="btn btn-danger" onclick=deleteTag(this)><i class="fa fa-trash" aria-hidden="true"></i></button>';
    cell4.className = "colDeleteTag";
    //Thêm vào array categories
    tags.unshift({ name: tag.value, sizePosts: 0 });
    //Chỉnh lại số thứ tự
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].cells[0].innerHTML = i;
    }
    $('#TagModal').modal('hide');
}


function editTag() {
    var table = document.getElementById("tableTag");
    let tag = document.getElementById("txtTag");
    //Set lại giá trị của phần tử trong array
    tags[rowIndex - 1].name = tag.value;
    //update table
    table.rows[rowIndex].cells[1].innerHTML = tag.value;
    $('#TagModal').modal('hide');
}

function deleteTag(r) {
    var index = r.parentNode.parentNode.rowIndex;
    var table = document.getElementById('tableTag');
    //Xóa array 
    tags.splice(r.insertRow - 1);

    table.deleteRow(index);
    for (var i = index; i < table.rows.length; i++) {
        table.rows[i].cells[0].innerHTML = i;
    }
}
//#endregion

