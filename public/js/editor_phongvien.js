// hiển thị live editor để hiệu chỉnh
function EditPostModal(postID) {
    let randomIDModal = Math.floor(10000 + Math.random() * 89999);

    let htmlEditPost = `
        <h3 class="mb-3 mt-3">Hiệu chỉnh bài viết</h3>
        <form action="" class="form-created-news" onsubmit="return false">
            <div class="form-group">
                <label for="title-post-${randomIDModal}">Tiêu đề</label>
                <div class="wrapper-control">

                    <div class="form-control" contenteditable="true" id="title-post-${randomIDModal}"></div>

                    <script>
                        CKEDITOR.inline('title-post-${randomIDModal}', {
                            language: 'en',
                            // width: '100%',
                            toolbarCanCollapse: true,
                            fullPage: true,
                            blockedKeystrokes: [13, CKEDITOR.SHIFT + 13],
                            // height: 150,
                            // resize_maxHeight: 150,
                            customConfig: './custom/plain_text.js'
                        });
                    </script>

                </div>
            </div>

            <div class="form-group">
                <label for="category-post-${randomIDModal}">Chuyên mục</label>
                <div class="wrapper-control">
                    <select class="form-control" name="category-post-${randomIDModal}" id="category-post-${randomIDModal}">
                        <option value="uid_value_123">Tin tuyển sinh</option>
                        <option value="uid_value_123">Khuyến học</option>
                        <option value="uid_value_123">Du học</option>
                        <option value="uid_value_123">Thể thao trong nước</option>
                        <option value="uid_value_123">Thể thao ngoài nước</option>
                        <option value="uid_value_123">Bóng đá trong nước</option>
                        <option value="uid_value_123">Công nghệ</option>
                        <option value="uid_value_123">Sao Việt</option>
                        <option value="uid_value_123">Thời trang</option>
                        <option value="uid_value_123">Xem - Ăn - Chơi</option>
                        <option value="uid_value_123">Kiến thức giới tính</option>
                        <option value="uid_value_123">Làm đẹp</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="insert-tags">Gán nhãn</label>
                <div class="wrapper-control">
                    <div class="d-flex">
                        <select class="form-control mr-3 insert-tags" name="insert-tags" id="insert-tags">
                            <option value="" disabled>Chọn thẻ</option>
                            <option value="uid_value_456">ngày mai em đi</option>
                            <option value="uid_value_456">xe ducati</option>
                            <option value="uid_value_456">bị xì 1 lỗ</option>
                        </select>

                        <button type="button" class="btn-AddNewTag btn btn-success"
                            data-toggle="modal" data-target="#AddNewTagModal-${randomIDModal}" title="Thêm mới thẻ">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </button>
                    </div>

                    <!-- Modal -->
                    <div class="modal fade" id="AddNewTagModal-${randomIDModal}" tabindex="-${randomIDModal}" role="dialog"
                        aria-labelledby="AddNewTagModalTitle-${randomIDModal}" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="AddNewTagModalTitle-${randomIDModal}">Thêm mới thẻ</h5>
                                    <button type="button" class="close" data-dismiss="modal"
                                        aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="form-group">
                                        <input type="text" class="form-control NewTagName" name="NewTagName"
                                            id="NewTagName" placeholder="Tên thẻ">
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary"
                                        data-dismiss="modal">Đóng</button>
                                    <button type="button" class="btnSave btn btn-primary"
                                        data-dismiss="modal">Lưu</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="preview-tags list-tags mt-3 d-block">
                        <div class="mb-2">Tags:</div>
                        <ul class="tags">
                        </ul>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="summary-content-post-${randomIDModal}">Nội dung tóm tắt</label>
                <div class="wrapper-control">
                    <textarea class="form-control" name="summary-content-post-${randomIDModal}"
                        id="summary-content-post-${randomIDModal}" rows="3"></textarea>

                    <script>
                        CKEDITOR.replace('summary-content-post-${randomIDModal}', {
                            language: 'en',
                            toolbarCanCollapse: true,
                            width: '100%',
                            height: 150,
                            resize_maxHeight: 150,
                            customConfig: './custom/plain_text.js'
                        });
                    </script>
                </div>
            </div>

            <div class="form-group">
                <label for="content-post-${randomIDModal}">Nội dung</label>
                <div class="wrapper-control">
                    <textarea class="form-control" name="content-post-${randomIDModal}" id="content-post-${randomIDModal}"
                        rows="3"></textarea>

                    <script>
                        CKEDITOR.replace('content-post-${randomIDModal}', {
                            language: 'en',
                            // extraPlugins: 'easyimage',
                            // removePlugins: 'image',
                            toolbarCanCollapse: true,
                            // width: '100%',
                            // height: 250,
                            // resize_maxHeight: 250,
                            customConfig: './custom/post_content.js'
                        });
                    </script>
                </div>
            </div>

            <div class="control-buttons text-center">
                <button class="btn btn-primary" type="submit">Đăng bài</button>
            </div>
        </form>
    `;

    let htmlModal = `
    <div class="modal fade" id="ModalEditPost" tabindex="-1" role="dialog" aria-labelledby="ModalEditPostTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ModalEditPostTitle">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ${htmlEditPost}
          </div>
        </div>
      </div>
    </div>`;

    let ModalWrapper = document.createElement('div');
    ModalWrapper.id = `ModalEditPostWrapper-${randomIDModal}`;

    ModalWrapper.innerHTML = htmlModal;

    document.body.appendChild(ModalWrapper);

    let currentTag = [];
}

