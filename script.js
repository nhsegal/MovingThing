
var beta1 = 0;
var speedSlider;

var input1;
var box1;
var font,
  fontsize = 40
//Comment

function preload(){
  font = loadFont('assets/SourceSansPro-Regular.otf');
}

function setup() {
  var cnv = createCanvas(800, 200);
  cnv.parent("stage");
}

function draw() {
  background(50,150,50);
  fill(0,200,250);
  rect(0,0, 800, 150);
  drawNumberLine();
}

function setSpeed1() {
}

function drawNumberLine() {
  fill(230,230,0);
  rect(50,160,700,10);
}
