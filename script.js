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
    velSlider= p.createSlider(0, 20, 10);
    accSlider= p.createSlider(0, 20, 10);
    posSlider.position(p.width/2, 700);
    velSlider.position(p.width/2, 750);
    accSlider.position(p.width/2, 800);
    posSlider.input(setValue);
    //posSlider.changed(setValue);
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
    posSlider.changed(setValue);
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

  function setValue(){
    posPoints[posPoints.length-1]=(posSlider.value()-100)/10;
    pos = (posSlider.value()-100)/10;
    vel = 0;
    if(playing){
      velPoints.push(posPoints[posPoints.length-1]-posPoints[posPoints.length-2]);
    }
    else {
      velPoints[velPoints.length-1]= (posPoints[posPoints.length-1]-posPoints[posPoints.length-2])/deltaT;
    }

  }
}

var posGraph = function(p) {
  var xMargin = 40;
  var yMargin = 10;
  var xScale = 80;
  var yScale = -10;

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
    p.stroke(0,0,250);
    p.noFill();
    //p.fill(0,0,250);

    p.beginShape();
    for (var i = 0; i < posPoints.length; i++){
      //p.push();
      //p.translate(xScale*deltaT*i + xMargin, p.height/2+ yScale*posPoints[i]);
      p.vertex(xScale*deltaT*i + xMargin, p.height/2+ yScale*posPoints[i]);
      //p.ellipse(0,0, 4, 4);
      //if (i>0){
      //    p.stroke(0,0,250);
      //    p.line(0,0,-deltaT,posPoints[i]);
      //}
      //p.pop();
    }
    p.endShape();
  }



};
var velGraph = function(p) {
	p.setup = function() {
    p.createCanvas(1100, 200);
  }
  p.draw = function() {
    this.makeGraph(velPoints, (250,0,0))
  }
};

function makeGraph(data, color, xScale= 80, yScale=-20){
  var xMargin = 40;
  var yMargin = 10;
  function drawAxes(){
    stroke(0);
    push();
    translate(xMargin, height/2);
    line(0,-height/2+yMargin,0,height/2-yMargin);
    line(0,0,width-xMargin,0)
    pop();
  }
  function plotPoints(){
    //stroke(color);
    noFill();
    beginShape();
    for (var i = 0; i < data.length; i++){
      vertex(xScale*deltaT*i + xMargin, height/2+ yScale*posPoints[i]);
    }
    endShape();
  }

  drawAxes();
  plotPoints();
}

var stage = new p5(sketch);
var posGraph = new p5(posGraph);
var velGraph = new p5(velGraph);
