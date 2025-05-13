
function setup() {
    createCanvas(400, 400);
  }
  
  function draw() {
    background(54, 69, 79);
    let numRects = 10;
    let squareSize = width/numRects;
    noLoop();
  
    
    for (let y=0; y < numRects; y++){
        for (let x=0; x < numRects; x++){
          noStroke();
          fill(generateRandomColor());
          let drawSize = random(15, 35);
          ellipse(x*squareSize+squareSize/2, y*squareSize+squareSize/2 ,random(drawSize),drawSize);
        }
    }
  }
  function generateRandomColor(){
    return color(random(0,170), random(0,200), random(0,252));
  }