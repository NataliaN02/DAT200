const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const controlPoints = [];
const n = 20;


canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  controlPoints.push({ x, y });     
  redraw();
});


// Drawing a B-spline curve
const drawBSpline = (i, n, ctx) => {
  const curvePoints = [];
  const delta = 1.0 / n;

  for (let j = 0; j <= n; j++) {
    const t = j * delta;
    curvePoints[j] = {};

    curvePoints[j].x = Math.round(
      controlPoints[i - 3].x * (1.0 - t) * (1.0 - t) * (1.0 - t) / 6.0
      + controlPoints[i - 2].x * (3.0 * t * t * t - 6.0 * t * t + 4.0) / 6.0
      + controlPoints[i - 1].x * (-3.0 * t * t * t + 3.0 * t * t + 3.0 * t + 1.0) / 6.0
      + controlPoints[i].x * t * t * t / 6.0);
    curvePoints[j].y = Math.round(
      controlPoints[i - 3].y * (1.0 - t) * (1.0 - t) * (1.0 - t) / 6.0
      + controlPoints[i - 2].y * (3.0 * t * t * t - 6.0 * t * t + 4.0) / 6.0
      + controlPoints[i - 1].y * (-3.0 * t * t * t + 3.0 * t * t + 3.0 * t + 1.0) / 6.0
      + controlPoints[i].y * t * t * t / 6.0);
  }

  ctx.strokeStyle = "black";
  for (let j = 0; j < n; j++) {
    ctx.beginPath();
    ctx.moveTo(curvePoints[j].x, curvePoints[j].y);
    ctx.lineTo(curvePoints[j + 1].x, curvePoints[j + 1].y);
    ctx.stroke();
  }
};


//Redraw function
const redraw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // little circles for control points
  for (const p of controlPoints) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
  ctx.fill();
}

  // b-spline curve: from 4 points onwards
  for (let i = 3; i < controlPoints.length; i++) {
    drawBSpline(i, n, ctx);   
  }
};