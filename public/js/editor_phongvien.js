// ========================= POST NEWS =============================================================
var curTag = [];

function SettingFormPostNews(){

    var insert_tags = document.getElementById('insert-tags');

    if (insert_tags === null || typeof insert_tags === 'undefined'){
        return;
    }

    insert_tags.selectedIndex = 0;
    
    insert_tags.addEventListener('change', function(event){
        let opt = insert_tags.options[insert_tags.selectedIndex];
    
        const name = opt.text, value = opt.value;
    
        var res = curTag.filter((obj) => obj.name === name && obj.value === value);
    
        if (res.length !== 0){
            alert('Thẻ này đã có trong danh sách!');
            return;
        }
    
        AddTagFromSelect(name, value);
    });
    
    function AddTagFromSelect(name, value){
        curTag.push({
            'name' : name,
            'value' : value
        });
    
        let list_tags = document.getElementById('preview-tags').querySelector('.tags');
    
        let tag_item = document.createElement('li');
        value !== '' ? tag_item.className = 'item' : tag_item.className = 'item not-stored';
    
        let linkTag = document.createElement('a');
        linkTag.className = 'link';
        linkTag.textContent = name;
    
        tag_item.innerHTML = '<i class="exit-button fa fa-times" aria-hidden="true"></i>';
    
        tag_item.appendChild(linkTag);
    
        tag_item.querySelector('.exit-button').addEventListener('click', function(){
            this.parentElement.remove();
            curTag.pop({name : name, value : value})
        })
    
        list_tags.appendChild(tag_item);
    }
    
    document.getElementById('AddNewTag').querySelector('.btnSave').addEventListener('click', function(){
    
        if (document.getElementById('NewTagName').value === ''){
            alert('Không được để thẻ rỗng!');
            return;
        }
    
        let opt = document.createElement('option');
        opt.value = '';
    
        opt.innerText = document.getElementById('NewTagName').value;
    
        insert_tags.appendChild(opt);
    
        AddTagFromSelect(opt.innerText, '');
    
        document.getElementById('NewTagName').value = '';
    })
    
    document.getElementById('form-created-news').querySelector('button[type="submit"]').addEventListener('click', function(){
        // console.log('he');
    
        let post_title = CKEDITOR.instances['post-title'].getData();
        let summary_content_post = CKEDITOR.instances['summary-content-post'].getData();
        let content_post = CKEDITOR.instances['content-post'].getData();
        
        if (post_title === '' || summary_content_post === '' || content_post === ''){
            ShowAlertMessage('Các trường cần phải có nội dung!');
            return;
        }
    
        let category_select_box = document.getElementById('post-category');
    
        let selected_category = category_select_box.options[category_select_box.selectedIndex];
    
        let objSelected = {
            name : selected_category.innerText,
            value : selected_category.value
        }
    
        let objSend = {
            'post_title' : post_title,
            'summary_content_post' : summary_content_post,
            'content_post' : content_post,
            'category' : objSelected,
            'tags' : curTag
        }
    
        console.log(objSend);
    
        // them loading
    
    
    
        // ajax send
        setTimeout(() => {
            
        }, 3000);
    });
}


window.addEventListener('load', function(){
    SettingFormPostNews();
});

// cài đặt event khi row trong table can-be-edit được click thì sẽ load ra 1 trang để cho phép hiệu chỉnh với nội dung đã được fill vào