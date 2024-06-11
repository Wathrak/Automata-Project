let boxList = [];
let connections = [];
let allowMousePressed = false;
let connectionMode = false;
var selectedEllipses = [];

function setup() {
  const c = createCanvas(windowWidth - 185, windowHeight - 370);
  c.parent("canvas");
  c.doubleClicked(handleDoubleClick);  // Add double-click event listener
}

function draw() {
  background(100);

  // Draw all connections
  for (let connection of connections) {
    connection.over();
    connection.show();
  }

  // Draw all boxes
  for (let i = 0; i < boxList.length; i++) {
    boxList[i].update();
    boxList[i].over();
    boxList[i].show();
  }
}

function mousePressed() {
  let clickedOnBox = false;
  let selectedBox = null;
  let clickedOnConnection = false;

  for (let i = 0; i < boxList.length; i++) {
    if (boxList[i].over()) {
      boxList[i].pressed();
      clickedOnBox = true;
      selectedBox = boxList[i];
      break;
    }
  }

  for (let connection of connections) {
    if (connection.over()) {
      clickedOnConnection = true;
      openNewConnectionFrame(connection);
      break;
    }
  }

  // If no box was clicked and adding mode is enabled, create a new one
  if (!clickedOnBox && !clickedOnConnection && allowMousePressed && !connectionMode) {
    let box = new Draggable(mouseX, mouseY);
    boxList.push(box);
    // Reset after action
    allowMousePressed = false;
  } else if (selectedBox && connectionMode) {
    // If a box was clicked and connection mode is active, handle connections
    if (selectedEllipses.length === 0 || selectedEllipses[0] !== selectedBox) {
      selectedEllipses.push(selectedBox);
    }

    if (selectedEllipses.length === 2) {
      let newConnection = new Connection(selectedEllipses[0], selectedEllipses[1]);
      connections.push(newConnection);
      selectedEllipses = [];
      // Reset after action
      allowMousePressed = false;
      connectionMode = false;
    }
  }
}

function mouseReleased() {
  for (let i = 0; i < boxList.length; i++) {
    boxList[i].released();
  }
}

// Double-click event handler
function handleDoubleClick() {
  for (let i = 0; i < boxList.length; i++) {
    if (boxList[i].over()) {
      openNewFrame(boxList[i]);
      break;
    }
  }
}

function openNewFrame(box) {
  // Create a new frame
  let frame = document.createElement('div');
  frame.style.position = 'fixed';
  frame.style.left = '50%';
  frame.style.top = '50%';
  frame.style.transform = 'translate(-50%, -50%)';
  frame.style.width = '400px';
  frame.style.height = '300px';
  frame.style.backgroundColor = 'white';
  frame.style.border = '2px solid black';
  frame.style.zIndex = '1000';
  frame.style.padding = '20px';
  frame.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  
  // Add content to the frame
  frame.innerHTML = `
    <h2>State Details</h2>
    <label for="stateName">State Name:</label>
    <input type="text" id="stateName" value="${box.stateName || ''}"><br><br>
    <label for="stateType">State Type:</label>
    <select id="stateType">
      <option value="normal" ${box.stateType === 'normal' ? 'selected' : ''}>Normal</option>
      <option value="start" ${box.stateType === 'start' ? 'selected' : ''}>Start</option>
      <option value="finish" ${box.stateType === 'finish' ? 'selected' : ''}>Final</option>
    </select><br><br>
  `;

  // Add a save button
  let saveButton = document.createElement('button');
  saveButton.innerText = 'Save';
  saveButton.onclick = () => {
    box.stateName = document.getElementById('stateName').value;
    box.stateType = document.getElementById('stateType').value;
    document.body.removeChild(frame);
  };
  frame.appendChild(saveButton);

  // Add a close button
  let closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.style.marginLeft = '10px';
  closeButton.onclick = () => {
    document.body.removeChild(frame);
  };
  frame.appendChild(closeButton);
  
  // Append the frame to the body
  document.body.appendChild(frame);
}

