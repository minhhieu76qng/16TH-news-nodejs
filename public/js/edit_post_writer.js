// ========================= POST NEWS =============================================================

function SetDataEdit() {
    //set data cho bài viết
    CKEDITOR.instances['post-title'].setData("Hỏa hoạn tại Nhà thờ Đức Bà Paris, tháp chuông" +
        "và mái vòm của công trình 850 năm tuổi đã đổ sập");

    CKEDITOR.instances['summary-content-post'].setData('Lorem ipsum dolor sit amet consectetur' +
        'adipisicing elit. Iusto sunt porro rerum tempora maxime illum corrupti. Eligendi iusto' +
        'aspernatur, nisi consequuntur non maiores rerum sunt quia, aperiam sapiente quis ullam.' +
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto sunt porro rerum tempora' +
        'maxime illum corrupti. Eligendi iusto aspernatur, nisi consequuntur non maiores rerum' +
        'sunt quia, aperiam sapiente quis ullam.');

    CKEDITOR.instances['content-post'].setData('Lorem ipsum dolor sit amet consectetur adipisicing elit.' +
        'Iusto sunt porro rerum tempora maxime illum corrupti. Eligendi iusto aspernatur, nisi consequuntur' +
        'non maiores rerum sunt quia, aperiam sapiente quis ullam. Lorem ipsum dolor sit amet consectetur' +
        'Iusto sunt porro rerum tempora maxime illum corrupti. Eligendi iusto aspernatur, nisi consequuntur' +
        'non maiores rerum sunt quia, aperiam sapiente quis ullam.' +
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/3fi7uwBU-CE" frameborder="0"' +
        'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
        '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit</p>' +
        'maxime illum corrupti. Eligendi iusto aspernatur, nisi consequuntur non maiores rerum sunt' +
        'quia, aperiam sapiente quis ullam. maxime illum corrupti. Eligendi iusto aspernatur, nisi' +
        'consequuntur non maiores rerum sunt quia, aperiam sapiente quis ullam.' +
        '<img class="media-content" src="images/post/10.jpg" alt="">' +
        '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>' +
        'maxime illum corrupti. Eligendi iusto aspernatur, nisi consequuntur non maiores rerum sunt' +
        'quia, aperiam sapiente quis ullam. maxime illum corrupti. Eligendi iusto aspernatur, nisi' +
        'consequuntur non maiores rerum sunt quia, aperiam sapiente quis ullam.' +
        '<iframe scrolling="no" width=560 height=315 src=https://zingmp3.vn/embed/video/ZWACD68E?start=false ' +
        'frameborder="0" allowfullscreen="true" />' +
        '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>' +
        'maxime illum corrupti. Eligendi iusto aspernatur, nisi consequuntur non maiores rerum sunt' +
        'quia, aperiam sapiente quis ullam. maxime illum corrupti. Eligendi iusto aspernatur, nisi' +
        'consequuntur non maiores rerum sunt quia, aperiam sapiente quis ullam.');
}


window.addEventListener('load', function () {
    SetDataEdit();
});