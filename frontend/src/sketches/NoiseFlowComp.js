import p5 from 'p5';
function NoiseFlowSketch(p){
    p.colorMode(p.HSB, 255);
    let playAnimation = true;
    let dim = Math.min(p.width, p.height);
    let myNoiseFlow = new NoiseFlow(dim, dim);

    const display = () => {
        p.background(0);
        myNoiseFlow.mainRun(playAnimation);
    }

    function NoiseFlow(width, height){
        let inc = 0.04;
        let numParticles = 30;
        let zoff = 0.0;
        let particles = [];

        for (let i = 0 ; i < numParticles; i ++){
            particles.push(
                new NoiseFlowParticle(
                    p.width * Math.random(),
                    p.height * Math.random()
                )
            );
        }

        const mainRun = (playAnimation) => {
            if (playAnimation){
                zoff += 0.17 * inc;
                for (let i = 0; i < particles.length; i ++){
                    particles[i].follow(zoff);
                    particles[i].update();
                    particles[i].show();
                }
            } else {
                for (let i = 0; i < particles.length; i ++){
                    particles[i].show();
                }
            }
        }
        return {
            mainRun: mainRun
        }
    };
    function NoiseFlowParticle(x, y){
        let inc = 0.04;
        let pos = p.createVector(x, y);
        let vel = p.createVector(Math.random(), Math.random());
        let acc = p.createVector(0, 0);
        let maxSpeed = 5;
        let fades = [];
        let time = 255 * Math.random();
        let history = 15;
    
        const update = () => {
            vel.add(acc);
            vel.limit(maxSpeed);
            pos.add(vel);
            acc.mult(0);
            if (time > 255){
                time = 0;
            }
            time ++;
        }
    
        const applyForce = (force) => {
            acc.add(force); 
        }
    
        const show = () => {
            edges();
            fades.unshift(pos.copy());
    
            if (fades.length > history){
                fades.pop();
            }
    
            for (let i = 0; i < fades.length-1; i ++){
                if (checkEdges(fades[i], fades[i+1])){
                    p.stroke(time, 255, 255, 155 * (fades.length - i)/fades.length);
                    p.line(fades[i].x, fades[i].y, fades[i+1].x, fades[i+1].y);
                } 
            }
    
        }
    
        const edges = () => {
            let width = p.width;
            let height = p.height
            if (pos.x > width){
                pos.x = 0;
            }
            if (pos.x < 0){
                pos.x = width;
            }
            if (pos.y > height){
                pos.y = 0;
            }
            if (pos.y < 0){
                pos.y = height;
            }
        }
    
        const checkEdges = (curr, prev) => {
            let returner = true;
            if (curr.x === 0){
                if (prev.x > p.width - 10){
                    returner = false;
                }
            } else if (curr.x === p.width){
                if (prev.x < 10){
                    returner = false;
                }
            }
            if (curr.y === p.height){
                if (prev.y < 10){
                    returner =false;
                }
            } else if (curr.y === 0){
                if (prev.y > p.height - 10){
                    returner = false;
                }
            }
            return returner;
        }
    
        const follow = (zoff) => {
            let angleNoise = 5;
            let angle = p.noise(inc * pos.x/8, inc * pos.y/8, zoff) * 2 * Math.PI * angleNoise;
            let force = p5.Vector.fromAngle(angle);
            force.setMag(2);
            applyForce(force);
        }
        return {
            show: show,
            follow: follow,
            update: update
        }
    }
    return {
        display: display
    }
};
export default NoiseFlowSketch;
