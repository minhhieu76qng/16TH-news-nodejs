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
