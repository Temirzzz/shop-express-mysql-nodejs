let upBtn = document.querySelector('.up-to-top');
let scroled;
let timer;


upBtn.onclick = function toTop() {
    console.log(window.pageYOffset);
    scroled = window.pageYOffset;    
    //window.scrollTo(0, 0);
    scrollToTop();
}

function scrollToTop () {
    if (scroled > 0) {
        window.scrollTo(0, scroled);
        scroled = scroled -100; // скорость прокрутки
        timer = setTimeout(scrollToTop, 100);
    }
    else {
        clearTimeout(timer);
        window.scrollTo(0,0);
    }
}
