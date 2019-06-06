function openDetailPost(can_edit){
    $('#DetailPostModal').modal({ backdrop: 'static' }, 'show');

    if (can_edit===1) // 1: can edit, 0: can't edit
    {
        document.getElementById('newEditPageLink').style.display = 'flex';
        document.getElementById('btnRemovePost').style.display = 'flex';
    }
}

$('#DetailPostModal').on('hidden.bs.modal', function () {
    document.getElementById('newEditPageLink').style.display = 'none';
    document.getElementById('btnRemovePost').style.display = 'none';
})