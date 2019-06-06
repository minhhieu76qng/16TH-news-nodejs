//biến toàn cục
//#region
//array chuyên mục
var categories = [
    { name: "Thời trang", parent: "4", sizePosts: 20 },
    { name: "Tin tuyển sinh", parent: "1", sizePosts: 15 }
]

var curTag = [];

//array chuyên mục lớn
var ParentCategories = {
    "Giáo dục": "1",
    "Thể thao": "2",
    "Công nghệ": "3",
    "Giải trí": "4",
    "Sức khỏe": "5"
};

//array nhãn tag
var tags = [
    { name: "Thời sự", sizePosts: 20 },
    { name: "Bóng đá", sizePosts: 15 }
]

var isDeletingCategory = 0; // Đang delete giá trị là 1
var isDeletingTag = 0;

var rowIndex = 0;

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


// Chuyên mục -----------------------------------------------------------------------------------------
//#region
function openAddCategory() {
    document.getElementById('CategoryModalLabel').innerHTML = "Thêm chuyên mục";
    document.getElementById('btnEditCategory').style.display = "none";
    document.getElementById('btnAddCategory').style.display = "inline-block";
    document.getElementById("parent-category").value = "1";
    document.getElementById("txtCategory").value = "";
}

function openEditCategory(r) {
    if (isDeletingCategory === 1) {
        return;
    }
    rowIndex = r.rowIndex;
    var table = document.getElementById("tableCategory");
    var category = document.getElementById("txtCategory");
    var parentCategory = document.getElementById("parent-category");

    document.getElementById('CategoryModalLabel').innerHTML = "Chỉnh sửa chuyên mục";
    document.getElementById('btnEditCategory').style.display = "inline-block";
    document.getElementById('btnAddCategory').style.display = "none";

    //Set giá trị tương ứng với row được click
    category.value = table.rows[r.rowIndex].cells[1].innerHTML;
    parentCategory.value = ParentCategories[table.rows[r.rowIndex].cells[2].innerHTML];
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

function addCategory() {
    var table = document.getElementById("tableCategory");
    let category = document.getElementById("txtCategory");
    let parentCategory = document.getElementById("parent-category");

    //insert vào đầu bảng
    var row = table.insertRow(1);
    row.onclick = function () { openEditCategory(this) };
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    cell1.innerHTML = 1;
    cell2.innerHTML = category.value;
    cell3.innerHTML = parentCategory.options[parentCategory.selectedIndex].text;
    cell4.innerHTML = "0";
    cell5.innerHTML = '<button class="btn btn-danger" onclick=deleteCategory(this)><i class="fa fa-trash" aria-hidden="true"></i></button>';
    cell5.className = "colDeleteCategory";

    //Thêm vào array categories
    categories.unshift({ name: category.value, parent: parentCategory.options[parentCategory.selectedIndex], sizePosts: 0 });
    //Chỉnh lại số thứ tự
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].cells[0].innerHTML = i;
    }
    $('#CategoryModal').modal('hide');
}


function editCategory() {
    var table = document.getElementById("tableCategory");
    let category = document.getElementById("txtCategory");
    let parentCategory = document.getElementById("parent-category");

    //Set lại giá trị của phần tử trong array
    categories[rowIndex - 1].name = category.value;
    categories[rowIndex - 1].parent = parentCategory.options[parentCategory.selectedIndex].value;

    //update table
    table.rows[rowIndex].cells[1].innerHTML = category.value;
    table.rows[rowIndex].cells[2].innerHTML = parentCategory.options[parentCategory.selectedIndex].text;
    $('#CategoryModal').modal('hide');
}

function deleteCategory(r) {
    var index = r.parentNode.parentNode.rowIndex;
    var table = document.getElementById("tableCategory");
    //Xóa array 
    categories.splice(r.insertRow - 1);

    table.deleteRow(index);
    for (var i = index; i < table.rows.length; i++) {
        table.rows[i].cells[0].innerHTML = i;
    }
}
//#endregion

// Nhãn tag -------------------------------------------------------------------------------------------
//#region
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

//Quản lý bài viết ------------------------------------------------------------------------------------
//#region
function openDetailPost(r, id_Table) {
    $('#DetailPostModal').modal({ backdrop: 'static' }, 'show');

    if (id_Table === "accepted-news-table") {
        document.getElementById('btnUpdateDatePublishPost').style.display = 'flex';
        document.getElementById('btnRemovePost').style.display = 'flex';
    }
    else if (id_Table === "not-accepted-news-table") {
        document.getElementById('btnAcceptPost').style.display = 'flex';
        document.getElementById('btnDenyPost').style.display = 'flex';
    }
    else //if(id_Table==="published-news-table")
    {
        document.getElementById('btnRemovePost').style.display = 'flex';
    }
}

// $('#table-not-accepted-news').on('click-row.bs.table', function (row, $element, field) {
//     // console.log(row, $element);
//     alert("abc");
//     $('#DetailPostModal').modal({backdrop: 'static'},'show');
//     document.getElementById('btnAcceptPost').style.display = 'flex';
//     document.getElementById('btnUpdateDatePublishPost').style.display = 'flex';
//     document.getElementById('btnDenyPost').style.display = 'flex';
//     document.getElementById('btnRemovePost').style.display = 'flex';
// })

