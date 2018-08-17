import p5 from "p5";

export default function Sketch (p) {

  let playAnimation = true;
  let height = 0.42*window.innerHeight;
  let width = window.innerWidth;

  let bars = [];
  let xstart = 0;
  let xnoise = = 0;
  let ystart = 0;
  let ynoise = = 0;
  let xMax = height;
  let yMax = height;
  let time = 0;
  let fs = [];
  let f = {};
  let keys;
  let depth = 0;

  let myMovie;

  let squares = [];
  let divisor = 10;
  let curr = 0;
  let dir = 1;
  let numBumps = 0;
  let bumpbumpTimer = 200;
  let bumpTimer = 0;
  let eyes = [];
  let numEyes = 20;

  p.setup = function (props) {
    p.createCanvas(width, height);
    keys = new Array(60).fill(false);
    myMovie = p.createVideo("movie.mov");
    myMovie.loop();

    f = new Flipper();
    bars.add(new Bar(p.PVector(0,0), p.PVector(width, height/4), 3));
    for (let i = 0; i < divisor; i ++){
      for (let j = 0; j < divisor; j ++){
        squares.push(new Square(width/divisor, p.PVector(i*width/divisor, j *height/divisor)));
      }
    }
    p.shuffle(squares);
  
    image=loadImage("slashnaught.jpeg");
    image.resize(300,300);
    p.imageMode(CENTER);
    myMovie.volume(0);
    
    for (let i = 0; i < numEyes; i ++){
      eyes.push(new Eye());
    }
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    playAnimation = props.playAnimation;
    if (props.mouseOn){

    }
  };
  p.draw = () => {
    time ++;
    if (time > 100) {
      time = 0;
    }
    p.background(0);
    
    if (keys[6]){
      p.imageMode(CENTER);
      p.pushMatrix();
      p.translate(width/2,height/2);
      p.rotate(p.PI);
      p.translate(-width/2, -height/2);
      let x = width-width/(Math.pow(2, depth)); 
      let y = height-height/(Math.pow(2,depth));
      p.image(myMovie, x, y, width/(depth+1),height/(depth+1));
      p.popMatrix();
    }
    if (keys[7]){
      p.imageMode(CENTER);
      p.pushMatrix();
      p.translate(width/2,height/2);
      p.rotate(p.PI);
      p.translate(-width/2, -height/2);
      //p.image(myMovie, width/2, height/2);
      p.popMatrix();
    }
    
    if (keys[3]){
      p.imageMode(CENTER);
      if (numBumps > 0){
        bumpTimer ++;
        if (bumpTimer > bumpbumpTimer){
           bumpTimer = 0;
           numBumps --;
        }
        PImage copy = image.copy();
        double dmod = 200 * Math.sin(PI*bumpTimer/bumpbumpTimer);
        int mod = (int)dmod;
        copy.resize(300 + mod, 300 + mod);
        p.image(copy,300,300);
      } else {
        image(image, 300, 300);
        bumpbumpTimer = 100;
      }
      for (int i = 0; i < squares.size(); i ++){
        squares.get(i).display();
      }
      squares.get(curr).fold();
      curr += dir;
      if (curr >= squares.size()-1 || curr <= 0){
        dir = -dir;
        squares.get(curr).fold();
        p.shuffle(squares);
      }
    }
    
    if (keys[10]){
      for (int i = 0; i < bars.size(); i ++){
         bars.get(i).display(depth+1);
      }
    }
    if (keys[5]){
     for (int i = 0; i < numEyes; i ++){
        eyes.get(i).display();
      } 
    }
    for (int i = fs.size()-1 ; i > -1;i--){
      fs.get(i).flip();
    }
  };

  let Flipper = class {
    constructor(props){
      this.origin = 0.04;
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
