var points = [];
var t = 0;

var sketch = function(p){
  p.moverRad = 10;
  p.xpos = 500;
  p.ypos = 140;
  p.vel = 0;
  p.acc = .000;

  p.setup  = function() {
    p.createCanvas(1200, 200);
  }

  p.draw = function() {
    p.background(80,180,80);
    p.fill(0,210,255);
    p.rect(0,0, 1200, 150);
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
    p.ellipseMode(p.RADIUS);
    p.fill(0)
    p.ellipse(p.xpos, p.ypos, p.moverRad, p.moverRad);
  }

  function updateMotion(){
    p.vel = p.vel + p.acc;
    p.xpos = p.xpos + p.vel;
    points.push(p.xpos);
    t = t+1;
  };
}
var posGraph = function(p) {
	p.setup = function() {
    p.createCanvas(1200, 300);
  }
  p.draw = function() {
    drawAxes();
    plotPoints();
  }

  function drawAxes(){
    p.stroke(0);
    p.line(100,150,1100,150);
    p.line(100,20,100,270);

  }

  function plotPoints(){
    p.ellipseMode(p.CENTER);
    p.noStroke();
    p.fill(120,120,250);
    var scalefactor = .02   //50 pixels to 1 meter
    for (var i = 0; i < points.length; i++){
      p.ellipse(2*i+100,-scalefactor*points[i]+162,4,4);

    }
    console.log(points);
  }

};

var stage = new p5(sketch);
var posGraph = new p5(posGraph);
