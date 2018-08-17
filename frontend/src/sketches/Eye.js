import "p5/lib/addons/p5.dom";

export default function Sketch (p) {
     let height = 0.42*window.innerHeight;
     let width = window.innerWidth;
     let time = 0;

     let baseSize = 60;
     let eyeAspect = 5/3;
     let eyes = [];
     let numEyes = 1;
     let wave;

     p.setup = function (props) {
          p.createCanvas(width, height);
          wave = p.createVideo('../sketchData/wave.mov');
          for (let i = 0; i < numEyes; i ++){
               let modifier = (i+1.0)/(eyes.length+2.0);
               eyes.push(new Eye(p.createVector(eyeAspect*baseSize,baseSize), p.createVector(width*modifier, height*modifier)));
          }
     };

     p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
          if (props.mouseOn){

          }
     };
     p.draw = () => {
          time ++;
          if (time > 100) {
               time = 0;
          }
          //p.background(0);

          for (let i = 0; i < numEyes; i ++){
               let eye = eyes[i];
               eye.display();
          }
     };

     let Eye = class {
          constructor(size, loc){
               this.dest = [];
               this.loc = loc;
               this.size = size;

               this.upperArcVals = [];
               this.xOffset = this.size.x/2;
               this.yOffset = this.size.y/2;

               for (let i = -this.xOffset; i < this.xOffset; i ++){
                    this.upperArcVals.push(-(this.yOffset/this.xOffset * (Math.pow(Math.pow(this.xOffset, 2)-Math.pow(i, 2), 0.5)) ) );
               }

               this.time = 0;
               this.finalTime = p.random(100,200);
               this.blinkTime = 0;
               this.finalBlinkTime = p.random(10,20);
               this.finalPauseTime = this.finalBlinkTime*3;

               this.blinkTimeMultiplier = 1;
               this.pauseTime = 0;

               this.open = false;
          }

          display = function(){
               this.time ++;
               if (this.time > this.finalTime){
                    this.time = 0;
               }
               this.displayEye();
               this.blink();
          }
          displayEye = function(){
               p.fill(255);
               p.ellipse(this.loc.x,this.loc.y,this.size.x,this.size.y);

               p.noStroke();
               p.fill(0,255,255);

               wave.loadPixels();
               p.loadPixels();
               for (let i = this.loc.x - this.size.x/2; i < this.loc.x + this.size.x/2; i ++){
                    for (let j = this.loc.y - this.size.y/2; j < this.loc.y + this.size.y/2; j ++){
                         p.pixels[i]
                    }
               }
               p.ellipse(this.loc.x,this.loc.y,baseSize/1.1,baseSize/1.1);
               let numLines = 60;
               let rad = this.baseSize/2-1;

               //Iris
               p.strokeWeight(2);
               for (let i = 1; i < numLines; i ++){
                    let ang = i*2*Math.PI/numLines;
                    let cos = Math.cos(ang);
                    let sin = Math.sin(ang);

                    let startX = this.loc.x + rad * cos;
                    let startY = this.loc.y + rad * sin;

                    let noise = p.noise(startX, startY);
                    let noiseRad = noise*rad;
                    let noiseX = this.loc.x + noiseRad * cos;
                    let noiseY = this.loc.y + noiseRad * sin;

                    let c = p.color(20*noise,255*noise,155*noise);
                    p.stroke(c, 165);
                    p.line(startX,startY,noiseX,noiseY);
               }

               //Pupil
               p.fill(0);
               p.ellipse(this.loc.x,this.loc.y,this.size.y/1.75,this.size.y/1.75);
          }
          blink = function(){
               if (this.open){
                    this.pauseTime ++;
                    if (this.pauseTime > this.finalPauseTime){
                         this.open = false;
                    }
               } else {
                    if (this.blinkTime >= this.finalBlinkTime) {
                         this.blinkTimeMultiplier = -1;
                         this.open = true;
                         this.pauseTime = 0;
                    } else if (this.blinkTime < 2){
                         this.blinkTimeMulti = 1;
                         this.open = false;
                    }

                    this.blinkTime += this.blinkTimeMulti;

                    let xOffset = parseInt(this.size.x/2,10);
                    let yOffset = parseInt(this.size.y/2,10);

                    //Eyelid
                    //generate arc y values for each x
                    let arcVals = new Array(2*xOffset);

                    for (let i = -xOffset; i < xOffset; i ++){
                         let blinkTimeMultiplier = (-this.finalBlinkTime+(2*this.blinkTime))/this.finalBlinkTime;
                         let ellipseMultipler = yOffset/xOffset;
                         arcVals[i+xOffset] = -(blinkTimeMultiplier * ellipseMultipler *  (Math.pow( Math.pow(xOffset, 2)-Math.pow(i, 2), 0.5) ));
                    }


                    let arrayIndex = 0;
                    p.loadPixels();
                    for (let i = -xOffset; i < xOffset; i++) {

                         for (let j = arcVals[arrayIndex]; j >= this.upperArcVals[i+xOffset]-1; j-- ){

                              let setX = i + this.loc.x;
                              let setY = j+this.loc.y;
                              p.pixels[setX + setY*width] = p.color(0);
                         }

                         arrayIndex ++;
                    }
                    p.updatePixels();
               }
          }
     }
}


