var imageSrc = '/asset/images/logo/';
var cssSrc = '/asset/css/';

var panelColor = document.getElementById('widget-custom-color');

var spiner = panelColor.querySelector('.spin');

var color_items = panelColor.querySelectorAll('.color-item');

var icon_pages = document.querySelectorAll('.icon_page');

// lưu trữ màu được chọn trong local storage

Array.from(color_items).forEach((el, idx) => {
    el.addEventListener('click', () => {
        Array.from(color_items).forEach((element, index) => {
            element.classList.remove('active');
        });

        el.classList.add('active');

        // thay doi url css va url cua logo
        let color_value = el.getAttribute('colorValue');

        localStorage.setItem('colorValue', color_value);

        Array.from(icon_pages).forEach((element, index) => {
            element.setAttribute('src', imageSrc + 'logo_' + color_value +'.png');
        })

        let linkCSSColor = document.querySelector('link[data-color="color_custom"]');

        linkCSSColor.setAttribute('href',cssSrc + 'color_' + color_value + '.css');
    })
})

spiner.addEventListener('click', () => {
    let isExpand = panelColor.getAttribute('expand');

    if (isExpand === 'false') {
        // mở panel
        panelColor.classList.add('expand');
        panelColor.setAttribute('expand', 'true');
    }
    else {
        panelColor.classList.remove('expand');
        panelColor.setAttribute('expand', 'false');
    }
});

window.addEventListener('load', function(){

    let color_value = localStorage.getItem('colorValue') || 'red';

    Array.from(icon_pages).forEach((element, index) => {
        element.setAttribute('src', imageSrc + 'logo_' + color_value +'.png');
    })

    let linkCSSColor = document.querySelector('link[data-color="color_custom"]');

    linkCSSColor.setAttribute('href',cssSrc + 'color_' + color_value + '.css');
})