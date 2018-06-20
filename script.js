var posPoints = [];
var velPoints = [];
var accPoints = [];
var t = 0;
var deltaT = .01;
var initialPos = 0;
var initialVel = 1;
var initialAcc = 0;
var pos, vel, acc;
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

var movingPointsSketch = function(p) {
	// Global variables
	var plot, i;
	var step = 0;
	var stepsPerCycle = 100;
	var lastStepTime = 0;
	var clockwise = true;
	var scale = 5;

	// Initial setup
	p.setup = function() {
		// Create the canvas
		var canvas = p.createCanvas(450, 450);

		// Prepare the first set of points
		var nPoints1 = stepsPerCycle / 10;
		var points1 = [];

		for ( i = 0; i < nPoints1; i++) {
			points1[i] = calculatePoint(step, stepsPerCycle, scale);
			step = (clockwise) ? step + 1 : step - 1;
		}

		lastStepTime = p.millis();

		// Prepare the second set of points
		var nPoints2 = stepsPerCycle + 1;
		var points2 = [];

		for ( i = 0; i < nPoints2; i++) {
			points2[i] = calculatePoint(i, stepsPerCycle, 0.9 * scale);
		}

		// Create the plot
		plot = new GPlot(p);
		plot.setPos(25, 25);
		plot.setDim(300, 300);
		// or all in one go
		// plot = new GPlot(p, 25, 25, 300, 300);

		// Set the plot limits (this will fix them)
		plot.setXLim(-1.2 * scale, 1.2 * scale);
		plot.setYLim(-1.2 * scale, 1.2 * scale);

		// Set the plot title and the axis labels
		plot.setTitleText("Clockwise movement");
		plot.getXAxis().setAxisLabelText("x axis");
		plot.getYAxis().setAxisLabelText("y axis");

		// Activate the panning effect
		plot.activatePanning();

		// Add the two set of points to the plot
		plot.setPoints(points1);
		plot.addLayer("surface", points2);

		// Change the second layer line color
		plot.getLayer("surface").setLineColor(p.color(100, 255, 100));
	};

	// Execute the sketch
	p.draw = function() {
		// Clean the canvas
		p.background(150);

		// Draw the plot
		plot.beginDraw();
		plot.drawBackground();
		plot.drawBox();
		plot.drawXAxis();
		plot.drawYAxis();
		plot.drawTopAxis();
		plot.drawRightAxis();
		plot.drawTitle();
		plot.getMainLayer().drawPoints();
		plot.getLayer("surface").drawFilledContour(GPlot.HORIZONTAL, 0);
		plot.endDraw();

		// Add and remove new points every 10th of a second
		if (p.millis() - lastStepTime > 100) {
			if (clockwise) {
				// Add the point at the end of the array
				plot.addPoint(calculatePoint(step, stepsPerCycle, scale));
				step++;

				// Remove the first point
				plot.removePoint(0);
			} else {
				// Add the point at the beginning of the array
				plot.addPointAtIndexPos(0, calculatePoint(step, stepsPerCycle, scale));
				step--;

				// Remove the last point
				plot.removePoint(plot.getPointsRef().length - 1);
			}

			lastStepTime = p.millis();
		}
	};

	p.mouseClicked = function() {
		if (plot.isOverBox(p.mouseX, p.mouseY)) {
			// Change the movement sense
			clockwise = !clockwise;

			if (clockwise) {
				step += plot.getPointsRef().length + 1;
				plot.setTitleText("Clockwise movement");
			} else {
				step -= plot.getPointsRef().length + 1;
				plot.setTitleText("Anti-clockwise movement");
			}
		}
	};

	function calculatePoint(i, n, rad) {
		var delta = 0.1 * p.cos(p.TWO_PI * 10 * i / n);
		var ang = p.TWO_PI * i / n;
		return new GPoint(rad * (1 + delta) * p.sin(ang), rad * (1 + delta) * p.cos(ang));
	}

};

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
    posSlider= p.createSlider(0, 20, 10);
    velSlider= p.createSlider(0, 20, 10);
    accSlider= p.createSlider(0, 20, 10);
    posSlider.position(p.width/2, 200);
    velSlider.position(p.width/2, 240);
    accSlider.position(p.width/2, 280);
    posSlider.input(setValue);
    //posSlider.changed(setValue);
    //posSlider.html("Position");
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
    p.translate(stageScale*p.xpos+p.width/2, p.ypos);
    p.ellipse(0, 0, p.moverRad, p.moverRad);
    p.pop();
  }

  function updateMotion(){
    p.vel = p.vel + deltaT*p.acc;
    p.xpos = p.xpos + deltaT*p.vel;
    posPoints.push(p.xpos);
    velPoints.push(p.vel);
    accPoints.push(p.acc);
    t = t+deltaT;
  };

  function setValue(){
    posPoints.push(posSlider.value()-10);
    p.xpos = posSlider.value()-10;
    p.vel = 0;
    velPoints.push((posPoints[posPoints.length-1]-posPoints[posPoints.length-3])/(2*deltaT));
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
    p.noStroke();
    p.fill(0,0,250);
    for (var i = 0; i < posPoints.length; i++){
      p.push();
      p.translate(xScale*deltaT*i + xMargin, p.height/2+ yScale*posPoints[i]);
      p.ellipse(0 , 0, 4, 4);
      if (i>0){
          p.stroke(0);
          p.line(0,0,deltaT,posPoints[i-1]);
      }
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
var defaultPlotSketch = new p5(movingPointsSketch);
