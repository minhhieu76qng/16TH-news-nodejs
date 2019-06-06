//biến toàn cục
//#region

var curTag = [];

//array nhãn tag
var tags = [
    { name: "Thời sự", sizePosts: 20 },
    { name: "Bóng đá", sizePosts: 15 }
]
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
    // $('#DetailPostModal').animate({ scrollTop: $('#DetailPostModal .modal-dialog').height() }, 500);
    $("#DetailPostModal").scrollTop($("#DetailPostModal").height());
}


function BackMainDetailPost(id_container) {
    document.getElementById(id_container).style.display = 'none';
    document.getElementById('DetailPostModalFooter').style.display = 'flex';
}

//#endregion