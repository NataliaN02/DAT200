const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//attachment points of the elastic
const leftPoint = { x: 150, y: 300 };
const rightPoint = { x: 450, y: 300 };

// original position of center point
const originalCenter = { x: 300, y: 300 };

// current position of center point 
let center = { x: originalCenter.x, y: originalCenter.y };

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //background
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //rect
    ctx.fillStyle = "red";
    ctx.fillRect(150, 150, 300, 300);

    //line left
    ctx.beginPath();
    ctx.moveTo(leftPoint.x, leftPoint.y);
    ctx.lineTo(center.x, center.y);
    ctx.stroke();

    //line right
    ctx.beginPath();
    ctx.moveTo(rightPoint.x, rightPoint.y);
    ctx.lineTo(center.x, center.y);
    ctx.stroke();

    //circle
    ctx.beginPath();
    ctx.arc(center.x, center.y, 5, 0, 2 * Math.PI);
    ctx.stroke();
}

draw();

//cursor shift
let isHeld = false;

function isInsideArea(x, y) {
    return x >= center.x - 5 && x <= center.x + 5 && y >= center.y - 5 && y <= center.y + 5;
}

function releaseElastic() {
    if (isHeld) {
        isHeld = false;
        center.x = originalCenter.x;
        center.y = originalCenter.y;
        canvas.style.cursor = "auto";
        draw();
    }
}

canvas.addEventListener("mousedown", function (e) {
    let currx = e.clientX - canvas.offsetLeft; 
    let curry = e.clientY - canvas.offsetTop;  
    if (isInsideArea(currx, curry)) {  
        isHeld = true;
        canvas.style.cursor = "pointer";
    }
}, false);

canvas.addEventListener("mousemove", function (e) {
    let currx = e.clientX - canvas.offsetLeft;
    let curry = e.clientY - canvas.offsetTop;

    if (isHeld) {
        center.x = currx;
        center.y = curry;
        canvas.style.cursor = "pointer";
        draw();
    } else {
        if (isInsideArea(currx, curry)) {
            canvas.style.cursor = "pointer";
        } else {
            canvas.style.cursor = "auto";
        }
    }
});

canvas.addEventListener("mouseup", releaseElastic);
document.addEventListener("mouseup", releaseElastic);
//canvas.addEventListener("mouseleave", releaseElastic);