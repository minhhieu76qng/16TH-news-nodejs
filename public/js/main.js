var isStick = false;

function DisplayHeader() {
    let headerHeight = document.getElementById('header').clientHeight;

    if (headerHeight < window.scrollY) {
        if (isStick === false) {
            document.getElementById('header').querySelector('.top-header').style.display = 'none';

            // document.getElementById('header').style.cssText = 'position: fixed; top : 0; width: 100%;';
            document.getElementById('header').classList.add('fixed-top');
            document.getElementById('nav-search').querySelector('.container').classList.add('container-fluid');
            document.getElementById('nav-search').querySelector('.container').classList.remove('container');

            // document.getElementById('nav-search').querySelector('.container-fluid .sub-logo').style.display = 'block';
            // document.getElementById('nav-search').querySelector('.main-nav .sub-logo').style.display = 'block';

            isStick = true;
        }
    }
    else {
        if (isStick === true) {
            document.getElementById('header').querySelector('.top-header').style.display = '';

            // document.getElementById('header').style.cssText = ''
            document.getElementById('header').classList.remove('fixed-top');

            document.getElementById('nav-search').querySelector('.container-fluid').classList.add('container');
            document.getElementById('nav-search').querySelector('.container-fluid').classList.remove('container-fluid');

            // document.getElementById('nav-search').querySelector('.container .sub-logo').style.display = 'none';
            // document.getElementById('nav-search').querySelector('.main-nav .sub-logo').style.display = 'none';
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
    
    // kiem tra neu kich thuoc man hinh < 768 thi remove active_sidebar
    if (document.body.clientWidth < 768){

        if (sidebar.classList.contains('active_sidebar')){
            sidebar.classList.remove('active_sidebar');
        }
    }
    else{

        if (!sidebar.classList.contains('active_sidebar')){
            sidebar.classList.add('active_sidebar');
        }
    }

    if (!sidebar.classList.contains("active_sidebar")){
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

    DisplayHeader();
})

// ------------------------------------------

document.getElementById('back-to-top').addEventListener('click', function(){
    window.scrollTo({
        top : 0,
        behavior : 'smooth'
    })
})

//-----------------------------------
function openSignUp()
{
    document.getElementById('divSignIn').style.display = 'none';
    document.getElementById('divSignUp').style.display = 'block';
    document.getElementById('LogInModalLabel').innerHTML = "Đăng ký";
}

function openForgotPass()
{
    document.getElementById('divSignIn').style.display = 'none';
    document.getElementById('divForgotPass').style.display = 'block';
    document.getElementById('LogInModalLabel').innerHTML = "Quên mật khẩu";
}

$('#LogInModal').on('hidden.bs.modal', function () {
    
    document.getElementById('divSignIn').style.display = 'block';
    document.getElementById('divSignUp').style.display = 'none';
    document.getElementById('divForgotPass').style.display = 'none';
    document.getElementById('LogInModalLabel').innerHTML = "Đăng nhập";
})


// Kiểm tra form SignUp ----------------------
function checkDataSignUp() {
    let txtPassword = document.getElementById('txtPassword');
    let txtEmail = document.getElementById('txtEmail');
    let txtRepeatPassword = document.getElementById('txtRepeatPassword');

    if ((txtEmail.value.indexOf('@') == -1 || txtEmail.value.substring(txtEmail.value.indexOf('@') + 1, txtEmail.value.length).indexOf('.') === -1)){
        document.getElementById("wrongEmail").style.display = 'block';
		return false;
    }
    else{
        document.getElementById("wrongEmail").style.display = 'none';
    }
    
    if(txtPassword.value.length<6){
        document.getElementById("shortPass").style.display = 'block';
		return false;
    }
    else{
        document.getElementById("shortPass").style.display = 'none';
    }

    if(txtPassword.value !== txtRepeatPassword.value){
        document.getElementById("incorrectRePass").style.display = 'block';
		return false;
    }
    else{
        document.getElementById("incorrectRePass").style.display = 'none';
    }

    return true;
}

function checkDataForgotPass() {
    let txtEmail = document.getElementById('txtEmail-Forgot');

    if ((txtEmail.value.indexOf('@') == -1 || txtEmail.value.substring(txtEmail.value.indexOf('@') + 1, txtEmail.value.length).indexOf('.') === -1)){
        document.getElementById("wrongEmail-Forgot").style.display = 'block';
		return false;
    }
    else{
        document.getElementById("wrongEmail-Forgot").style.display = 'none';
    }

    return true;
}

function checkDataLogIn(){
    let txtEmail = document.getElementById('txtUsername');
    if ((txtEmail.value.indexOf('@') == -1 || txtEmail.value.substring(txtEmail.value.indexOf('@') + 1, txtEmail.value.length).indexOf('.') === -1)){
        document.getElementById("wrongUsername").style.display = 'block';
		return false;
    }
    else{
        document.getElementById("wrongUsername").style.display = 'none';
    }

    return true;
}

function backLogIn()
{
    document.getElementById('divSignIn').style.display = 'block';
    document.getElementById('divSignUp').style.display = 'none';
    document.getElementById('divForgotPass').style.display = 'none';
    document.getElementById('LogInModalLabel').innerHTML = "Đăng nhập";
}
