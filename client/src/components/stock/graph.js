const dimenstion = {
    height: 300,
    graphHeight: 300 - 20
};

// offset in x axis
const xoffset = {
    left: 100,
    right: 10
}

var ctx, dots = [];
export function graph(c, data, pred, dates) {

    let maxdata = data;
    if(data.length==0) {
        maxdata = [0];
    }

    // find max numberic value in data
    var max = Math.ceil(Math.max(...maxdata,...pred) / 50) * 50;
    max = (max === 0) ? 50 : max;

    dimenstion.width = document.getElementById("graph").offsetWidth;
    ctx = c.getContext("2d");
    ctx.canvas.width = dimenstion.width;
    dots = [];

    // outer frame
    ctx.beginPath();
    ctx.strokeStyle = "#495175";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(xoffset.left / 2, 1, dimenstion.width - xoffset.left / 2 - xoffset.right, dimenstion.graphHeight);

    // frame lines
    const gap = (dimenstion.graphHeight) / 5;
    ctx.moveTo(xoffset.left / 2, gap);
    for (let i = 1; i < 5; i++) {
        ctx.lineTo(dimenstion.width - xoffset.right, i * gap);
        ctx.moveTo(xoffset.left / 2, (i + 1) * gap);
    }
    ctx.stroke();

    // y axis details
    ctx.beginPath();
    ctx.font = "12px Calibri";
    ctx.fillStyle = "#8a8a8a";
    for (let i = 0; i < 5; i++) {
        let off = (i == 0) ? 0 : 5;
        let yval = max / 5 * (5 - i);
        ctx.fillText(yval, xoffset.left / 2 - ctx.measureText(yval).width - 5, 10 + gap * i - off);
    }
    ctx.fillText("0", xoffset.left / 2 - 10, dimenstion.graphHeight);


    // x axis details
    const graphwidth = dimenstion.width - xoffset.left - xoffset.right;
    const barwidth = graphwidth / dates.length;
    const baroffset = barwidth / 2 + xoffset.left / 2;
    for (let i = 0; i < dates.length; i++) {
        const xval = dates[i];
        const xposition = barwidth * i + baroffset - ctx.measureText(xval).width / 2;
        ctx.fillText(xval, xposition, dimenstion.height - 5);
    }
    ctx.stroke();

    if(data.length>0) {
        drawLine(baroffset,data,max,graphwidth,barwidth);
        drawLine(baroffset,pred,max,graphwidth,barwidth,true);
    }
    return dots;
}

function drawLine(baroffset,data,max,graphwidth,barwidth,ispred=false) {
    var linegrad = ctx.createLinearGradient(baroffset, Y(data[0], max), graphwidth, dimenstion.graphHeight);
    linegrad.addColorStop(0, (ispred ? "#fff6d3" : "#53c4ee"));
    linegrad.addColorStop(1, (ispred ? "#ffeca4" : "#8bd6f2"));

    // graph line
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = linegrad;
    ctx.moveTo(baroffset, Y(data[0], max));
    for (let i = 0; i < data.length; i++) {
        const xposition = barwidth * i + baroffset;
        dots.push({ x: xposition, y: Y(data[i], max), val: data[i] });
        ctx.lineTo(dots[dots.length-1].x, dots[dots.length-1].y);
    }
    ctx.stroke();
    ctx.lineTo(dots[dots.length-1].x, dimenstion.graphHeight);
    ctx.lineTo(baroffset, dimenstion.graphHeight);
    ctx.closePath();

    // gradient shadow
    var x1 = barwidth/2 + xoffset.left, y1 = 0;
    var x2 = x1, y2 = dimenstion.graphHeight;
    var fillgrad = ctx.createLinearGradient(x1, y1, x2, y2);

    fillgrad.addColorStop(0, (ispred ? "#f2e78b57" : "#8bd6f257"));
    fillgrad.addColorStop(1, "#ffffff00");
    ctx.fillStyle = fillgrad;
    ctx.fill();
}

function Y(val, max) {
    return dimenstion.graphHeight - (val / (max===0?1:max)) * dimenstion.graphHeight;
}

