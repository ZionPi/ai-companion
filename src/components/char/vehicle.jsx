import Matter from 'matter-js';
// Define a class for the vehicle
class Vehicle {

  constructor(x, y) {
    // Define properties for the vehicle
    const randomColor = `rgb(${255}, ${255}, ${255})`;

    this.x = x;
    this.y = y;

    this.body = Matter.Bodies.circle(x, y, 2,  { // circle(x,y,radius)   Matter.Bodies.rectangle(x, y, 40, 20, 这就是区别
      label: 'char',
      friction: 0.1,
      restitution: 0.6,
      density: 0.00005,
      render: {
        fillStyle: randomColor,
      },
    });
    this.velocity = Matter.Vector.create(0, 0);
    this.acceleration = Matter.Vector.create(0, 0);
    this.maxSpeed = 5;
    this.maxForce = 0.1;
  }

   getRandomColor() {
        // Generate a random integer between 0 and 255 for each color component
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        // Return the RGB color string
        return `rgb(${red}, ${green}, ${blue})`;
    }

  // Method to update the vehicle's physics
  update() {

    // Update velocity and position based on acceleration
    Matter.Body.setVelocity(this.body, Matter.Vector.add(this.body.velocity, this.acceleration));
    Matter.Body.setPosition(this.body, Matter.Vector.add(this.body.position, this.body.velocity));
    // Reset acceleration
    this.acceleration = Matter.Vector.mult(this.acceleration, 0);
  }

  // Method to apply a force to the vehicle
  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration = Matter.Vector.add(this.acceleration, force);
  }

  // Method to render the vehicle (if you are not using the built-in renderer)
  render(context) {
    context.fillRect(this.body.position.x, this.body.position.y, 40, 20);
  }


  seek2(target) {
    // Apply behaviors like seek, flee, arrive, etc.
    // For example, a simple seek behavior:
    const desiredVelocity = Matter.Vector.sub(target, this.body.position);
    const desired = Matter.Vector.normalise(desiredVelocity);
    const steer = Matter.Vector.sub(desired, this.velocity);
    this.applyForce(steer);
  }


 // Method to seek a target
  seek(target) {
  
    const desired = Matter.Vector.sub(target, this.body.position);
    const d = Matter.Vector.magnitude(desired);
    let speed = this.maxSpeed;
    if (d < 100) { // Slow down as it gets closer
      speed = Matter.Common.map(d, 0, 100, 0, this.maxSpeed);
    }
    const desiredNormalized = Matter.Vector.normalise(desired);
    const desiredVelocity = Matter.Vector.mult(desiredNormalized, speed);
    const steer = Matter.Vector.sub(desiredVelocity, this.body.velocity);
    this.applyForce(steer);
  }

  // Method to flee from a target
  flee(target) {
    const desired = Matter.Vector.sub(this.body.position, target);
    const d = Matter.Vector.magnitude(desired);
    if (d < 50) { // Only flee if the target is within 50 pixels
      const desiredNormalized = Matter.Vector.normalise(desired);
      const desiredVelocity = Matter.Vector.mult(desiredNormalized, this.maxSpeed);
      const steer = Matter.Vector.sub(desiredVelocity, this.body.velocity);
      this.applyForce(steer);
    }
  }

  // Method to arrive at a target
  arrive(target) {
    const desired = Matter.Vector.sub(target, this.body.position);
    const d = Matter.Vector.magnitude(desired);
    let speed = this.maxSpeed;
    if (d < 200) { // Slow down as it gets closer
      speed = Matter.Common.map(d, 0, 200, 0, this.maxSpeed);
    }
    const desiredNormalized = Matter.Vector.normalise(desired);
    const desiredVelocity = Matter.Vector.mult(desiredNormalized, speed);
    const steer = Matter.Vector.sub(desiredVelocity, this.body.velocity);
    this.applyForce(steer);
  }


}


export default Vehicle;