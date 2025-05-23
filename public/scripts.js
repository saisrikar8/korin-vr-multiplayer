// scripts.js
let carModel;
let car;
let cam;
let camPos, camTarget;

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
    camPos = createVector(0, 0, 0);
    camTarget = createVector(0, 0, 0);


    steeringWheel = new SteeringWheel();

    canvas.elt.focus();

    setCamera(cam);
}

function draw() {
    background(135, 206, 235);

    lights();
    directionalLight(255, 255, 255, -0.5, -1, -0.5);

    // Camera follow car with some height and offset
    // Offset behind the car
    let camOffset = p5.Vector.fromAngle(car.angle + PI).mult(200);
    camOffset.y = 180; // raise the camera height (was 150)

    // Where the camera should look
    let desiredCamPos = p5.Vector.add(car.pos, camOffset);
    let desiredTarget = p5.Vector.add(car.pos, createVector(0, 70, 0)); // aim higher on the car

    // Smooth follow
    camPos.lerp(desiredCamPos, 0.05);
    camTarget.lerp(desiredTarget, 0.05);

    // Set the camera
    camera(camPos.x, camPos.y, camPos.z, camTarget.x, camTarget.y, camTarget.z, 0, 1, 0);



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
    steeringWheel.rotateSteeringWheel(car.steeringWheelAngle);
}


function setHUD() {
    resetMatrix();
    applyMatrix(...canvas.uMVMatrix.mat4);
    camera();
    ortho();
    translate(-width / 2, -height / 2);
}

