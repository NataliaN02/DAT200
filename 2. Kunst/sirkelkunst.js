const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

//radius
const a = canvas.height / 2;
const b = canvas.width / 2;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //background
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const numPoints = parseInt(document.getElementById("antall").value);
    const kValue = document.getElementById("k").value;

    const k = (kValue === "max") ? numPoints : parseInt(kValue);

    const angleStep = (2 * Math.PI) / numPoints;

    //circle
    ctx.beginPath();

    for (let i = 0; i <= numPoints; i++) {
        const v = i * angleStep;
        const x = a * Math.cos(v);
        const y = b * Math.sin(v);

        const pointX = centerX + x;
        const pointY = centerY + y;

        if (i === 0) {
            ctx.moveTo(pointX, pointY);
        } else {
            ctx.lineTo(pointX, pointY);
        }
    }
    ctx.stroke();

    //lines
    ctx.beginPath();

    for (let i = 0; i <= numPoints; i++) {
        const v = i * angleStep;
        const x = a * Math.cos(v);
        const y = b * Math.sin(v);
        const n = (k * i) % numPoints;

        const pointX = centerX + x;
        const pointY = centerY + y;

        const nV = n * angleStep;
        const nX = centerX + a * Math.cos(nV);
        const nY = centerY + b * Math.sin(nV);

        ctx.moveTo(pointX, pointY);
        ctx.lineTo(nX, nY);
    }
    ctx.stroke();
}
draw();