let joints = [];
let poems = [];
let litJoint = null;
let draggingJoint = null;
let offsetX = 0;
let offsetY = 0;

function setup() {
  let cnv = createCanvas(windowWidth * 0.8, windowHeight * 0.6); // scaled-down canvas
  cnv.parent("cigarette-canvas");
  noLoop();

  fetch('pedro_pietri_poems.json')
    .then(response => response.json())
    .then(data => {
      poems = data.poems || data;
      createGridJoints(16); // fill 2x8
      redraw();
    })
    .catch(error => console.error('Error loading poems:', error));
}

function draw() {
  background(0,0,0);

  for (let joint of joints) {
    drawJoint(joint);
    if (joint.lit) {
      joint.burnedLength += 0.3; // slower burn
      joint.smokeOffset += 0.005;
      if (joint.burnedLength > 170) {
        joint.lit = false;
      }
    }
  }
}

function mousePressed() {
  if (litJoint) litJoint.lit = false;

  for (let joint of joints) {
    let dx = mouseX - joint.x;
    let dy = mouseY - joint.y;
    if (sqrt(dx * dx + dy * dy) < 20) {
      draggingJoint = joint;
      offsetX = dx;
      offsetY = dy;
      joint.lit = true;
      joint.burnedLength = 0;
      joint.smokeOffset = 0;
      litJoint = joint;
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

  const spacingX = 50; // tighter
  const spacingY = 60;

  const startX = width / 2 - (cols - 1) * spacingX / 2;
  const startY = height / 2 - (rows - 1) * spacingY / 2;

  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (index >= count) break;

      joints.push({
        x: startX + col * spacingX,
        y: startY + row * spacingY,
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
  rotate(HALF_PI); // make vertical

  let burn = joint.burnedLength;
  let bodyLength = max(180 - burn, 30); // shorter
  let bodyHeight = 10; // thinner

  for (let i = 0; i < bodyHeight; i++) {
    let c = lerpColor(color('#e7caa4'), color('#b08968'), i / bodyHeight);
    stroke(c);
    line(0, i, bodyLength, i);
  }

  if (joint.lit) {
    noStroke();
    fill(255, random(80, 140), 20);
    ellipse(0, bodyHeight / 2, 12 + random(-1, 1), 12 + random(-1, 1));
    fill(255, 180, 100, 80);
    ellipse(0, bodyHeight / 2, 18, 18);
  } else {
    fill('#661111');
    noStroke();
    ellipse(0, bodyHeight / 2, 12, 12);
  }

  fill('#5c3b18');
  noStroke();
  rect(bodyLength, 0, 10, bodyHeight, 3);

  fill(80, 50, 30, 100);
  rect(bodyLength + 6, 0, 3, bodyHeight, 2);

  fill(255, 255, 255, 20);
  beginShape();
  vertex(8, 2);
  vertex(bodyLength - 4, 2);
  vertex(bodyLength - 4, 5);
  vertex(8, 5);
  endShape(CLOSE);

  pop();
}

/*************  ✨ Windsurf Command 🌟  *************/
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
  
  // Set random position
  const maxX = window.innerWidth - poemDiv.offsetWidth;
  const maxY = window.innerHeight - poemDiv.offsetHeight;
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  poemDiv.style.position = 'absolute';
  poemDiv.style.left = `${randomX}px`;
  poemDiv.style.top = `${randomY}px`;

  container.appendChild(poemDiv);
}
/*******  bdd75fba-1d14-46f2-96e4-9160b903c57b  *******/
