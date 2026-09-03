const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellW = canvas.width / 4;
    const cellH = canvas.height / 4;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {

            const offsetX = col * cellW;
            const offsetY = row * cellH;

            let corners = [
                { x: offsetX, y: offsetY },
                { x: offsetX + cellW, y: offsetY },
                { x: offsetX + cellW, y: offsetY + cellH },
                { x: offsetX, y: offsetY + cellH }
            ];

            const p = ((row + col) % 2 === 0) ? 0.1 : 0.9;

            ctx.beginPath();
            ctx.rect(offsetX, offsetY, cellW, cellH);
            ctx.stroke();

            for (let j = 0; j < 25; j++) {
                let newCorners = [];

                ctx.beginPath();
                for (let i = 0; i < corners.length; i++) {
                    let newX = (1 - p) * corners[i].x + p * corners[(i + 1) % corners.length].x;
                    let newY = (1 - p) * corners[i].y + p * corners[(i + 1) % corners.length].y;
                    newCorners.push({ x: newX, y: newY });
                    if (i === 0) {
                        ctx.moveTo(newX, newY);
                    } else {
                        ctx.lineTo(newX, newY);
                    }
                }

                ctx.closePath();
                ctx.stroke();

                corners = newCorners;
            }
        }
    }
}
draw();