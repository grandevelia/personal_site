import java.util.*;
ArrayList<Bar> bars;
float xstart, xnoise, ystart, ynoise, xMax, yMax, time;
ArrayList<Flipper> fs;
Flipper f;
boolean[] keys;
int depth;
  
import processing.video.*;
Movie myMovie;

ArrayList<Square> squares;
int divisor = 10;
int curr;
int dir = 1;
PImage image;
int numBumps = 0;
int bumpbumpTimer = 200;
int bumpTimer = 0;

ArrayList<Eye> eyes;
int numEyes = 20;
void setup(){
  keys = new boolean[100];
  time = 0;
  size(600,600);
  myMovie = new Movie(this, "movie.mov");
  myMovie.loop();
  xstart = 0;
  ystart = 0;
  xMax = width;
  yMax = height;
  fs = new ArrayList<Flipper>();
  bars = new ArrayList<Bar>();
  bars.add(new Bar(new PVector(0,0), new PVector(width,height/4), 3));
  squares = new ArrayList<Square>();
  for (int i =0; i < divisor; i ++){
    for (int j = 0; j < divisor; j ++){
      squares.add(new Square(width/divisor, new PVector(i*width/divisor, j*height/divisor)));
    }
  }
  Collections.shuffle(squares);
  curr = 0;
  image=loadImage("slashnaught.jpeg");
  image.resize(300,300);
  imageMode(CENTER);
  myMovie.volume(0);
  
  eyes = new ArrayList<Eye>();
  for (int i = 0; i < numEyes; i ++){
    eyes.add(new Eye());
  }
}
void draw(){
  time++;
  if (time > 100) time = 0;
  background(0);
  if (keys[6]){
    imageMode(CORNER);
    pushMatrix();
    translate(width/2,height/2);
    rotate(PI);
    translate(-width/2,-height/2);
    float x = width-width/(float)(Math.pow(2,depth));
    float y = height-height/(float)(Math.pow(2,depth));
    image(myMovie, x, y, width/(depth+1),height/(depth+1));
    popMatrix();
  } 
  if (keys[7]){
    imageMode(CENTER);
    pushMatrix();
    translate(width/2,height/2);
    rotate(PI);
    translate(-width/2,-height/2);
    image(myMovie, 300,300);
    popMatrix();
  }
  if(keys[4]){
    xstart -= 0.03; 
    ystart -= 0.03;
    xnoise = xstart; 
    ynoise = ystart;
    for(int y = 0; y <= height/(depth+1); y += 10){
      ynoise += 0.20*(y-height/(depth+1))/(height/(2*(depth+1)));
      xnoise = xstart; 
      for(int x = 0; x < width/(depth+1); x += 10){
        xnoise += 0.20 * (x-width/(depth+1))/(width/(2*(depth+1)));
        drawPoint(x, y, noise(xnoise, ynoise));
      }
    } 
  }
  
  if (keys[3]){
    imageMode(CENTER);
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
      image(copy,300,300);
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
      Collections.shuffle(squares);
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
}

float radDist(float x, float y){
  return (float)(Math.pow((Math.pow(x,2) + Math.pow(y, 2)),0.5));
}

void drawPoint(float x, float y, float noiseFactor) { 
  pushMatrix();
  translate(x,y);
  noStroke();
  float sin = sin(time*2*PI/100);
  float cos = cos(time*2*PI/100);
  float edgeSize = noiseFactor * 40; 
  //keep red constant or use noise() to return to cloud effect
  //could use time variable to smoothly pulse color
  float red = 105*radDist(Math.abs(width/2-x),Math.abs(height/2-y))/radDist(width/2, height/2);
  float green = 150 +(noiseFactor * 120)*sin;
  float blue = 175 +(noiseFactor * 120)*cos;
  float alph = (noiseFactor * 120); 
  fill(red, green*random(x,y), blue, alph);
  ellipse(0,0, edgeSize, edgeSize); 
  popMatrix();
}

class Flipper {
  PVector origin;
  int w;
  int h;
  int parity;
  boolean code;
  Flipper(PVector origin, int w, int h, boolean code){
    this.origin = origin;
    parity = 0;
    this.w = w;
    this.h = h;
    this.code = code;
  }
  void flip () {
    color rgba;
    loadPixels();
      for (int i = (int)origin.x-w/2; i < origin.x; i ++){
        for (int j = (int)origin.y-h/2; j < i; j ++){
          rgba = color(pixels[j*width+i]);
            //flip \|/
            pixels[j*width+(int)(origin.x+w/2-i)]=rgba;
            // flip /
            pixels[i*width+(int)(origin.x+(w/2-j))] = rgba;
            //flip \
            pixels[i*width+(int)(j)] = rgba;
        }
      }
      for (int i = (int)origin.x-w/2; i < (int)origin.x+w/2; i ++){
        for (int j = (int)origin.y-h/2+1; j < (int)origin.y; j ++){
          rgba = color(pixels[j*width+i]);
            
            pixels[(int)(origin.y+h/2-j)*width+i]=rgba;
            
        }
      }
    updatePixels();
  }
}
void keyPressed(){
}
void keyReleased(){
if (key == 's'){
  if (fs.size() < 6){
    depth ++;
    if (fs.size() == 0){
     fs.add(new Flipper(new PVector(width/(int)(Math.pow(2,fs.size()+1)),height/(int)Math.pow(2,fs.size()+1)),width/(int)Math.pow(2,fs.size()),height/(int)Math.pow(2,fs.size()),true)); 
    } else {
      float newY = (float)(height/Math.pow(2,fs.size()+1));
      float newX = (float)(width/Math.pow(2,fs.size()+1));
      int newHeight = (int)(width/Math.pow(2,fs.size()));
      int newWidth = (int)(height/Math.pow(2,fs.size()));
      fs.add(new Flipper(new PVector(newX, newY), newWidth, newHeight,false)); 
    }
  }
 }
 if (key == 'd'){
   if (fs.size() > 0){
     depth --;
     keys[fs.size()+1] = false;
     fs.remove(fs.size()-1);
    }
  }
  if (key == 'm'){
     keys[10] = !keys[10]; 
  }
  if (Character.isDigit(key)){
     numBumps = key-48; //numbers start at 48 after aA etc
     bumpbumpTimer = bumpbumpTimer/numBumps;
  }
  if (key == 'n'){
    keys[3] = ! keys[3];
  }
  if(key == 'b'){
   keys[4] = !keys[4]; 
  }
  if (key =='v'){
     keys[5] = !keys[5]; 
  } 
  if (key =='l'){
     keys[6] = !keys[6]; 
  }
  if (key =='k'){
   keys[7] = !keys[7]; 
  }
}
void movieEvent(Movie m) {
  m.read();
}
/************/
class Bar {
   PVector loc;
   PVector size;
   ArrayList<System>lines;
   int numSystems;
   
   Bar (PVector loc, PVector size, int numSystems){
     this.loc = loc;
     this.size = size;
     lines = new ArrayList<System>();
     this.numSystems = numSystems;
     
     for (int i = 0 ; i < numSystems; i ++){
       lines.add(new System(loc, size));
     }
   }
   
   void display(int depth){
     for (int i = 0; i < lines.size(); i ++){
        lines.get(i).display(depth); 
     }
   }
}
/**********/
class Circle {
   PVector loc;
   PVector size;
   color c;
   int age;
   
   Circle (PVector loc, PVector size, color parentColor){
     this.loc = loc;
     this.size = size;
     c = parentColor;
     age = 0;
   }
   
   void display(int depth){
      age ++;
      fill(c, 150-age);
      ellipse(loc.x/depth,loc.y,size.x/depth,size.y/depth);
   }
}
/************/
import java.util.*;
class Eye{
  ArrayList<ArrayList<PVector>> dest;
  PVector loc;
  PVector size;
  int baseSize; 
  ArrayList<Float> upperArcVals;
  float blinkTime;
  float finalBlinkTime;
  float blinkTimeMulti = 1;
  
  boolean open = false;
  float pauseTime = 0;
  float finalPauseTime;
  
  float time;
  float finalTime;
  public Eye(){
  
    dest = new ArrayList<ArrayList<PVector>>();
    loc = new PVector(random(100,400),random(100,500));
    baseSize = (int)random(10,50);
    size = new PVector(baseSize*100/60,baseSize*70/60);
    
    upperArcVals = new ArrayList<Float>();
    int xOffset = (int)size.x/2;
    int yOffset = (int)size.y/2;
    
    for (int i = -xOffset; i < xOffset; i ++){
      upperArcVals.add(-(float)( (float)yOffset/(float)xOffset * (Math.pow(Math.pow(xOffset, 2)-Math.pow(i, 2), 0.5)) ) );
    }
    time = 0;
    finalTime = random(100,200);
    blinkTime = 0;
    finalBlinkTime = random(10,20);
    finalPauseTime = finalBlinkTime*3;
    
  }
  
  void display(){
    time ++;
    if (time > finalTime) time = 0;
    displayEye();
    blink();
  }
  void displayEye(){
      fill(255);
      strokeWeight(2);
      stroke(0);
      ellipse(loc.x,loc.y,size.x,size.y);
      strokeWeight(1);
      
      stroke(0);
      fill(0,255,255);
      ellipse(loc.x,loc.y,baseSize,baseSize);
      int numLines = 60;
      int rad = baseSize/2-1;
      
      //Iris
      strokeWeight(2);
      for (int i = 1; i < numLines; i ++){
        double ang = i*2*Math.PI/numLines;
        double cos = Math.cos(ang);
        double sin = Math.sin(ang);
        
        float startX = loc.x + rad * (float)(cos);
        float startY = loc.y + rad * (float)(sin);
        float noise = noise(startX, startY);
        float noiseRad = noise*rad;
        float noiseX = loc.x + noiseRad * (float)(cos);
        float noiseY = loc.y + noiseRad * (float)(sin);
        color c = color(20*noise,255*noise,155*noise);
        stroke(c, 165);
        line(startX,startY,noiseX,noiseY);
      }
      
      //Pupil
      fill(0);
      ellipse(loc.x,loc.y,baseSize/3,baseSize/3);
  }
  void blink(){
    if (open){
      pauseTime ++;
      if (pauseTime > finalPauseTime){
        open = false;
      }
    } else {
      if (blinkTime >= finalBlinkTime) {
        blinkTimeMulti = -1;
        open = true;
        pauseTime = 0;
      }
      else if (blinkTime < 2){
        blinkTimeMulti = 1;
        open = false;
      }
      
      blinkTime += blinkTimeMulti;
      
      int xOffset = (int)size.x/2;
      int yOffset = (int)size.y/2;
      
      //Eyelid
      //generate arc y values for each x
      float [] arcVals = new float [2*xOffset];
      
      for (int i = -xOffset; i < xOffset; i ++){
        float blinkTimeMultiplier = (float)((-finalBlinkTime+(2*blinkTime))/finalBlinkTime);
        float ellipseMultipler = yOffset/(float)xOffset;
        arcVals[i+xOffset] = -(float)(blinkTimeMultiplier*ellipseMultipler *  (Math.pow( Math.pow(xOffset, 2)-Math.pow(i, 2), 0.5) ));
      }
      
      
      int arrayIndex = 0;
      loadPixels();
      for (int i = -xOffset; i < xOffset; i++) {
        
        for (int j = (int)(arcVals[arrayIndex]); j >= upperArcVals.get(i+xOffset)-1; j-- ){
          
          int setX = (int)(i + loc.x);
          int setY = (int)(j+loc.y);
          pixels[setX + setY*width] = color(0);
          
        }
        
        arrayIndex ++;
      }
      updatePixels();
    }
  }
}
/***********/
class Square{
  float size;
  color c;
  PVector loc;
  int foldTime = 20;
  int time = 0;
  boolean fold = false;
  int dir;
  float alph;
  
  Square (float size, PVector loc){
    this.size = size-1; //account for edge overflow
    this.loc = loc;
    double rand = random(3);
    if (rand > 2){
      this.c = 0;
      dir = 1;
      alph = 0;
    } else if (rand > 1){
       c = 255;
       alph = 1;
       dir = -1;
    } else {
      this.c = color(56,random(79,100),205);
      dir = 1;
      alph = 0;
    }
  }
  void display(){
    rectMode(CORNER);
    noFill();
    stroke(c);
    rect(loc.x,loc.y,size,size);
    if (fold){
       time ++;
       float foldLocParam = (time)*size/(2*foldTime);
       float foldSizeParam = (time)*size/(foldTime);
       rect(loc.x+foldLocParam, loc.y+foldLocParam, size-foldSizeParam, size-foldSizeParam); 
       
       if (foldLocParam == size/2){
         time = 0;
         this.c=255-c;
         size += size;
         if (size>width/4){
           size = 2;
         }
       }
       
    }
  }
  void fold(){
    this.fold = true;
  }
}
/***********/
class System {
   ArrayList<Circle>circles;
   PVector loc;
   PVector size;
   color c;
   int age;
   float myTime;
   float finalTime = 12;
   
   System (PVector loc, PVector size){
     circles = new ArrayList<Circle>();
     this.loc = loc;
     this.size = size;
     this.age = 0;
     
     colorMode(HSB);
     c = color(random(255), random(50,150), 255);
     addNewCircle();
   }
   
   void display(int depth){
     age ++;
     myTime ++;
     if (age > 150) age = 0;
     
     if (circles.size() > 15){
       circles.remove(0);
     }
    
     if (age % finalTime == 0) {
       addNewCircle();
       myTime = 0;
     }
     
     
     for (int i = 0; i < circles.size(); i ++){
        Circle curr = circles.get(i);
        if (curr.age >= 150) {
          circles.remove(i);
        }
        
        curr.display(depth);
        if ( i < circles.size()-1){
          Circle next = circles.get(i+1);
          stroke(color((curr.c+next.c)/2), 150-curr.age);
          if (i == circles.size()-2){
             /*
              line ends at curr at time_until_next_circle = , ends at next.x at time_until = 0
            */
            float nextXMod = next.loc.x-curr.loc.x;
            float nextYMod = next.loc.y-curr.loc.y;
            float nextX = curr.loc.x+(myTime)*(nextXMod)/(finalTime*depth); 
            float nextY = curr.loc.y+(myTime)*(nextYMod)/finalTime;
          
            line(curr.loc.x/depth, curr.loc.y, nextX, nextY);
          } else {
            line(curr.loc.x/depth, curr.loc.y, next.loc.x/depth, next.loc.y);
          }
        }
        
     }
   }
   
   void addNewCircle(){
     PVector firstLoc = new PVector(random(loc.x, loc.x+size.x),random(loc.y, loc.y+size.y));
     float firstSize = (float)random(20);
     PVector firstSizeV = new PVector(firstSize, firstSize);
     circles.add( new Circle(firstLoc, firstSizeV, this.c));
   }
}

/*************/








