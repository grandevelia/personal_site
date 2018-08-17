import p5 from "p5";

export default function Sketch (p) {

  let myNoiseFlow = [];
  let playAnimation = true;
  let height = 0.42*window.innerHeight;
  let width = window.innerWidth;

  p.setup = function (props) {
    p.createCanvas(width, height);
    p.colorMode(p.HSB, 255);
    p.pixelDensity(1);
    myNoiseFlow = new NoiseFlow();
    p.background(0);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    playAnimation = props.playAnimation;
    if (props.mouseOn){

    }
  };

  p.draw = () => {
    p.background(0);
    if (p.pmouseX > 0 && p.pmouseX < width && p.pmouseY > 0 && p.pmouseY < height){
      myNoiseFlow.particles.unshift(new NoiseFlowParticle (myNoiseFlow.zoff*0.1, p.mouseX, p.mouseY));
      myNoiseFlow.particles.pop();
    }
    myNoiseFlow.mainRun(playAnimation);
  };

  let NoiseFlow = class {
    constructor(){
      this.inc = 0.04;
      this.scl = 20;
      this.numParticles = 50;
      this.cols = p.floor(width/this.scl);
      this.rows = p.floor(height/this.scl);
      this.zoff = 0.0;
      this.particles = [];
      this.flowField = [];
      this.time = 0;
      for (let i = 0 ; i < this.numParticles; i ++){
        this.particles.push(new NoiseFlowParticle(i*0.1,p.random(width),p.random(height)));
      }
      let yoff = 0;
      for (let y = 0; y < this.rows; y ++){
        let xoff = 0;
         for (let x = 0; x < this.cols; x ++){
           this.flowField.push(p.createVector(xoff, yoff));
           xoff += this.inc;
         }
         yoff += this.inc;
      }
    }

    mainRun = function(playAnimation){
      if (playAnimation){
        let yoff = 0;
        for (let y = 0; y < this.rows; y ++){
          let xoff = 0;
           for (let x = 0; x < this.cols; x ++){
               let index = x + y * this.cols;
               let angle = p.noise(xoff, yoff, this.zoff)*2*p.PI * 4;
               let v = p5.Vector.fromAngle(angle);
               v.setMag(2);
               this.flowField[index] = v;
              
               xoff += this.inc;
           }
           yoff += this.inc;
        }
        this.zoff += 0.17*this.inc;
        for (let i = 0; i < this.particles.length; i ++){
            this.particles[i].follow(this.flowField, this.scl, this.cols);
            this.particles[i].update();
            this.particles[i].show();
        }
      } else {
        for (let i = 0; i < this.particles.length; i ++){
          this.particles[i].show();
        }
      }
    }
  }

  let NoiseFlowParticle = class {
    constructor(i, x, y){
      this.pos = p.createVector(x,y);
      this.vel = p.createVector(p.random(1),p.random(1));
      this.acc = p.createVector(0,0);
      this.maxSpeed = 5;
      this.fades = [];
      this.time = p.noise(i);
      this.history = 15;
    }
    
   
    update = function(){
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.w = p.abs(this.acc)*10;
      this.acc.mult(0);
      if (this.time > 255) this.time = 0;
      this.time ++;
    }
   
    applyForce = function(force){
       this.acc.add(force); 
    }
   
   show = function(){
      this.edges();
      this.fades.unshift(this.pos.copy());

      if (this.fades.length > this.history){
        this.fades.pop();
      }

      for (let i = 0; i < this.fades.length-1; i ++){
        if (this.checkEdges(this.fades[i], this.fades[i+1])){
          p.stroke(this.time, 255, 255, 60-i);
          p.line(this.fades[i].x, this.fades[i].y, this.fades[i+1].x, this.fades[i+1].y);
        } 
      }

   }

   edges = function(){
     if (this.pos.x > width){
       this.pos.x = 0;
     }
     if (this.pos.x < 0){
       this.pos.x = width;
     }
     if (this.pos.y > height){
       this.pos.y = 0;
     }
     if (this.pos.y < 0){
       this.pos.y = height;
     }
   }

   checkEdges = function(curr, prev){
      let returner = true;
      if (curr.x === 0){
        if (prev.x > width-10){
          returner = false;
        }
      } else if (curr.x === width){
        if (prev.x < 10){
          returner = false;
        }
      }
      if (curr.y === height){
        if (prev.y < 10){
          returner =false;
        }
      } else if (curr.y === 0){
        if (prev.y > height-10){
          returner = false;
        }
      }
      return returner;
   }

   follow = function(f, scl, cols){
      let x = p.floor(this.pos.x/scl);
      let y = p.floor(this.pos.y/scl);
      let index = x + y*cols;
      if (index < f.length){
        let force = f[index];
        
        this.applyForce(force);
      }
   }

  }

};
