let joints = [];
let poems = [];
let draggingJoint = null;
let offsetX = 0;
let offsetY = 0;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("cigarette-canvas");
  noLoop();

  fetch('pedro_pietri_poems.json')
    .then(response => response.json())
    .then(data => {
      poems = data.poems || data;
      createGridJoints(15);
      redraw();
    })
    .catch(error => console.error('Error loading poems:', error));
}

function draw() {
  background(255, 105, 180);

  for (let joint of joints) {
    drawJoint(joint);
    if (joint.lit) {
      joint.burnedLength += 0.5;
      joint.smokeOffset += 0.01;
      if (joint.burnedLength > 300) {
        joint.lit = false;
      }
    }
  }
}

function mousePressed() {
  for (let joint of joints) {
    let dx = mouseX - joint.x;
    let dy = mouseY - joint.y;
    if (sqrt(dx * dx + dy * dy) < 30) {
      draggingJoint = joint;
      offsetX = dx;
      offsetY = dy;
      joint.lit = true;
      joint.burnedLength = 0;
      joint.smokeOffset = 0;
      showPoem(joint.poem);
      break;
    }
  }
}

function mouseDragged() {
  if (draggingJoint) {
    draggingJoint.x = mouseX - offsetX;
    draggingJoint.y = mouseY - offsetY;
    redraw();
  }
}

function mouseReleased() {
  draggingJoint = null;
}

function createGridJoints(count) {
  joints = [];

  const rows = 2;
  const cols = 8;
  
  const spacingX = 60;  // tighter horizontal spacing
  const spacingY = 100; // vertical spacing
  
  const startX = width / 2 - (cols - 1) * spacingX / 2;
  const startY = height / 2 - (rows - 1) * spacingY / 2;
  
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (index >= count) break;
  
      const x = startX + col * spacingX;
      const y = startY + row * spacingY;
  
      joints.push({
        x: x,
        y: y,
        lit: false,
        burnedLength: 0,
        smokeOffset: 0,
        poem: poems[index % poems.length]
      });
  
      index++;
    }
  }

  redraw();
}


function drawJoint(joint) {
  push();
  translate(joint.x, joint.y);
  rotate(HALF_PI); // Rotate 90 degrees to make the joint vertical

  let burn = joint.burnedLength;
  let bodyLength = max(340 - burn, 30);
  let bodyHeight = 20;

  // Draw joint cylinder with shading lines
  for (let i = 0; i < bodyHeight; i++) {
    let c = lerpColor(color('#e7caa4'), color('#b08968'), i / bodyHeight);
    stroke(c);
    line(0, i, bodyLength, i);
  }

  // Front ellipse (ember or end)
  if (joint.lit) {
    noStroke();
    fill(255, random(80, 140), 20);
    ellipse(0, bodyHeight / 2, 18 + random(-2, 2), 18 + random(-2, 2));
    fill(255, 180, 100, 100);
    ellipse(0, bodyHeight / 2, 26, 26);
  } else {
    fill('#661111');
    noStroke();
    ellipse(0, bodyHeight / 2, 18, 18);
  }

  // Back filter (brown cap)
  fill('#5c3b18');
  noStroke();
  rect(bodyLength, 0, 14, bodyHeight, 5);

  // Filter cap shading
  fill(80, 50, 30, 100);
  rect(bodyLength + 8, 0, 4, bodyHeight, 3);

  // Top gloss
  fill(255, 255, 255, 20);
  beginShape();
  vertex(10, 4);
  vertex(bodyLength - 5, 4);
  vertex(bodyLength - 5, 8);
  vertex(10, 8);
  endShape(CLOSE);

  pop();
}

function showPoem(poem) {
  const container = document.getElementById('poems-container');
  container.innerHTML = '';

  const poemDiv = document.createElement('div');
  poemDiv.className = 'poem';

  const title = document.createElement('h3');
  title.textContent = poem.title;

  const content = document.createElement('pre');
  content.textContent = poem.content;

  poemDiv.appendChild(title);
  poemDiv.appendChild(content);
  container.appendChild(poemDiv);
}
