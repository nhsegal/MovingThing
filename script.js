

var sketch = function(p){
  p.moverRad = 10;
  p.xpos = 600;
  p.ypos = 140;
  p.vel = 2;
  p.acc = -.050;

  p.setup  = function() {
    p.createCanvas(1200, 500);
    //cnv.parent("stage");
  }

  p.draw = function() {
    p.background(80,180,80);
    p.fill(0,210,255);
    p.rect(0,0, 1200, 150);
    p.drawNumberLine();
    p.updateMotion();
    p.drawMover();
    p.drawPosGraph();
  }

}
var stage = new p5(sketch);
function drawNumberLine() {
  fill(230,230,0);
  rect(50,160,1100,20);
  fill(0);
  textAlign(CENTER);
  let i;
  for (i = -10; i < 11; i++){
    stroke(0);
    text(i, 600+i*50+1,177);
    line(600+i*50, 162, 600+i*50, 165);
  }
}

function drawMover(){
  ellipseMode(RADIUS);
  fill(0)
  ellipse(xpos, ypos, moverRad, moverRad);
}

function updateMotion(){
  vel = vel + acc;
  xpos = xpos + vel;
}

function drawPosGraph(){
  fill(250);
  rect(50,200,1100,200);
}
