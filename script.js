var posPoints = [];
var velPoints = [];
var t = 0;
var deltaT = .01;
var initialPos = 0;
var initialVel = 1;
var initialAcc = 0;
var posSlider, velSlider, accSlider;
var StartButton, PauseButton, ResetButton;
var playing = false;

function togglePlaying(){
  if (!playing){
    playing = true;
    StartButton.html('Pause');
  }
  else{
    playing = false;
    StartButton.html('Go');
  }
}

var sketch = function(p){
  p.moverRad = 10;
  p.xpos = initialPos;
  p.ypos = 80;
  p.vel = initialVel;
  p.acc = initialAcc;

  p.setup  = function() {
    p.createCanvas(1200, 120);
    StartButton = p.createButton('Go');
    StartButton.position(29, 29);
    StartButton.mousePressed(togglePlaying);
  }

  p.draw = function() {
    p.background(80,180,80);
    p.fill(0,210,255);
    p.rect(0,0, p.width, .75*p.height);
    drawNumberLine();
    if (playing){
      updateMotion();
    }
    drawMover();
  }

  function drawNumberLine() {
    p.fill(250,250,50);
    p.rect(50,.8*p.height,1100,20);
    p.fill(0);
    p.textAlign(p.CENTER);
    for (let i = -10; i < 11; i++){
      p.stroke(0);
      p.text(i, 600+i*50+1,.8*p.height+18);
      p.line(600+i*50, .8*p.height, 600+i*50, .8*p.height+5);
    }
  }

  function drawMover(){
    var stageScale = 50;
    p.ellipseMode(p.RADIUS);
    p.fill(0)
    p.push();
    p.translate(stageScale*p.xpos+p.width/2, p.ypos);
    p.ellipse(0, 0, p.moverRad, p.moverRad);
    p.pop();
  }

  function updateMotion(){
    p.vel = p.vel + deltaT*p.acc;
    p.xpos = p.xpos + deltaT*p.vel;
    posPoints.push(p.xpos);
    velPoints.push(p.vel);
    t = t+deltaT;
  };
}

var posGraph = function(p) {
  var xMargin = 40;
  var yMargin = 10;
  var xScale = 80;
  var yScale = -10;

	p.setup = function() {
    p.createCanvas(1100, 200);
    posSlider= p.createSlider(-10,10,0);
    velSlider= p.createSlider(-10,10,0);
    accSlider= p.createSlider(-10,10,0);
    posSlider.position(p.width/2, 200);
    velSlider.position(p.width/2, 240);
    accSlider.position(p.width/2, 280);
  }

  p.draw = function() {
    drawAxes();
    plotPoints();
  }

  function drawAxes(){
    p.stroke(0);
    p.push();
    p.translate(xMargin, p.height/2);
    p.line(0,-p.height/2+yMargin,0,p.height/2-yMargin);
    p.line(0,0,p.width-xMargin,0)
    p.pop();
  }

  function plotPoints(){
    p.ellipseMode(p.CENTER);
    p.noStroke();
    p.fill(0,0,250);
    for (var i = 0; i < posPoints.length; i++){
      p.push();
      p.translate(xScale*deltaT*i + xMargin, p.height/2+ yScale*posPoints[i]);
      p.ellipse(0 , 0, 4, 4);
      p.pop();
    }
  }



};

var velGraph = function(p) {
  console.log('here');
  var xMargin = 40;
  var yMargin = 10;
  var xScale = 80;
  var yScale = -20;

	p.setup = function() {
    p.createCanvas(1100, 200);
  }

  p.draw = function() {
    drawAxes();
    plotPoints();
  }

  function drawAxes(){
    p.stroke(0);
    p.push();
    p.translate(xMargin, p.height/2);
    p.line(0,-p.height/2+yMargin,0,p.height/2-yMargin);
    p.line(0,0,p.width-xMargin,0)
    p.pop();
  }

  function plotPoints(){
    p.ellipseMode(p.CENTER);
    p.noStroke();
    p.fill(250,0,0);
    for (var i = 0; i < velPoints.length; i++){
      p.push();
      p.translate(xScale*deltaT*i + xMargin, p.height/2+ yScale*velPoints[i]);
      p.ellipse(0 , 0, 4, 4);
      p.pop();
    }
  }



};

var stage = new p5(sketch);
var posGraph = new p5(posGraph);
var velGraph = new p5(velGraph);
