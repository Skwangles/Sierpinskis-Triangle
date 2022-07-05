const canvas = document.getElementById("canvas");
const loadingLabel = document.getElementById("LoadingLabel")
const STAGES_TO_GENERATE = 9;
const ctx = canvas.getContext("2d");
const TITLESPACE_PADDING = 150;
let sierpinskiTriangleStages = [];

class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    findHalfway(pointB){
        let X = (this.x + pointB.x)/2
        let Y = (this.y + pointB.y)/2
        return new Point(X, Y);
    }
}

class Triangle{
    constructor(pointA, pointB, pointC){
        this.pointA = pointA;
        this.pointB = pointB;
        this.pointC = pointC;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.pointA.x, this.pointA.y);
        ctx.lineTo(this.pointB.x, this.pointB.y);
        ctx.lineTo(this.pointC.x, this.pointC.y);
        ctx.lineTo(this.pointA.x, this.pointA.y);
        ctx.closePath();
        ctx.fillStyle = "Red";
        ctx.fill();
    }

    generateSubTriangles(){
        let subTriangles = [
            new Triangle(this.pointA, this.pointA.findHalfway(this.pointB), this.pointA.findHalfway(this.pointC)) ,//Top sub triangle
            new Triangle(this.pointA.findHalfway(this.pointB), this.pointB, this.pointB.findHalfway(this.pointC)) ,//Left sub triangle
            new Triangle(this.pointA.findHalfway(this.pointC), this.pointB.findHalfway(this.pointC), this.pointC) //Right sub triangle
        ]
        return subTriangles
    }
}

function setupCanvas(){
    canvas.width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);//Set to view port
    canvas.height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - TITLESPACE_PADDING;//set to view port

    const startingLength = canvas.height/Math.sin(Math.PI/3);
    const startingX = canvas.width/2;
    const startingY = 0;
    const differenceY = Math.sqrt(Math.pow(startingLength, 2) - Math.pow(startingLength/2, 2));
    return [[new Triangle(new Point(startingX, startingY), new Point(startingX - startingLength/2, startingY + differenceY), new Point(startingX + startingLength/2, startingY + differenceY,))]];    
}

function drawArr(triangleArr, stageNum){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(tri in triangleArr){
        let triangle = triangleArr[tri];
        triangle.draw(ctx);
    }
    ctx.font = '16px serif';
  ctx.fillText("Stage Number: " + (stageNum + 1), 10, 50);
}

function calculateStages(){
    canvas.hidden = true;
    loadingLabel.hidden = false;
    for(let i = 0; i < STAGES_TO_GENERATE; i++){
        let triangleArr = [];
        for(tri in sierpinskiTriangleStages[i]){
            let triangle = sierpinskiTriangleStages[i][tri];
            let subTriangles = triangle.generateSubTriangles();
            for(sub in subTriangles){
                let subTriangle = subTriangles[sub];
                triangleArr.push(subTriangle);
            }
        }
        sierpinskiTriangleStages.push(triangleArr);
    }
    loadingLabel.hidden = true;
    canvas.hidden = false;
}

//
//------SETUP------
//

sierpinskiTriangleStages = setupCanvas();

calculateStages();


//Draw click loop
let stageOfCalc = 0;
drawArr(sierpinskiTriangleStages[stageOfCalc], stageOfCalc);
document.addEventListener("click", ()=>{
    drawArr(sierpinskiTriangleStages[stageOfCalc], stageOfCalc);
    stageOfCalc++;
    stageOfCalc = stageOfCalc % sierpinskiTriangleStages.length;
});


document.addEventListener("resize", ()=>{
    setupCanvas(startingY);
    calculateStages();
});


