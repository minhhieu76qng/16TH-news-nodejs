//Quản lý người dùng-----------------------------------------------------------------------------------
//#region

function openDetailAccountWriter(r, dob) {//tiếp tục
    $('#DetailAccountModal').modal({ backdrop: 'static' }, 'show');
    document.getElementById('DetailAccountModal-footer').style.display = 'flex';

    //Set giá trị
    var table = document.getElementById("writer-management-table");
    document.getElementById("txtDetailID").value = table.rows[r.rowIndex].cells[0].innerHTML;
    document.getElementById("txtDetailName").value = table.rows[r.rowIndex].cells[1].innerHTML;
    document.getElementById("txtDetailPseudonym").value = table.rows[r.rowIndex].cells[2].innerHTML;
    document.getElementById("txtDetailEmail").value = table.rows[r.rowIndex].cells[3].innerHTML;
    document.getElementById("txtDetailNumPost").value = table.rows[r.rowIndex].cells[4].innerHTML;
    document.getElementById("txtDetailDOB").value = dob;

    document.getElementById('btnBan').href = '/admin/writer/ban/' + table.rows[r.rowIndex].cells[0].innerHTML;
}

//#endregion