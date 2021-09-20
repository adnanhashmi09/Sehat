/*-------------------------------------------*/
/*  BASIC SETTING  */
/*-------------------------------------------*/

const canvas = document.querySelector('canvas');
canvas.height = (5*window.innerHeight)/7;
canvas.width = window.innerWidth;
var ctx = canvas.getContext('2d');
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
var img = new Image();
var resH = 1000;    
img.src = '../IMAGES/coronanew.svg';
if(window.innerHeight>resH){
    canvas.height = (3*window.innerHeight)/7;
}

document.querySelector('.heading-box').style.top = `${(2.5*canvas.height/5)+120}px`;


/*-------------------------------------------*/
/*  UTILITY FUNCTIONS  */
/*-------------------------------------------*/

//GET DISTANCE B/W TWO VIRUSES USING PYTHOGOREAN THEOREM
function distance(x1,y1,x2,y2){
const xDist = x2-x1;
const yDist = y2-y1;
return Math.sqrt(Math.pow(xDist,2)+ Math.pow(yDist,2));
}

//GET THE VELOCITIES AFTER COLLISION
function resolveCollision(particle, otherParticle) {
const xVelocityDiff = particle.dx - otherParticle.dx;
const yVelocityDiff = particle.dy - otherParticle.dy;

const xDist = otherParticle.x - particle.x;
const yDist = otherParticle.y - particle.y;

// Prevent accidental overlap of particles
if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
  // Grab angle between the two colliding particles
  const angle = -Math.atan2(
    otherParticle.y - particle.y,
    otherParticle.x - particle.x
  );

  // Store mass in var for better readability in collision equation
  const m1 = 1;
  const m2 = 1;

  // Velocity before equation
  const u1 = rotate(particle.dx, particle.dy, angle);
  const u2 = rotate(otherParticle.dx, otherParticle.dy, angle);

  // Velocity after 1d collision equation
  const v1 = {
    x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
    y: u1.y
  };
  const v2 = {
    x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
    y: u2.y
  };

  // Final velocity after rotating axis back to original location
  const vFinal1 = rotate(v1.x, v1.y, -angle);
  const vFinal2 = rotate(v2.x, v2.y, -angle);

  // Swap particle velocities for realistic bounce effect
  particle.dx = vFinal1.x;
  particle.dy = vFinal1.y;

  otherParticle.dx = vFinal2.x;
  otherParticle.dy = vFinal2.y;

  if(particle.size ===150 ){
      particle.dy = 0;
      particle.dx = 0;
  }
  if(otherParticle.size ===150 ){
    otherParticle.dy = 0;
    otherParticle.dx = 0;
}
}
}

//ROTATE THE COORDINATE AXIS

function rotate(dx, dy, angle) {
const rotatedVelocities = {
  x: dx * Math.cos(angle) - dy * Math.sin(angle),
  y: dx * Math.sin(angle) + dy * Math.cos(angle)
};
return rotatedVelocities;
}
/*-------------------------------------------*/
/*  PROTOTYPE OF VIRUSES  */
/*-------------------------------------------*/

function Virus(x,y,dx,dy,size,pos){
this.x = x,
this.y = y,
this.dx = dx,
this.dy = dy,
this.size = size,
this.pos = pos,
this.draw = (ctr)=>{
    if(ctr===0){
        ctx.drawImage(img,this.x,this.y,160,this.size);
    }else{ 
        ctx.drawImage(img,this.x,this.y,this.size,this.size);
    }
},
this.update = function(ctr){
    
    if(this.x + this.size> canvas.width || this.x <0 ){
            this.dx = -this.dx;
                }
          
    if(this.y + this.size> canvas.height || this.y -55 <0 ){
        this.dy = -this.dy;
    }

    if(this.pos ==="left"){
        if(this.x+this.size > (canvas.width)/2 -104){
            this.dx = -this.dx;
        }
    }

    if(this.pos ==="right"){
        if(this.x < (canvas.width)/2 +104){
            this.dx = -this.dx;
        }
    }

    for(var i=0;i<virusArr.length;i++){
        if(this===virusArr[i])continue;
        if(this.x < virusArr[i].x + virusArr[i].size &&
           this.x + this.size > virusArr[i].x        &&
           this.y < virusArr[i].y + virusArr[i].size &&
           this.y + this.size > virusArr[i].y){
              resolveCollision(this,virusArr[i]);
           }
    }
    this.x+=this.dx;
    this.y+=this.dy;
    this.draw(ctr);
}
}

var virusArr = []; // Empty virus array

/*-------------------------------------------*/
/*  INITIALING VIRUSES   */
/*-------------------------------------------*/

function init(){
virusArr.push(new Virus(canvas.width/2 - 75,canvas.height/2 - 120,0,0,150,"center"));
virusArr.push(new Virus(canvas.width/3 - 50,canvas.height/4 - 50,0,0,80,"left"));
virusArr.push(new Virus(canvas.width/9 - 40,canvas.height/2 - 40,0,0,60,"left"));
virusArr.push(new Virus(canvas.width/4 - 55,4*canvas.height/5 - 55,0,0,90,"left"));
virusArr.push(new Virus(3*canvas.width/4 - 40,4*canvas.height/5 - 40,0,0,60,"right"));
virusArr.push(new Virus(4.3*canvas.width/6 - 40,2*canvas.height/6 - 40,0,0,60,"right"));
virusArr.push(new Virus(6*canvas.width/7 - 50,3*canvas.height/6 - 50,0,0,80,"right"));
var velocityFactor = 0.1;
for(var i=1;i<virusArr.length;i++){
    var dx=(Math.random()*Math.pow(-1,Math.floor(Math.random()*4)))* velocityFactor;
    var dy=(Math.random()*Math.pow(-1,Math.floor(Math.random()*4)))* velocityFactor;
    virusArr[i].dx = dx;
    virusArr[i].dy = dy;
}
}

//REINITIALISE ON RESIZE TO COMPENSATE FOR CHANGE IN CANVAS DIMENSIONS
window.addEventListener('resize', function(){
canvas.width = window.innerWidth;
canvas.height = (5*window.innerHeight)/7;
if(window.innerHeight> resH){
    canvas.height = (3*window.innerHeight)/7;
}
document.querySelector('.heading-box').style.top = `${(2.5*canvas.height/5)+120}px`;

virusArr = [];   
init();                                                                              

});

init();

img.onload = ()=>{
virusArr.forEach((virus,index)=>{
    virus.draw(index);
})
}

function animate(){
ctx.clearRect(0,0,canvas.width, canvas.height)
for(i=0;i<virusArr.length; i++){
    virusArr[i].update(i);
}

requestAnimationFrame(animate);

}
animate();

