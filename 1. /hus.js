const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//sky
ctx.beginPath();
ctx.moveTo(0, 50);
ctx.lineTo(250, 175);
ctx.lineTo(500, 20);
ctx.lineTo(800, 100);
ctx.stroke();

//sun
ctx.beginPath();
ctx.arc(250, 75, 50, 0, Math.PI * 2);
ctx.fillStyle = "yellow";
ctx.fill();
ctx.stroke();

//walls
ctx.beginPath();
ctx.moveTo(400, 300);
ctx.lineTo(525, 175);
ctx.lineTo(650, 300);
ctx.lineTo(650, 300);
ctx.lineTo(650, 500);
ctx.lineTo(400, 500);
ctx.closePath();
ctx.fillStyle = "beige";
ctx.fill();
ctx.stroke();


//roof
ctx.beginPath();
ctx.moveTo(375, 320);
ctx.lineTo(525, 175);
ctx.lineTo(675, 320);
ctx.save();
ctx.strokeStyle = "sienna";
ctx.lineWidth = 5;
ctx.stroke();
ctx.restore();

//windows
ctx.fillStyle = "lightblue";
ctx.fillRect(435, 335, 50, 50);
ctx.strokeStyle = "black"
ctx.strokeRect(435, 335, 50, 50);

ctx.fillStyle = "lightblue";
ctx.fillRect(565, 335, 50, 50);
ctx.strokeStyle = "black"
ctx.strokeRect(565, 335, 50, 50);

//window round
ctx.beginPath();
ctx.arc(525, 275, 25, 0, Math.PI * 2);
ctx.fillStyle = "lightblue";
ctx.fill();
ctx.stroke();
ctx.beginPath();
ctx.moveTo(525, 250);
ctx.lineTo(525, 300);
ctx.moveTo(500, 275);
ctx.lineTo(550, 275);
ctx.stroke();

//door
ctx.fillStyle = "saddlebrown";
ctx.fillRect(490, 410, 75, 90);
ctx.strokeRect(490, 410, 75, 90);