function openNewConnectionFrame(connection) {
  // Create a new frame
  let frame = document.createElement('div');
  frame.style.position = 'fixed';
  frame.style.left = '50%';
  frame.style.top = '50%';
  frame.style.transform = 'translate(-50%, -50%)';
  frame.style.width = '400px';
  frame.style.height = '300px';
  frame.style.backgroundColor = 'white';
  frame.style.border = '2px solid black';
  frame.style.zIndex = '1000';
  frame.style.padding = '20px';
  frame.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  
  // Add content to the frame
  frame.innerHTML = `
    <h2>Connection Details</h2>
    <label for="connectionName">Transition:</label>
    <input type="text" id="connectionName" value="${connection.name || ''}"><br><br>
    <br><br>
  `;

  // Add a save button
  let saveButton = document.createElement('button');
  saveButton.innerText = 'Save';
  saveButton.onclick = () => {
    connection.name = document.getElementById('connectionName').value;
    document.body.removeChild(frame);
  };
  frame.appendChild(saveButton);

  // Add a close button
  let closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.style.marginLeft = '10px';
  closeButton.onclick = () => {
    document.body.removeChild(frame);
  };
  frame.appendChild(closeButton);
  
  // Append the frame to the body
  document.body.appendChild(frame);
}

// Click and Drag an object
// Daniel Shiffman <http://www.shiffman.net>
class Draggable {
  constructor(posX, posY) {
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?

    this.x = posX;
    this.y = posY;
    // Dimensions
    this.w = 75;
    this.h = 75;
    this.stateName = '';
    this.stateType = 'normal';  // State type: normal, start, finish
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
      return true;
    } else {
      this.rollover = false;
      return false;
    }
  }

  update() {
    // Adjust location if being dragged
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
      console.log("this.x: " + this.x);
      console.log("this.y: " + this.y);

      if (this.y < 1) {
        this.y = 1;
      }
      else if (this.y > 483) {
        this.y = 483;
      }
      if (this.x < 1) {
        this.x = 1;
      }
      else if (this.x > windowWidth - 270) {
        this.x = windowWidth - 270;
      }
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
      fill(255);
    }
    
    if (this.stateType === 'finish') {
      strokeWeight(3);
      ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w + 10, this.h + 10);
      strokeWeight(3);
    }

    else if (this.stateType === 'start') {
      fill(0,191,255);
    }
    
    ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h); // Changed to ellipse
    
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.stateName, this.x + this.w / 2, this.y + this.h / 2);
  }

  pressed() {
    // Did I click on the ellipse?
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.dragging = true;
      // If so, keep track of relative location of click to corner of ellipse
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    // Quit dragging
    this.dragging = false;
  }
}

class Connection {
  constructor(box1, box2) {
    this.box1 = box1;
    this.box2 = box2;
    this.rollover = false;
    this.name = '';
  }

  over() {
    const distance = distToSegment(
      mouseX, mouseY,
      this.box1.x + this.box1.w / 2, this.box1.y + this.box1.h / 2,
      this.box2.x + this.box2.w / 2, this.box2.y + this.box2.h / 2
    );

    if (distance < 5) {  // Threshold for detecting mouse over connection
      this.rollover = true;
      return true;
    } else {
      this.rollover = false;
      return false;
    }
  }

  show() {
    strokeWeight(2);
    if (this.rollover) {
      stroke(255, 0, 0);
    } else {
      stroke(0, 0, 0);
    }

    line(
      this.box1.x + this.box1.w / 2,
      this.box1.y + this.box1.h / 2,
      this.box2.x + this.box2.w / 2,
      this.box2.y + this.box2.h / 2
    );

    // Display connection name in the middle of the connection line
    let midX = (this.box1.x + this.box1.w / 2 + this.box2.x + this.box2.w / 2) / 2;
    let midY = (this.box1.y + this.box1.h / 2 + this.box2.y + this.box2.h / 2) / 2 - 10;

    strokeWeight(1);
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.name, midX, midY);
  }
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (l2 === 0) return dist(px, py, x1, y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = max(0, min(1, t));
  return dist(px, py, x1 + t * (x2 - x1), y1 + t * (y2 - y1));
}

var circle = document.getElementById('circle');
circle.addEventListener('click', function() {
  allowMousePressed = true;
  connectionMode = false; // Disable connection mode when circle is clicked
});

var connect = document.getElementById('connect');
connect.addEventListener('click', function() {
  allowMousePressed = true;
  connectionMode = true; // Enable connection mode when connect is clicked
});


var reset = document.getElementById('reset');
reset.addEventListener('click', function() {
    boxList = [];
    connections = [];
    allowMousePressed = false;
    connectionMode = false;
    selectedEllipses = [];
});