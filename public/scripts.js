// scripts.js
let carModel;
let car;
let cam;

let steeringWheel;
let canvas;

function preload() {
    carModel = loadModel('assets/car/car_body.obj', true);
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    perspective(6 * PI/13, width / height, 0.1, 5000);
    car = new Car(0, 0, carModel);
    cam = createCamera();

    steeringWheel = new SteeringWheel();

    canvas.elt.focus();

    setCamera(cam);
}

function draw() {
    background(135, 206, 235);

    lights();
    directionalLight(255, 255, 255, -0.5, -1, -0.5);

    // Camera follow car with some height and offset
    let camDist = 250;
    let camHeight = 250;
    let eyeX = car.pos.x + cos(car.angle) * camDist;
    let eyeY = camHeight;
    let eyeZ = car.pos.y + sin(car.angle) * camDist;
    cam.setPosition(eyeX, eyeY, eyeZ);
    cam.lookAt(car.pos.x, 0, car.pos.y);

    // Draw ground plane
    push();
    rotateX(HALF_PI);
    noStroke();
    fill(34, 139, 34);
    plane(3000, 3000);
    pop();

    // Optional grid for reference
    push();
    stroke(180);
    strokeWeight(1);
    noFill();
    rotateX(HALF_PI);
    for(let i = -500; i <= 500; i += 50) {
        line(i, -500, i, 500);
        line(-500, i, 500, i);
    }
    pop();

    // Update and draw car
    car.update();
    car.render();

    // Speedometer, HUD, etc.
    setHUD();
    steeringWheel.rotateSteeringWheel((180/PI)*car.angle);
}


function setHUD() {
    resetMatrix();
    applyMatrix(...canvas.uMVMatrix.mat4);
    camera();
    ortho();
    translate(-width / 2, -height / 2);
}

