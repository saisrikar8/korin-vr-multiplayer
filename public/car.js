// car.js
class Car {
  constructor(x, y, model) {
    this.pos = createVector(x, 0, y); // use 3D vector
    this.vel = createVector(0, 0, 0);
    this.acc = createVector(0, 0, 0);
    this.angle = 0;
    this.turnSpeed = 0;
    this.steeringWheelAngle = 0;
    this.maxSpeed = 5;
    this.model = model;
    this.size = 50; // for collision
  }

  update() {
    const forward = keyIsDown(87); // W
    const backward = keyIsDown(83); // S
    const left = keyIsDown(65); // A
    const right = keyIsDown(68); // D

    const acceleration = 0.2;
    const friction = 0.96;
    const maxSpeed = this.maxSpeed;

    // Steering wheel dynamics
    const maxSteeringWheelAngle = 180; // degrees
    const steeringRate = 8; // degrees/frame input change
    const returnRate = 5;   // degrees/frame return to center

    // Update steering wheel angle
    if (left) {
      this.steeringWheelAngle = max(-maxSteeringWheelAngle, this.steeringWheelAngle - steeringRate);
    } else if (right) {
      this.steeringWheelAngle = min(maxSteeringWheelAngle, this.steeringWheelAngle + steeringRate);
    } else {
      // Auto-centering
      if (abs(this.steeringWheelAngle) < returnRate) {
        this.steeringWheelAngle = 0;
      } else {
        this.steeringWheelAngle -= returnRate * Math.sign(this.steeringWheelAngle);
      }
    }

    // Convert to radians for physics
    const steeringRad = radians(this.steeringWheelAngle);

    // Apply acceleration
    if (forward) {
      this.vel.z -= acceleration;
    } else if (backward) {
      this.vel.z += acceleration;
    }

    // Apply friction
    this.vel.z *= friction;
    this.vel.z = constrain(this.vel.z, -maxSpeed, maxSpeed);

    // Apply angular acceleration based on speed and steering angle
    const maxAngularAccel = 0.02; // max angular change per frame
    const speedFactor = 1 - constrain(abs(this.vel.z) / maxSpeed, 0, 1); // slower = more turning
    const angularAccel = steeringRad * speedFactor * maxAngularAccel;

    if (this.vel.mag() > 3) {
      this.angle += angularAccel;
    }

    // Move in heading direction
    const heading = this.angle;
    this.pos.x += this.vel.z * Math.cos(heading);
    this.pos.z += this.vel.z * Math.sin(heading);
  }

  render() {
    push();
    translate(this.pos.x, -7, this.pos.z);
    rotateY(-this.angle);
    rotateX(PI/2);
    scale(0.5, 0.5, 0.5);
    normalMaterial();
    model(this.model);
    pop();
  }

  getSpeed() {
    return this.vel.mag();
  }
}