// ========================= POST NEWS =============================================================
var curTag = [];

function SettingFormPostNews(root_selector, ckeditor_post_number, currentTag) {

    var insert_tags = root_selector.querySelector('.insert-tags');

    if (insert_tags === null || typeof insert_tags === 'undefined') {
        return;
    }

    if (insert_tags.length > 0) {
        insert_tags.selectedIndex = 0;
    }

    insert_tags.addEventListener('change', function (event) {
        let opt = insert_tags.options[insert_tags.selectedIndex];

        const name = opt.text, value = opt.value;

        var res = currentTag.filter((obj) => obj.name === name && obj.value === value);

        if (res.length !== 0) {
            alert('Thẻ này đã có trong danh sách!');
            return;
        }

        AddTagFromSelect(root_selector, currentTag, name, value);
    });

    function AddTagFromSelect(root_selector, currentTag, name, value) {
        currentTag.push({
            'name': name,
            'value': value
        });

        let list_tags = root_selector.querySelector('.preview-tags .tags')

        let tag_item = document.createElement('li');
        value !== '' ? tag_item.className = 'item' : tag_item.className = 'item not-stored';

        let linkTag = document.createElement('a');
        linkTag.className = 'link';
        linkTag.textContent = name;

        tag_item.innerHTML = '<i class="exit-button fa fa-times" aria-hidden="true"></i>';

        tag_item.appendChild(linkTag);

        tag_item.querySelector('.exit-button').addEventListener('click', function () {
            this.parentElement.remove();
            currentTag.pop({ name: name, value: value })
        })

        list_tags.appendChild(tag_item);
    }

    document.getElementById(`AddNewTagModal-${ckeditor_post_number}`).querySelector('.btnSave').addEventListener('click', function () {

        let newTagName = root_selector.querySelector('input.NewTagName').value;

        if (newTagName === '') {
            alert('Không được để thẻ rỗng!');
            return;
        }

        let opt = document.createElement('option');
        opt.value = '';

        opt.innerText = newTagName;

        insert_tags.appendChild(opt);

        AddTagFromSelect(root_selector, currentTag, opt.innerText, '');

        root_selector.querySelector('input.NewTagName').value = '';
    });

    root_selector.querySelector('button[type="submit"]').addEventListener('click', function () {
        // console.log('he');

        let title_post = CKEDITOR.instances[`title-post-${ckeditor_post_number}`].getData();
        let summary_content_post = CKEDITOR.instances[`summary-content-post-${ckeditor_post_number}`].getData();
        let content_post = CKEDITOR.instances[`content-post-${ckeditor_post_number}`].getData();

        if (title_post === '' || summary_content_post === '' || content_post === '') {
            ShowAlertMessage('Các trường cần phải có nội dung!');
            return;
        }

        let category_select_box = document.getElementById(`category-post-${ckeditor_post_number}`);

        let selected_category = category_select_box.options[category_select_box.selectedIndex];

        let objSelected = {
            name: selected_category.innerText,
            value: selected_category.value
        }

        let objSend = {
            'title_post': title_post,
            'summary_content_post': summary_content_post,
            'content_post': content_post,
            'category': objSelected,
            'tags': curTag
        }

        console.log(objSend);

        // them loading



        // ajax send
        // setTimeout(() => {

        // }, 3000);
    });
}

window.addEventListener('load', function () {
    var create_news = document.getElementById('create-news');
    SettingFormPostNews(create_news, 1, curTag);
});


function PostEdit_ClickRow(){
    let rowRefuseNews = document.querySelector('#refuse-news table.can-be-edit');
    let rowNotAcceptedNews = document.querySelector('#not-approved-news table.can-be-edit');
}
// cài đặt event khi row trong table can-be-edit được click thì sẽ load ra 1 trang để cho phép hiệu chỉnh với nội dung đã được fill vào