//Quản lý người dùng-----------------------------------------------------------------------------------
//#region

function openDetailAccountSubcriber(r, exp_date) {//tiếp tục
    $('#DetailAccountModal').modal({ backdrop: 'static' }, 'show');
    document.getElementById('btnRenewSubscriber').style.display = 'flex';
    document.getElementById('RenewSubscriber-container').style.display = 'none';
    document.getElementById('DetailAccountModal-footer').style.display = 'flex';

    //Set giá trị
    var table = document.getElementById("subscriber-management-table");
    document.getElementById("txtDetailID").value = table.rows[r.rowIndex].cells[0].innerHTML;
    document.getElementById("txtDetailName").value = table.rows[r.rowIndex].cells[1].innerHTML;
    document.getElementById("txtDetailEmail").value = table.rows[r.rowIndex].cells[2].innerHTML;
    document.getElementById("txtDetailDOB").value = table.rows[r.rowIndex].cells[3].innerHTML;
    document.getElementById("txtDetailExpDate").value = exp_date;

    document.getElementById('RenewForm').action = '/admin/subscriber/renew/' + table.rows[r.rowIndex].cells[0].innerHTML;
    document.getElementById('btnBan').href = '/admin/subscriber/ban/' + table.rows[r.rowIndex].cells[0].innerHTML;
}

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

//#endregion
