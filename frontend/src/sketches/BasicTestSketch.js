import Flipper from "./Flipper";
class BasicSketch{
    constructor(p){
        this.p = p;
        this.flipper = new Flipper(
            this.p, 
            this.p.width/2, 
            this.p.height/2, 
            200,
            200
        );
    }
    display = function(){
        let w = this.p.width;
        this.p.fill(0,0,255);
        this.p.ellipse(w/2 - 75,this.p.height/2 - 100,30,30);
        this.flipper.display();
    };
}

export default BasicSketch;