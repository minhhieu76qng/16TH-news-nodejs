function ShowAlertMessage(message){
    if ($('#ShowMessage')){

        $('#ShowMessage .modal-body').html(message);
        $('#ShowMessage').modal('show');
    }
}

function Menu_Click(MenuItem, ContentItem){
    Array.from(MenuItem).forEach((el, idx) => {
        el.addEventListener('click' , function(event){
            event.preventDefault();
            Array.from(MenuItem).forEach((element, index) => {
                element.parentElement.classList.remove('active');
            });
    
            el.parentElement.classList.add('active');
    
            let idItem = el.getAttribute('href').replace('#','');
    
            Array.from(ContentItem).forEach((element, index) => {
                element.style.display = 'none';
                if (element.getAttribute('id') === idItem){
                    element.style.display = 'block';
                }
            });
        });
    });
};

window.addEventListener('load', function(){

    var ListItemMenu = document.querySelectorAll('.menu-management  .menu-management-item  .link');

    var ListItemContent = document.querySelectorAll('.content-menu-item');

    if (ListItemMenu !== null && typeof ListItemMenu !== 'undefined'
        && ListItemContent !== null && typeof ListItemContent !== 'undefined'){
            Menu_Click(ListItemMenu, ListItemContent);
        }
});