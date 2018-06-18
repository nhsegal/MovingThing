var font,fontsize = 40;
var moverRad = 10;
var xpos = 600;
var ypos = 140;
var vel = 2;
var acc = -.050;

var points, seed, plot;
//Comment

//function preload(){
//  font = loadFont('assets/SourceSansPro-Regular.otf');
//}
function setup() {
  var cnv = createCanvas(1200, 500);
  cnv.parent("stage");
  points = [];
		seed = 100 * random();

		for (i = 0; i < 100; i++) {
			points[i] = new GPoint(i, 10 * noise(0.1 * i + seed));
		}

		// Create a new plot and set its position on the screen
		plot = new GPlot();
		plot.setPos(0, 0);

		// Add the points
		plot.setPoints(points);

		// Set the plot title and the axis labels
		plot.setTitleText("A very simple example");
		plot.getXAxis().setAxisLabelText("x axis");
		plot.getYAxis().setAxisLabelText("y axis");

		// Draw it!
		plot.defaultDraw();


}

function draw() {
  background(80,180,80);
  fill(0,210,255);
  rect(0,0, 1200, 150);
  drawNumberLine();
  updateMotion();
  drawMover();
  drawPosGraph();
}

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
