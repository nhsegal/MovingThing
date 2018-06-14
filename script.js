
var beta1 = 0;
var beta2 = 0;
var gamma1 = 1/Math.sqrt(1 - beta1*beta1);
var gamma2 = 1/Math.sqrt(1 - beta2*beta2);
var spacing = 45;
var spacing1 = spacing/gamma1;
var spacing2 = spacing/gamma2;

var speedSlider;
var speedSlider2;

var input1;
var input2;
var input3;
var box1;
var box2;
//Comment

function setup() {
  var cnv = createCanvas(1200, 560);
  cnv.parent("myContainer");
  strokeWeight(.25);
  stroke(0);
  speedSlider = createSlider(-196,196,0);
  speedSlider2 = createSlider(-196,196,0);
  speedSlider.position(145,496);
  speedSlider2.position(145,538);
  speedSlider.parent("sliderPos");
  speedSlider2.parent("sliderPos2");
  speedSlider.style("width", "130px");
  speedSlider2.style("width", "130px");

  box1 = document.getElementById("box1");
  box2 = document.getElementById("box2");


  input1 = createInput("0");
  input1.parent("buttonPos");
  input1.position(80, 497);
  input1.style("width", "30px");

  input2 = createInput("0");
  input2.parent("buttonPos2");
  input2.position(80, 537);
  input2.style("width", "30px");
}

function draw() {
  background(255);
  console.log(box1.checked);

  //borders
  line(0, 0, 0, height);
  line(0, height, 0, height);
  line(width, 0, width, height);
  line(width, height, 0, height);

  push();
  translate(width/2,height);


  //dotted lines for light cone
  strokeWeight(1);
  fill(0);
  for (var i=0; i<height; i=i+10) {
  	line(i,-i,i+5,-i-5);
  	line(-i,-i,-i-5,-i-5);
  }

  //black axes
  strokeWeight(1);
  line(0, 0, beta1*height, -height);
  line(0, 0, beta1*height, -height);
  line(0, 0, width, -beta1*width);
  line(0, 0, -width, beta1*width);

  //black equitemp lines

  strokeWeight(.5);

  for (var i=0; i<2*height; i=i+spacing1) {
  	if (box1.checked==true){
  		line(0, -i, width, -i-beta1*width);
  		line(0, -i, -width, -i+beta1*width);
  	}

 //black clocks
    strokeWeight(1);
  	fill(255);
  	ellipse(gamma1*gamma1*beta1*i, -gamma1*gamma1*i, 17, 17);
  	textAlign(CENTER,CENTER);
  	text((i/spacing1).toFixed(0), (gamma1*gamma1*beta1*i+1), (-gamma1*gamma1*i+4));

  	strokeWeight(.5);
    fill(0);
 	//ellipse((1/(1-beta1*beta2))*beta2*i, -(1/(1-beta1*beta2))*i, 4, 4);
}


  //red equitemps
  stroke(255,0,0);
  if (box2.checked==true){
    for (var i=0; i<2*height; i=i+spacing2) {
  	  line(0, -i, width, -i-beta2*width);
  	  line(0, -i, -width, -i+beta2*width);
    }
  }
  //red axes
  strokeWeight(1);
  line(0, 0, beta2*height, -height);
  line(0, 0, beta2*height, -height);
  line(0, 0, width, -beta2*width);
  line(0, 0, -width, beta2*width);
  strokeWeight(.25);


 for (var i=0; i<2*height; i=i+spacing2) {

//red dots on black t axis
  	//fill(255,0,0);
  	//ellipse((1/(1-beta1*beta2))*beta1*i, -(1/(1-beta1*beta2))*i, 5, 5);

  //red clocks on red axis
    strokeWeight(1);
  	fill(255);
  	ellipse(gamma2*gamma2*beta2*i, -gamma2*gamma2*i, 17, 17);
  	textAlign(CENTER,CENTER);
  	text((i/spacing2).toFixed(0), (gamma2*gamma2*beta2*i+1), (-gamma2*gamma2*i+4));
  	strokeWeight(.25);
  }

  pop();
  fill(255);
  //rect(0,400,300,100);
  fill(0);
  textSize(16);
  textAlign(CENTER);
  text("Show Lines of\nSimultaneity", 336, 442);
 //text("Show Lines of Simultaneity", 300, 447);
  text("0", 206, 483);
  textSize(16);
  text("-0.98", 142, 483);
  textSize(16);
  text("0.98", 268, 483);
  strokeWeight(1);
  line(204,490,204,510);
  line(145,490,145,510);
  line(264,490,264,510);

  line(204,530,204,550);
  line(145,530,145,550);
  line(264,530,264,550);



  strokeWeight(.25);
  text("Velocity:", 40, 507);
  stroke(255,0,0);
  fill(255, 0, 0);
  text("Velocity:", 40, 547);



}

function setSpeed1() {
	beta1 = speedSlider.value()/200;
	gamma1 = 1/Math.sqrt(1 - beta1*beta1);
	spacing1 = spacing/gamma1;
	input1.value(beta1);
}

function setSpeed2() {
	beta2 = speedSlider2.value()/200;
	gamma2 = 1/Math.sqrt(1 - beta2*beta2);
	spacing2 = spacing/gamma2;
	input2.value(beta2);
}
