// fork of
// http://jsfiddle.net/jonnyc/Ujz4P/5/
//
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;

// Create an array to store our particles
var particles = [];
// The amount of particles to render
var particleCount = 80;
if (x <= 600) {
    particleCount = 20;
}

var lastposition = 0;
// The maximum velocity in each direction
var maxVelocity = 2;
// The target frames per second (how often do we want to update / redraw the scene)
var targetFPS = 12;
var fadedIn = false;
var fadingIn = true;
var backgroundOpacity = 0;

var backgroundOpacityInterval;
// Set the dimensions of the canvas as variables so they can be used.
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
// borders for particles on top and bottom
var borderTop = 0.01 * canvasHeight;
var borderBottom = 0.99 * canvasHeight;
// Create an image object (only need one instance)

var player;
var imageObj = new Image();
// Once the image has been downloaded then set the image on all of the particles
imageObj.onload = function () {
    particles.forEach(function (particle) {
        particle.setImage(imageObj);
    });
};
// Once the callback is arranged then set the source of the image
imageObj.src = "img/smoke.png";

// A function to create a particle object.
function Particle(context) {
    // Set the initial x and y positions
    this.x = 0;
    this.y = 0;
    // Set the initial velocity
    this.xVelocity = 0;
    this.yVelocity = 0;
    // Set the radius
    this.radius = 15;
    // Store the context which will be used to draw the particle
    this.context = context;
    // The function to draw the particle on the canvas.
    this.draw = function () {
        // If an image is set draw it
        if (this.image) {
            this.context.drawImage(this.image, this.x - 128, this.y - 128);
            // If the image is being rendered do not draw the circle so break out of the draw function
            return;
        }
        // Draw the circle as before, with the addition of using the position and the radius from this object.
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = "rgba(0, 255, 255, 0.1)";
        this.context.fill();
        this.context.closePath();
    };
    // Update the particle.
    this.update = function () {
        // Update the position of the particle with the addition of the velocity.
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        // Check if has crossed the right edge
        if (this.x >= canvasWidth) {
            this.xVelocity = -this.xVelocity;
            this.x = canvasWidth;
        }
        // Check if has crossed the left edge
        else if (this.x <= 0) {
            this.xVelocity = -this.xVelocity;
            this.x = 0;
        }
        // Check if has crossed the bottom edge
        if (this.y >= borderBottom) {
            this.yVelocity = -this.yVelocity;
            this.y = borderBottom;
        }
        // Check if has crossed the top edge
        else if (this.y <= borderTop) {
            this.yVelocity = -this.yVelocity;
            this.y = borderTop;
        }
    };
    // A function to set the position of the particle.
    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    // Function to set the velocity.
    this.setVelocity = function (x, y) {
        this.xVelocity = x;
        this.yVelocity = y;
    };
    this.setImage = function (image) {
        this.image = image;
    };
}

// A function to generate a random number between 2 values
function generateRandom(min, max) {
    return Math.random() * (max - min) + min;
}

// The canvas context if it is defined.
var context;

// Initialise the scene and set the context if possible
function init() {
    var canvas = document.getElementById('myCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (canvas.getContext) {
        // Set the context variable so it can be re-used
        context = canvas.getContext('2d');
        // Create the particles and set their initial positions and velocities
        for (var i = 0; i < particleCount; ++i) {
            var particle = new Particle(context, i);
            // Set the position to be inside the canvas bounds
            particle.setPosition(generateRandom(0, canvasWidth), generateRandom(borderTop, borderBottom));
            // Set the initial velocity to be either random and either negative or positive
            particle.setVelocity(generateRandom(-maxVelocity, maxVelocity), generateRandom(-maxVelocity, maxVelocity));
            particles.push(particle);
        }
    }
}

// The function to draw the scene
function draw() {
    //  background image
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.globalAlpha = backgroundOpacity;
    context.globalCompositeOperation = 'source-over';
    var wrh = backImg.width / backImg.height;
    var newWidth = canvasWidth;
    var newHeight = newWidth / wrh;
    if (newHeight > canvasHeight) {
        newHeight = canvasHeight;
        newWidth = newHeight * wrh;
    }
    context.drawImage(backImg, canvasWidth / 2 - newWidth / 2, canvasHeight / 2 - newHeight / 2, newWidth, newHeight);
    context.globalAlpha = 0.75;
    context.globalCompositeOperation = 'soft-lights';
    // Fog layer
    // Go through all of the particles and draw them.
    particles.forEach(function (particle) {
        particle.draw();
    });

}

// Update the scene
function update() {
    if (!fadedIn && fadingIn) {
        backgroundOpacity += 0.01;
        if (backgroundOpacity >= 1) {
            backgroundOpacity = 1;
            fadedIn = true;
            fadingIn = false;
        }
    }
    var canvas = document.getElementById('myCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
// borders for particles on top and bottom
    borderTop = 0.01 * canvasHeight;
    borderBottom = 0.99 * canvasHeight;

    particles.forEach(function (particle) {
        particle.update();
    });
}

// Initialize the scene
init();
var backImg = document.getElementById("back");
// If the context is set then we can draw the scene (if not then the browser does not support canvas)
if (context) {
    setInterval(function () {
        // Update the scene befoe drawing
        update();
        // Draw the scene
        draw();
    }, 1000 / targetFPS);
}

$(document).ready(function () {
    $("#myCanvas, #continue").click(function (event) {
        $("#continue").hide();
        $("body").animate({backgroundColor: "#000000"}, 3000);
        fadingIn = false;
        backgroundOpacityInterval = setInterval(function () {
            backgroundOpacity -= 0.005;
            if (backgroundOpacity <= 0.2) {
                clearInterval(backgroundOpacityInterval);
                backgroundOpacity = 0.2;

                $("#logo").fadeIn(1000, function () {
                    $("#description").fadeIn(2000, function () {
                        $("#footer").fadeIn(500);
                    });
                });
            }
        }, 10);
    });

    setTimeout(function () {
        $("#continue").fadeIn(1000);
    }, 5000);


    $("#scrollUp").click(function (e) {
        $('html, body').animate({
            scrollTop: $("#logo").offset().top
        }, 500);
    });

    $(window).scroll(function () {
        var pos = $(window).scrollTop();
        var myTab = $('#myTab');

        if (pos > 130 && pos < lastposition) {
            myTab.addClass('scrolled');
            myTab.slideDown('fast');
        } else if (pos <= 130) {
            myTab.removeClass('scrolled');
            myTab.show();
        } else {
            myTab.hide();
        }
        lastposition = pos;
    });

    var hash = window.location.hash;
    hash && $('ul.nav a[href="' + hash + '"]').tab('show');
});
