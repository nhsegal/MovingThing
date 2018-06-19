var posPoints = [];
var velPoints = [];
var t = 0;
var deltaT = .01;
var initialPos = 1;
var initialVel = 0;
var initialAcc = 0;

var sketch = function(p){
  p.moverRad = 10;
  p.xpos = initialPos;
  p.ypos = 140;
  p.vel = initialVel;
  p.acc = initialAcc;

  p.setup  = function() {
    p.createCanvas(1200, 200);
  }

  p.draw = function() {
    p.background(80,180,80);
    p.fill(0,210,255);
    p.rect(0,0, p.width, .75*p.height);
    drawNumberLine();
    updateMotion();
    drawMover();
  }

  function drawNumberLine() {
    p.fill(230,230,0);
    p.rect(50,160,1100,20);
    p.fill(0);
    p.textAlign(p.CENTER);
    for (let i = -10; i < 11; i++){
      p.stroke(0);
      p.text(i, 600+i*50+1,177);
      p.line(600+i*50, 162, 600+i*50, 165);
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
  var xScale = 40;
  var yScale = -10;

	p.setup = function() {
    p.createCanvas(1100, 250);
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

var stage = new p5(sketch);
var posGraph = new p5(posGraph);
