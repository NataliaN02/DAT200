const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let points = [];

let isDrawing = false;

let translMode = false;
let scaleMode = false;
let rotMode = false;

const newPolygonBtn = document.getElementById("newPolygonBtn");
const translBtn = document.getElementById("translBtn");
const scaleBtn = document.getElementById("scaleBtn");
const rotBtn = document.getElementById("rotBtn");

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.closePath();
        ctx.stroke();
    }
}

// Defining middle point

function centroid(pts) {
    const n = pts.length;

    if (n === 0) return { x: 0, y: 0 };

    let sx = 0;
    let sy = 0;

    for (const p of pts) {
        sx += p.x;
        sy += p.y;
    }

    return {
        x: sx / n,
        y: sy / n
    };
}

// Transformation functions

function scalePolygon(scale) {
    if (points.length === 0) return;

    const c = centroid(points);

    points = points.map(p => ({
        x: c.x + (p.x - c.x) * scale,
        y: c.y + (p.y - c.y) * scale
    }));
}


function rotatePolygon(deg) {
    if (points.length === 0) return;

    const rad = deg * Math.PI / 180;

    const c = centroid(points);

    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    points = points.map(p => {

        const vx = p.x - c.x;
        const vy = p.y - c.y;

        return {
            x: c.x + vx * cos - vy * sin,
            y: c.y + vx * sin + vy * cos
        };

    });
}

// Buttons for transformations

newPolygonBtn.addEventListener("click", function () {
    isDrawing = true;

    points = [];

    draw();
});

    //Adding points

canvas.addEventListener("mousedown", function (e) {

    if (isDrawing) {

        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;

        points.push({
            x: x,
            y: y
        });

        draw();
    }

});


translBtn.addEventListener("click", function () {

    isDrawing = false;

    translMode = true;
    scaleMode = false;
    rotMode = false;

});


scaleBtn.addEventListener("click", function () {

    isDrawing = false;

    scaleMode = true;
    translMode = false;
    rotMode = false;

});


rotBtn.addEventListener("click", function () {

    isDrawing = false;

    rotMode = true;
    translMode = false;
    scaleMode = false;

});


/* 
Keyboard controls:
    WASD - translation
    ArrowUp/ArrowDown - scaling
    ArrowLeft/ArrowRight - rotation
*/

window.addEventListener('keydown', function (e) {

    if (points.length === 0) return;

    const transStep = 10;

    const scaleUp = 1.10;
    const scaleDown = 0.90;

    const rotStep = 10;

    let moved = false;

    const key = e.key.toLowerCase();


    // Translation

    if (translMode) {

        if (key === 'w') {
            points = points.map(p => ({
                x: p.x,
                y: p.y - transStep
            }));
            moved = true;
        } else if (key === 's') {
            points = points.map(p => ({
                x: p.x,
                y: p.y + transStep
            }));
            moved = true;
        } else if (key === 'a') {
            points = points.map(p => ({
                x: p.x - transStep,
                y: p.y
            }));
            moved = true;
        } else if (key === 'd') {
            points = points.map(p => ({
                x: p.x + transStep,
                y: p.y
            }));
            moved = true;
        }
    }


    // Scaling

    else if (scaleMode) {
        if (e.key === 'ArrowUp') {
            scalePolygon(scaleUp);
            moved = true;
        } else if (e.key === 'ArrowDown') {
            scalePolygon(scaleDown);
            moved = true;
        }
    }


    // Rotation

    else if (rotMode) {
        if (e.key === 'ArrowRight') {
            rotatePolygon(rotStep);
            moved = true;
        } else if (e.key === 'ArrowLeft') {
            rotatePolygon(-rotStep);
            moved = true;
        }
    }


    if (moved) {
        e.preventDefault();
        draw();
    }

});