//Khi đóng detailPost modal thì ẩn các phần tử đi
$('#DetailPostModal').on('hidden.bs.modal', function () {

    document.getElementById('AcceptPost-container').style.display = 'none';
    document.getElementById('RemovePost-container').style.display = 'none';
    document.getElementById('DenyPost-container').style.display = 'none';
    document.getElementById('UpdateDatePublishPost-container').style.display = 'none';
    document.getElementById('btnAcceptPost').style.display = 'none';
    document.getElementById('btnUpdateDatePublishPost').style.display = 'none';
    document.getElementById('btnDenyPost').style.display = 'none';
    document.getElementById('btnRemovePost').style.display = 'none';
})

var insert_tags = document.getElementById('insert-tags');

// if (insert_tags === null || typeof insert_tags === 'undefined') {
//     return;
// }

insert_tags.selectedIndex = 0;

insert_tags.addEventListener('change', function (event) {
    let opt = insert_tags.options[insert_tags.selectedIndex];

    const name = opt.text, value = opt.value;

    var res = curTag.filter((obj) => obj.name === name && obj.value === value);

    if (res.length !== 0) {
        alert('Thẻ này đã có trong danh sách!');
        return;
    }

    AddTagFromSelect(name, value);
});

function AddTagFromSelect(name, value) {
    curTag.push({
        'name': name,
        'value': value
    });

    let list_tags = document.getElementById('preview-tags').querySelector('.tags');

    let tag_item = document.createElement('li');
    value !== '' ? tag_item.className = 'item' : tag_item.className = 'item not-stored';

    let linkTag = document.createElement('a');
    linkTag.className = 'link';
    linkTag.textContent = name;

    tag_item.innerHTML = '<i class="exit-button fa fa-times" aria-hidden="true"></i>';

    tag_item.appendChild(linkTag);

    tag_item.querySelector('.exit-button').addEventListener('click', function () {
        this.parentElement.remove();
        curTag.pop({ name: name, value: value })
    })

    list_tags.appendChild(tag_item);
}

function openContainerActionDetailPost(id_container) {
    document.getElementById(id_container).style.display = 'block';
    document.getElementById('DetailPostModalFooter').style.display = 'none';
    $("#DetailPostModal").scrollTop($("#DetailPostModal").height());
}


function BackMainDetailPost(id_container) {
    document.getElementById(id_container).style.display = 'none';
    document.getElementById('DetailPostModalFooter').style.display = 'flex';
}

//#endregion

//Quản lý người dùng-----------------------------------------------------------------------------------
//#region

function openDetailAccount(r, id_Table) {
    $('#DetailAccountModal').modal({ backdrop: 'static' }, 'show');

    if (id_Table === "writer-management-table") {
        document.getElementById('pseudonymDetailAccountModal-container').style.display = 'block';
        document.getElementById('sizePostDetailAccountModal-container').style.display = 'block';
    }
    else if (id_Table === "editor-management-table") {
        document.getElementById('btnAssignEditor').style.display = 'flex';
        document.getElementById('categoryDetailAccountModal-container').style.display = 'block';
    }
    else //if(id_Table==="subscriber-management-table")
    {
        document.getElementById('btnRenewSubscriber').style.display = 'flex';
        document.getElementById('nOfDayPreDetailAccountModal-container').style.display = 'block';
    }
}

//Khi đóng detailAccount modal thì ẩn các phần tử đi
$('#DetailAccountModal').on('hidden.bs.modal', function () {

    document.getElementById('pseudonymDetailAccountModal-container').style.display = 'none';
    document.getElementById('sizePostDetailAccountModal-container').style.display = 'none';
    document.getElementById('btnAssignEditor').style.display = 'none';
    document.getElementById('categoryDetailAccountModal-container').style.display = 'none';
    document.getElementById('btnRenewSubscriber').style.display = 'none';
    document.getElementById('nOfDayPreDetailAccountModal-container').style.display = 'none';
})

function BackMainDetailAccount(id_container)
{
    document.getElementById(id_container).style.display = 'none';
    document.getElementById('DetailAccountModal-footer').style.display = 'flex';
}

function openContainerActionDetailAccount(id_container)
{
    document.getElementById(id_container).style.display = 'block';
    document.getElementById('DetailAccountModal-footer').style.display = 'none';
    // $('#DetailPostModal').animate({ scrollTop: $('#DetailPostModal .modal-dialog').height() }, 500);
    $("#DetailAccountModal").scrollTop($("#DetailAccountModal").height());
}

function AssignEditorComplete()
{
    document.getElementById('AssignEditor-container').style.display = 'none';
    document.getElementById('DetailAccountModal-footer').style.display = 'flex';
}

function RenewComplete()
{
    document.getElementById('RenewSubscriber-container').style.display = 'none';
    document.getElementById('DetailAccountModal-footer').style.display = 'flex';
}

//#endregion