var isStick = false;

function DisplayHeader() {
    // let headerHeight = document.getElementById('header').querySelector('.top-header').clientHeight;
    let ofsetNav = document.getElementById('nav-search').offsetTop;
    

    if (ofsetNav < window.pageYOffset) {
        if (isStick === false) {
            // document.getElementById('header').querySelector('.top-header').style.display = 'none';

            document.getElementById('nav-search').style.cssText = 'position: fixed; top : 0; width: 100%;'
            document.getElementById('nav-search').querySelector('.container').classList.add('container-fluid');
            document.getElementById('nav-search').querySelector('.container').classList.remove('container');

            document.getElementById('nav-search').querySelector('.container-fluid .sub-logo').style.display = 'block';

            isStick = true;
        }
    }
    else {
        if (isStick === true) {
            // document.getElementById('header').querySelector('.top-header').style.display = '';

            document.getElementById('nav-search').style.cssText = ''

            document.getElementById('nav-search').querySelector('.container-fluid').classList.add('container');
            document.getElementById('nav-search').querySelector('.container-fluid').classList.remove('container-fluid');

            document.getElementById('nav-search').querySelector('.container .sub-logo').style.display = 'none';
        }

        isStick = false;
    }
}


// trước khi chạy thì phải get được vị trí và kích thước của column side bar.
// khi lăn thì thay đổi vị trí của sidebar-wrapper bằng position absolute và top:
// khi top + height(sidebar) == height(widget) thì dừng không thêm top nữa.
function ScrollingSidebar() {

    let sidebar = document.querySelector('.widget-sidebar');

    if (typeof sidebar === 'undefined' || sidebar === null){
        return;
    }
    
    let sidebar_wrapper = sidebar.querySelector('.sidebar-wrapper');

    if (typeof sidebar_wrapper === 'undefined' || sidebar_wrapper === null){
        return;
    }

    let sidebarTop = sidebar.getBoundingClientRect().top;
    
    let heightNav = document.getElementById('header').clientHeight; 
    
    
    if (sidebarTop - heightNav <= 0) {

        if (Math.floor(-sidebarTop + heightNav) + sidebar_wrapper.clientHeight - (sidebar.clientHeight) < 0) {
            console.log(-sidebarTop + heightNav);

            sidebar_wrapper.style.cssText = `top: ${Math.floor(-sidebarTop + heightNav)}px;`;
        }
        else
        {
            sidebar_wrapper.style.cssText = 'bottom:0; top:auto;'
        }
    }
    else
    {
        sidebar_wrapper.style.top = '0';
    }
}

function BackToTop(){
    // get height scroll hien tai
    // neu height scroll > 100px thi hien thi button. nguoc lai thi an
    if (window.scrollY > window.innerHeight){
        document.getElementById('back-to-top').classList.remove('hidden');
    }
    else
    {
        document.getElementById('back-to-top').classList.add('hidden');
    }
}

window.addEventListener('scroll', function () {
    DisplayHeader();

    ScrollingSidebar();

    BackToTop();
})

window.addEventListener('load', function () {
    ScrollingSidebar();
})

// ------------------------------------------

document.getElementById('back-to-top').addEventListener('click', function(){
    window.scrollTo({
        top : 0,
        behavior : 'smooth'
    })
})