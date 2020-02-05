// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function mouseParallax(id, top, left, mouseX, mouseY, speed) {
    var obj = document.getElementById(id);

    var parentObj = obj.parentNode;
    var containerWidth = parseInt(parentObj.offsetWidth);
    var containerHeight = parseInt(parentObj.offsetHeight);

    obj.style.left = (left - (((mouseX - (parseInt(obj.offsetWidth) / 2 + left)) / containerWidth) * (speed))) - 25 + 'px';
    obj.style.top = (top - (((mouseY - (parseInt(obj.offsetHeight) / 2 + top)) / containerHeight) * speed)) - 25 + 'px';
}

$(document).ready(function () {

    $("#logo").click(function (event) {
        event.preventDefault();
        $("#logo").fadeOut(1000);
        $("#cover-tar").fadeIn(1000);
        $("#text").fadeIn(1000);
    });


    disableScroll();


    var parallaxBox = document.getElementById('description');
    var skyLeft = document.getElementById('cover-sky').offsetLeft;
    var groundLeft = document.getElementById('cover-ground').offsetLeft;
    var tarLeft = document.getElementById('cover-tar').offsetLeft;
    var treeLeft = document.getElementById('cover-tree').offsetLeft;
    var starsLeft = document.getElementById('cover-stars').offsetLeft;

    var skyTop = document.getElementById('cover-sky').offsetTop;
    var groundTop = document.getElementById('cover-ground').offsetTop;
    var tarTop = document.getElementById('cover-tar').offsetTop;
    var treeTop = document.getElementById('cover-tree').offsetTop;
    var starsTop = document.getElementById('cover-stars').offsetTop;

    parallaxBox.onmousemove = function (event) {
        if (Date.now() % 3 === 0) {
            return false;
        }
        event = event || window.event;
        var x = event.clientX - parallaxBox.offsetLeft;
        var y = event.clientY - parallaxBox.offsetTop;

        mouseParallax('cover-stars', starsTop, starsLeft, x, y, 50);
        mouseParallax('cover-sky', skyTop, skyLeft, x, y, 40);
        mouseParallax('cover-ground', groundTop, groundLeft, x, y, 25);
        mouseParallax('cover-tar', tarTop, tarLeft, x, y, 0);
        mouseParallax('cover-tree', treeTop, treeLeft, x, y, 5);
    };


});
