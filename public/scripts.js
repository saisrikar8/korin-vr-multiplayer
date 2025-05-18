let searchBar, submitButton;
let steeringImage;
let steeringWheel;

var turn = 0;

function preload() {
    steeringImage = loadImage("/assets/steering.png");
}

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent('canvas-container');
    textAlign(LEFT, TOP);
    textSize(16);

    searchBar = createInput();
    searchBar.position(10, 30);
    searchBar.attribute("placeholder", "Search for a location...");
    searchBar.style("position", "absolute");
    searchBar.style("z-index", "10");
    searchBar.style("padding", "8px");
    searchBar.style("font-size", "16px");
    searchBar.style("width", "220px");
    searchBar.class("search-bar");  // optional if using custom CSS
    searchBar.input(handleInput);


    submitButton = createButton('Submit');
    submitButton.position(250, 37);
    submitButton.mousePressed(handleSubmit);

    steeringWheel = new SteeringWheel();
}

function draw() {
    if (turn > -270 && keyIsDown(LEFT_ARROW))turn-=3;
    else if (turn < 270 && keyIsDown(RIGHT_ARROW))turn+=3;
    else if (turn != 0){
        turn += (turn > 0) ? -3 : 3;
    }

    steeringWheel.rotateSteeringWheel(turn);

    background(240);
}

function handleSubmit() {
    let name = searchBar.value();
    console.log(`Name: ${name}`);
}

function handleInput(){}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    steeringWheel.resetPosition()
}