let boxList = [];

function setup() {
  const c = createCanvas(windowWidth -185, windowHeight - 370);
  c.parent("canvas");
  // c.position(190, 185);
}

function draw() {
  background(100);
  for (let i = 0; i < boxList.length; i++) {
    boxList[i].update();
    boxList[i].over();
    boxList[i].show();
  }
}

function mousePressed() {
  console.log("Click");
  let box = new Draggable(mouseX, mouseY);
  boxList.push(box);
  for (let i = 0; i < boxList.length; i++) {
    boxList[i].pressed();
  }
}

function mouseReleased() {
  for (let i = 0; i < boxList.length; i++) {
    boxList[i].released();
  }
}

// Click and Drag an object
// Daniel Shiffman <http://www.shiffman.net>
let a = true;

class Draggable {
  constructor(posX, posY) {
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?

    this.x = posX;
    this.y = posY;
    // Dimensions
    this.w = 75;
    this.h = 75;
  }

  over() {
    // Is mouse over object
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  update() {
    // Adjust location if being dragged
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  show() {
    stroke(0);
    // Different fill based on state
    if (this.dragging) {
      fill(50);
    } else if (this.rollover) {
      fill(100);
    } else {
      fill(175, 200);
    }
    circle(this.x, this.y, this.w, this.h);
  }

  pressed() {
    // Did I click on the rectangle?
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.dragging = true;
    //   a == false;
      console.log("a: "+a);
      // If so, keep track of relative location of click to corner of rectangle
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    // Quit dragging
    this.dragging = false;
  }
}


