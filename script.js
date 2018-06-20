var posPoints = [];
var velPoints = [];
var accPoints = [];
var t = 0;
var deltaT = .01;
var pos = 0;
var vel = 1;
var acc = 0;
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
  p.ypos = 80;
  p.setup  = function() {
    p.createCanvas(1200, 120);
    StartButton = p.createButton('Go');
    StartButton.position(29, 29);
    StartButton.mousePressed(togglePlaying);
    posSlider= p.createSlider(0, 200, 100);
    velSlider= p.createSlider(0, 200, 100);
    accSlider= p.createSlider(0, 200, 100);
    posSlider.position(-10, 225);
    velSlider.position(-10, 430);
    accSlider.position(-10, 640);
    posSlider.input(setPosValue);
    velSlider.input(setVelValue);
    posSlider.style('rotate', 270);
    velSlider.style('rotate', 270);
    accSlider.style('rotate', 270);
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
    posSlider.changed(function(){vel=0;});
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
    p.translate(stageScale*pos+p.width/2, p.ypos);
    p.ellipse(0, 0, p.moverRad, p.moverRad);
    p.pop();
  }
  function updateMotion(){
    vel = vel + deltaT*acc;
    pos = pos + deltaT*vel;
    posPoints.push(pos);
    velPoints.push(vel);
    accPoints.push(acc);
    t = t+deltaT;
  };
  function setPosValue(){
    if (playing){
      posPoints.push((posSlider.value()-100)/10);
      velPoints.push((posPoints[posPoints.length-1]-posPoints[posPoints.length-3])/(2*deltaT));
      vel = velPoints[velPoints.length-1];
      velSlider.value(vel*10 +100);
    }
    if (!playing){
      posPoints[posPoints.length-1] = (posSlider.value()-100)/10;
    }
    pos = (posSlider.value()-100)/10;

  }

  function setVelValue(){
    if (playing){
      velPoints.push((velSlider.value()-100)/10);
      vel = velPoints[velPoints.length-1];
      //pos = pos + vel*deltaT
      posPoints.push(pos+vel*deltaT);
      posSlider.value((pos+vel*deltaT)*10 + 100);
      pos = pos + vel*deltaT
      //vel = (velSlider.value()-100)/10;
    }
    if (!playing){
      velPoints[velPoints.length-1] = (velSlider.value()-100)/10;
      vel = velPoints[velPoints.length-1];
    }


  }
}

var posGraph = function(p) {
  var xMargin = 80;
  var yMargin = 10;
  var xScale = 80;
  var yScale = -8;

	p.setup = function() {
    p.createCanvas(1100, 200);
  }

  p.draw = function() {
    drawAxes();
    plotPoints();
  }

  function drawAxes(){
    p.stroke(0);
    p.strokeWeight(1);
    p.push();
    p.translate(xMargin, p.height/2);
    p.line(0,-p.height/2+yMargin,0,p.height/2-yMargin);
    p.line(0,0,p.width-xMargin,0)
    p.pop();
  }

  function plotPoints(){
    p.stroke(0,0,250);
    p.strokeWeight(2);
    p.noFill();
    p.strokeJoin(p.ROUND);
    p.beginShape();
    for (var i = 0; i < posPoints.length; i++){
      p.vertex(xScale*deltaT*i + xMargin, p.height/2+ yScale*posPoints[i]);
    }
    p.endShape();
  }

};
var velGraph = function(p) {
  var xMargin = 80;
  var yMargin = 10;
  var xScale = 80;
  var yScale = -4;

	p.setup = function() {
    p.createCanvas(1100, 200);
  }

  p.draw = function() {
    drawAxes();
    plotPoints();
  }

  function drawAxes(){
    p.stroke(0);
    p.strokeWeight(1);
    p.push();
    p.translate(xMargin, p.height/2);
    p.line(0,-p.height/2+yMargin,0,p.height/2-yMargin);
    p.line(0,0,p.width-xMargin,0)
    p.pop();
  }

  function plotPoints(){
    p.stroke(250,0,0);
    p.strokeWeight(2);
    p.noFill();
    p.strokeJoin(p.ROUND);
    p.beginShape();
    for (var i = 0; i < velPoints.length; i++){
      p.vertex(xScale*deltaT*i + xMargin, p.height/2+ yScale*velPoints[i]);
    }
    p.endShape();
  }



};
var stage = new p5(sketch);
var posGraph = new p5(posGraph);
var velGraph = new p5(velGraph);
