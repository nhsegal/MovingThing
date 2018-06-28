let posPoints = [];
let velPoints = [];
let accPoints = [];
let t = 0;
const deltaT = .02;
const xMargin = 80;
let pos = 0;
let vel = 0;
let acc = 0;
let posSlider, velSlider, accSlider;
let StartButton, ResetButton;
let playing = false;
let clearGraphs = false;
let posControlled = false;
let velControlled = false;
let accControlled = false;

let tempTime = 0;

let posArr = [];
let velArr = [];
let accArr = [];

let arrLen = 5;

let average = (array) => array.reduce((a, b) => a + b) / array.length;

let averageSlope = function(array){
    let num = 0;
    let denom = 0;
    for (let i = 0; i<array.length; i++){
      num += (array[i] - average(array))*(deltaT*i-deltaT*(array.length-1)/2);
      denom += (deltaT*i-deltaT*(array.length-1)/2)*(deltaT*i-deltaT*(array.length-1)/2);
    }
    return(num/denom)
}

function reset(){
  posPoints.length=0;
  velPoints.length=0;
  accPoints.length=0;
  t = 0;
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
  posArr.length = 0;
  velArr.length = 0;
  accArr.length = 0;

  for (let i = 0; i<arrLen; i++){
    posArr.push(0);
    velArr.push(0);
    accArr.push(0);
  }
}

function togglePlaying(){
  if (!playing){
    StartButton.html('Pause');
    posArr.push(pos);
    posArr.shift();
    posPoints.push(average(posArr));

    velArr.push(vel);
    velArr.shift();
    velPoints.push(average(velArr));

    accArr.push(acc);
    accArr.shift();
    accPoints.push((velArr[velArr.length-1]-velArr[velArr.length-2])/deltaT)
    playing = true;
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
    p.frameRate(10);
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
    for (let i =0; i<arrLen; i++){
      posArr.push(pos);
      velArr.push(vel);
      accArr.push(acc);
    }
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
    posSlider.changed(function(){
      vel= 0;
      acc=0;
      for (let i =0; i<arrLen; i++){
        posArr.push(pos);
        posArr.shift();
        velArr.push(0);
        velArr.shift();
        accArr.push(0);
        accArr.shift();
      }

      posControlled=false;
      velControlled=false;
      accControlled=false;
    });

    velSlider.changed(function(){
      acc=0;
      for (let i =0; i<arrLen; i++){
        posArr.push(pos+vel*deltaT);
        posArr.shift();
        velArr.push(vel);
        velArr.shift();
        accArr.push(0);
        accArr.shift();
      }
      posControlled=false;
      velControlled=false;
      accControlled=false;
    });

    accSlider.changed(function(){
      for (let i =0; i<arrLen; i++){
        accArr.push(acc);
        accArr.shift();
        velArr.push(vel+acc*deltaT);
        velArr.shift();
        posArr.push(pos+vel*deltaT);
        posArr.shift();
      }
      posControlled=false;
      velControlled=false;
      accControlled=false;
    });
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
    if (!posControlled && !velControlled && !accControlled){
      vel = vel + deltaT*acc;
      pos = pos + deltaT*vel;
      accArr.push(acc);
      accArr.shift();
      velArr.push(vel);
      velArr.shift();
      posArr.push(pos);
      posArr.shift();
      posPoints.push(average(posArr));
      velPoints.push(average(velArr));
      accPoints.push(average(accArr));
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
    tempTime = time+deltaT;
    posControlled = true;
    pos = (posSlider.value()-100)/10;
    if (playing){
      posArr.push(pos);
      posArr.shift();
      posPoints.push(average(posArr));

      velArr.push(averageSlope(posArr));
      velArr.shift();
      velPoints.push(average(velArr));
      vel = velPoints[velPoints.length-1];
      velSlider.value((vel+10)*10);

      accArr.push(averageSlope(velArr));
      accArr.shift();
      accPoints.push(average(accArr))
      acc = accPoints[accPoints.length-1];
      accSlider.value((acc+10)*10);
    }

    if (!playing){
      for (let i = 0; i<arrLen; i++){
        posArr[posArr.length-1] = pos;
        posArr[posArr.length-2] = pos;
      }
      posPoints[posPoints.length-1] = (average(posArr));

      velArr[velArr.length-1] = (posArr[posArr.length-1]- posArr[0])/(deltaT*posArr.length);
      velPoints[velPoints.length-1] = average(velArr);
      vel = velPoints[velPoints.length-1];
      velSlider.value((vel+10)*10);

      accArr[accArr.length-1] = (velArr[velArr.length-1]- velArr[0])/(deltaT*velArr.length);
      accPoints[accPoints.length-1] = (average(accArr))
      acc = accPoints[accPoints.length-1];
      accSlider.value((acc+10)*10);

    }
  }

  function setVelValue(){
    velControlled = true;
    vel = (velSlider.value()-100)/10;
    if (playing){
      velArr.push(vel);
      velArr.shift();
      velPoints.push(average(velArr));

      posArr.push(average(velArr)*deltaT);
      posArr.shift();
      posPoints.push(average(posArr));
      pos = posPoints[posPoints.length-1];
      posSlider.value((pos+10)*10);

      accArr.push(averageSlope(velArr));
      accArr.shift();
      accPoints.push(average(accArr))
      acc = accPoints[accPoints.length-1];
      accSlider.value((acc+10)*10);
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
      accArr.push((accSlider.value()-100)/10);
      accArr.shift();
      accArr.push((accSlider.value()-100)/10);
      accArr.shift();
      accPoints.push(average(accArr));
      acc = accPoints[accPoints.length-1];
      vel = vel + deltaT*acc;
      pos = pos + deltaT*vel;

      velPoints.push(vel+acc*deltaT);
      posPoints.push(pos+vel*deltaT);


      t = t + deltaT;
    }
    if (!playing){
      accPoints[accPoints.length-1] = (accSlider.value()-100)/10;
      acc = accPoints[accPoints.length-1];
    }
  }
}
let posGraph = function(p) {
  let yMargin = 10;
  let xScale = 160;
  let yScale = -8;

	p.setup = function() {
    p.createCanvas(1100, 200);
  }

  p.draw = function() {
    if (clearGraphs){
      p.background(255);

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


    if (playing){
      p.beginShape();
      for (let i = 0; i < posPoints.length; i++){
        p.vertex(xScale*deltaT*i + xMargin, p.height/2+ yScale*posPoints[i]);
      }
      p.endShape();
    }


  }

};
var velGraph = function(p) {

  var yMargin = 10;
  var xScale = 160;
  var yScale = -4;

	p.setup = function() {
    p.createCanvas(1100, 200);
  }

  p.draw = function() {
    if (clearGraphs){
      p.background(255);
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
    if (playing){
      for (var i = 0; i < velPoints.length; i++){
        p.vertex(xScale*deltaT*i + xMargin, p.height/2+ yScale*velPoints[i]);
      }
    }

    p.endShape();
  }



};
var accGraph = function(p) {
  var xMargin = 80;
  var yMargin = 10;
  var xScale = 160;
  var yScale = -4;

	p.setup = function() {
    p.createCanvas(1100, 200);
  }

  p.draw = function() {
    if (clearGraphs){
      p.background(255);
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
    if(playing){
      for (var i = 0; i < accPoints.length; i++){
        p.vertex(xScale*deltaT*i + xMargin, p.height/2+ yScale*accPoints[i]);
      }
    }

    p.endShape();
  }



};

stage = new p5(sketch);
posGraph = new p5(posGraph);
velGraph = new p5(velGraph);
accGraph = new p5(accGraph);
