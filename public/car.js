class Car {
  constructor(x, y, model) {
    this.pos = createVector(x, 0, y); // use 3D vector
    this.vel = createVector(0, 0, 0);
    this.acc = createVector(0, 0, 0);
    this.angle = 0;
    this.turnSpeed = 0.05;
    this.maxSpeed = 5;
    this.model = model;
    this.size = 50; // for collision
  }

  update() {
    let forward = keyIsDown(87); // W
    let backward = keyIsDown(83); // S
    let left = keyIsDown(65); // A
    let right = keyIsDown(68); // D

    // Friction
    this.vel.mult(0.96);

    // Turning - only when moving
    if (this.vel.mag() > 0.1) {
      if (left) this.angle -= this.turnSpeed;
      if (right) this.angle += this.turnSpeed;
    }

    // Determine heading vector based on current angle
    let heading = createVector(sin(this.angle), 0, cos(this.angle));

    // Accelerate in the heading direction
    if (forward) {
      this.vel.add(p5.Vector.mult(heading, 0.2));
    } else if (backward) {
      this.vel.add(p5.Vector.mult(heading, -0.1));
    }

    this.vel.limit(this.maxSpeed);

    // Update position based on heading
    let nextPos = p5.Vector.add(this.pos, this.vel);
    let halfSize = 500;

    if (
        abs(nextPos.x) < halfSize - this.size &&
        abs(nextPos.z) < halfSize - this.size
    ) {
      this.pos.add(this.vel);
    } else {
      this.vel.mult(0); // stop at edge
    }
  }


  render() {
    push();
    translate(this.pos.x, 0, this.pos.z);
    rotateY(-this.angle);
    rotateX(PI/2);
    scale(0.5);
    model(this.model);
    pop();
  }

  getSpeed() {
    return this.vel.mag();
  }
}