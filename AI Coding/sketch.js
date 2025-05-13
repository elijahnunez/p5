p5.disableFriendlyErrors = true;

let modules = [];
let backgroundColor = '#000000';
const numModules = 5;

let particles = [];
const numParticles = 100;

function setup() {
    createCanvas(windowWidth, windowHeight);
    strokeCap(SQUARE);
    angleMode(RADIANS);
    rectMode(CENTER);
    ellipseMode(CENTER);
    textAlign(CENTER, CENTER);
    pixelDensity(1);
    noSmooth();
    frameRate(30);
    init();
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function init() {
    modules = [];
    for (let i = 0; i < numModules; i++) {
        modules.push(new Module({
            originX: random(width),
            originY: random(height),
            size: random(100, 300),
            speed: random(0.005, 0.02),
            rotation: random(TWO_PI)
        }));
    }
}

function draw() {
    background(0, 10);
    
    particles.forEach(particle => {
        particle.update();
        particle.display();
    });
    
    // Draw grid lines
    stroke(255, 20);
    strokeWeight(1);
    for (let x = 0; x < width; x += 50) {
        line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 50) {
        line(0, y, width, y);
    }
    
    // Run all modules
    modules.forEach(module => module.run());
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    init();
}

class Module {
    constructor(options) {
        this.originX = options.originX;
        this.originY = options.originY;
        this.size = options.size;
        this.speed = options.speed;
        this.rotation = options.rotation;
        this.offset = random(TWO_PI);
        this.pulseSpeed = random(0.02, 0.05);
        this.pulseSize = random(0.8, 1.2);
    }

    run() {
        push();
        translate(this.originX, this.originY);
        rotate(this.rotation + sin(frameCount * this.speed + this.offset) * 0.2);
        
        // Draw brutalist geometric shapes
        stroke(255);
        strokeWeight(2);
        noFill();
        
        // Calculate pulse effect
        const pulse = sin(frameCount * this.pulseSpeed) * 0.2 + 1;
        const currentSize = this.size * pulse * this.pulseSize;
        
        // Main shapes
        rect(0, 0, currentSize, currentSize);
        
        // Inner structure
        for (let i = 0; i < 4; i++) {
            push();
            rotate(i * HALF_PI);
            translate(currentSize/4, 0);
            
            // Circles
            circle(0, 0, currentSize/2);
            
            // Lines
            line(-currentSize/4, -currentSize/4, currentSize/4, currentSize/4);
            line(-currentSize/4, currentSize/4, currentSize/4, -currentSize/4);
            
            // Small squares
            rect(0, 0, currentSize/4, currentSize/4);
            
            pop();
        }
        
        // Diagonal lines
        line(-currentSize/2, -currentSize/2, currentSize/2, currentSize/2);
        line(-currentSize/2, currentSize/2, currentSize/2, -currentSize/2);
        
        // Update rotation
        this.rotation += this.speed;
        pop();
    }
}

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(1, 3);
        this.speed = random(0.5, 2);
        this.alpha = random(50, 150);
    }
    
    update() {
        this.y -= this.speed;
        if (this.y < -this.size) {
            this.reset();
            this.y = height + this.size;
        }
    }
    
    display() {
        noStroke();
        fill(255, this.alpha);
        ellipse(this.x, this.y, this.size);
    }
} 