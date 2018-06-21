var posPoints = [];
var velPoints = [];
var accPoints = [];
var t = 0;
var deltaT = .002;
var pos = 0;
var vel = 0;
var acc = 0;
var posSlider, velSlider, accSlider;
var StartButton, ResetButton;
var playing = false;
var clearGraphs = false;
var posControlled = false;
var velControlled = false;
var accControlled = false;
var v2 = 0;
var v3 = 0;
var x2 = 0;
var x3 = 0;
var vOld = 0;
var pOld = 0;
var temp;

function reset(){
  posPoints = [];
  velPoints = [];
  accPoints = [];
  t = 0;
  deltaT = .01;
  pos = 0;
  vel = 0;
  acc = 0;
  playing = false;
  clearGraphs = true;
  StartButton.html('Go');
  posSlider.value(100);
  velSlider.value(100);
  accSlider.value(100);
  posControlled = false;
  velControlled = false;
  accControlled = false;
}

function togglePlaying(){
  if (!playing){
    StartButton.html('Pause');
    posPoints.push(pOld);
    posPoints.push((pos+pOld)/2);
    posPoints.push(pos);
    temp = (pos-pOld)/deltaT;
    velPoints.push(vOld);
    velPoints.push((temp+vOld)/2);
    velPoints.push(temp);
    accPoints.push((velPoints[velPoints.length-4]-velPoints[velPoints.length-2])/(2*deltaT));
    accPoints.push((velPoints[velPoints.length-3]-velPoints[velPoints.length-1])/(2*deltaT));
    accPoints.push((velPoints[velPoints.length-2]-velPoints[velPoints.length-1])/deltaT);
    playing = true;
  }
  else{
    playing = false;
    pOld = posPoints.slice(posPoints.length-1, posPoints.length)[0];
    StartButton.html('Go');
    vOld = velPoints.slice(velPoints.length-1, velPoints.length)[0];
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
    ResetButton = p.createButton('Reset');
    ResetButton.position(29, 59);
    ResetButton.mousePressed(reset);
    posSlider= p.createSlider(0, 200, 100);
    velSlider= p.createSlider(0, 200, 100);
    accSlider= p.createSlider(0, 200, 100);
    posSlider.position(-10, 225);
    velSlider.position(-10, 430);
    accSlider.position(-10, 640);
    posSlider.input(setPosValue);
    velSlider.input(setVelValue);
    accSlider.input(setAccValue);
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
    posSlider.changed(function(){ vel= 0; acc=0; posControlled=false});
    velSlider.changed(function(){ acc=0; velControlled=false});
    accSlider.changed(function(){ accControlled=false});
  }

  function drawNumberLine() {
    p.fill(250,250,50);
    p.rect(50,.8*p.height,1100,20);
    p.fill(0);
    p.textAlign(p.CENTER);
    p.text("meters", p.width/2+25, 113);
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
    if (posPoints.length > 10){
      x2 = (1/3)*(posPoints.slice(posPoints.length-1,posPoints.length)[0]+
        posPoints.slice(posPoints.length-2,posPoints.length-1)[0]+
        posPoints.slice(posPoints.length-3,posPoints.length-2)[0]);
      v2 = (1/3)*(velPoints.slice(velPoints.length-1,velPoints.length)[0]+
        velPoints.slice(velPoints.length-2,velPoints.length-1)[0]+
        velPoints.slice(velPoints.length-3,velPoints.length-2)[0]);
      /*  if ((t >= 0.8) && (t<0.85)){
          temp = posPoints.slice(posPoints.length-1,posPoints.length)[0]
          console.log(temp);
        }
        */
    }
    if (!posControlled || !velControlled || !accControlled){
      vel = vel + deltaT*acc;
      pos = pos + deltaT*vel;
      posPoints.push(pos);
      velPoints.push(vel);
      accPoints.push(acc);
      t = t+deltaT;
    }

    if (posControlled){
      setPosValue();
    }

    if (velControlled){
      setVelValue();
    }

    if (accControlled){
      setAccValue();
    }


  };

  function setPosValue(){
    posControlled = true;
    if (playing){
      pos = (posSlider.value()-100)/10;
      posPoints.push(x2);
      velPoints.push((posPoints[posPoints.length-1]-posPoints[posPoints.length-61])/(60*deltaT));
      vel = velPoints[velPoints.length-1];
      velSlider.value((vel+10)*10);
      accPoints.push((velPoints[velPoints.length-1]-velPoints[velPoints.length-61])/(60*deltaT));
      acc = accPoints[accPoints.length-1];
      accSlider.value((acc+10)*10);
      t = deltaT +t;
    }
    if (!playing){
      posPoints[posPoints.length-1] = (posSlider.value()-100)/10;
      pos = posPoints[posPoints.length-1];

      velPoints[velPoints.length-1] = (posPoints[posPoints.length-1] - posPoints[posPoints.length-4])/(3*deltaT);
      vel = velPoints[velPoints.length-1];

      accPoints[accPoints.length-1] = (velPoints[velPoints.length-1] - velPoints[velPoints.length-4])/(3*deltaT);
      acc = accPoints[accPoints.length-1];
    }
  }

  function setVelValue(){
    velControlled = true;
    if (playing){
      velPoints.push((velSlider.value()-100)/10);
      vel = velPoints[velPoints.length-1];
      pos = pos + vel*deltaT;
      posPoints.push(pos);
      posSlider.value(pos*10 + 100);
      accPoints.push((velPoints[velPoints.length-1]-velPoints[velPoints.length-11])/(10*deltaT));
      acc = accPoints[accPoints.length-1];
      accSlider.value((acc+10)*10);
      t = t +deltaT;
    }
    if (!playing){
      velPoints[velPoints.length-1] = (velSlider.value()-100)/10;
      velPoints[velPoints.length-2] = (velPoints[velPoints.length-1] + velPoints[velPoints.length-3])/2;
      vel = velPoints[velPoints.length-1];
      accPoints[accPoints.length-1] = (velPoints[velPoints.length-1] - velPoints[velPoints.length-4])/(3*deltaT);
    }
  }
  function setAccValue(){
    accControlled = true;
    if(playing){
      accPoints.push((accSlider.value()-100)/10);
      velPoints.push(vel+acc*deltaT);
      posPoints.push(pos+vel*deltaT);
      vel = vel + deltaT*acc;
      pos = pos + deltaT*vel;
      t = t + deltaT;
    }
    if (!playing){
      accPoints[accPoints.length-1] = (accSlider.value()-100)/10;
      acc = accPoints[accPoints.length-1];
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
    if (clearGraphs){
      p.setup();
    }
    plotPoints();
    drawAxes();

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
    if (clearGraphs){
      p.setup();
    }
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
var accGraph = function(p) {
  var xMargin = 80;
  var yMargin = 10;
  var xScale = 80;
  var yScale = -1;

	p.setup = function() {
    p.createCanvas(1100, 200);
  }

  p.draw = function() {
    if (clearGraphs){
      p.setup();
      clearGraphs = !clearGraphs;
    }
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
    p.stroke(0,180,0);
    p.strokeWeight(2);
    p.noFill();
    p.strokeJoin(p.ROUND);
    p.beginShape();
    for (var i = 0; i < accPoints.length; i++){
      p.vertex(xScale*deltaT*i + xMargin, p.height/2+ yScale*accPoints[i]);
    }
    p.endShape();
  }



};

var stage = new p5(sketch);
var posGraph = new p5(posGraph);
var velGraph = new p5(velGraph);
var accGraph = new p5(accGraph);
