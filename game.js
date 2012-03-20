var canvas; 
var ctx; 
var members = [];
var blib;
var bloob;
var ballIdent = 0;
var colors = ['black', 'blue', 'red', 'green', 'brown', 'darkblue', 'gray', 'orange'];
function Vector(x, y) {
    this.x = x;
    this.y = y;
    this.subtract = function(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
    this.add = function(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    this.multiply = function(val) {
        return new Vector(this.x * val, this.y * val);
    }
    this.dot = function(v
    this.reverseX = function() {
        this.x *= -1;
    }
    this.reverseY = function() {
        this.y *= -1;
    }
    this.reverse = function() {
        this.reverseX();
        this.reverseY();
    }
    this.length = function() {
        Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}

function Blob(x,y){
    this.id = ballIdent++;
    this.size = 16;
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.pos = new Vector(x, y);
    this.v = new Vector(4, 4);

    this.move = function(){
    
        for(var i = 0;i<members.length;i++){
            if (members[i].id != this.id){
                if (collide(this,members[i])) {
                    this.v.reverse();
                    this.pos.add(this.v);
                    members[i].v.reverse();
                    members[i].pos.add(members[i].v);
                }
            }
        }
        
        this.pos.x += this.v.x;
        xRad = this.pos.x + this.size;
        if (xRad>=canvas.width || this.pos.x - this.size<=0){
            this.v.reverseX();
            this.pos.x += this.v.x;
        }
        
        this.pos.y += this.v.y;
        yRad = this.pos.y + this.size;
        if (yRad>=canvas.height || this.pos.y-this.size<=0){
            this.v.reverseY();
            this.pos.y += this.v.y;
        }

    }
    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI*2, true); 
        ctx.fillStyle = this.color;
        ctx.closePath();
        ctx.fill();
    }
}
function collide(blob1, blob2){
    //return (blob2.x-blob1.x)^2 + (blob1.y-blob2.y)^2 <= (blob1.size+blob2.size)^2;
    distance = Math.sqrt(Math.pow(blob2.pos.x - blob1.pos.x, 2) + Math.pow(blob2.pos.y - blob1.pos.y, 2));
    return distance < blob1.size + blob2.size;
}

function resolveCollision(b1, b2) {

    delta = b1.pos.subtract(b2.pos)
    d = delta.length();
    mtd = delta.multiply(((b1.size + b2.size) - d)/d);
    
    im1 = 1/b1.size;
    im2 = 1/b2.size;
    
    b1.pos = b1.pos.add(mtd.multiply(im1 / (im1 + im2)));
    b2.pos = b2.pos.subtract(mtd.multiply(im2 / (im1 + im2)));
    
    v = b1.v.subtract(b2.v);
    vn = v.dot//OMG WTF IS A DOT
}

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
})();
function animloop(){
      requestAnimFrame( animloop );
      render();
};

function init(){
    canvas = document.getElementById("drawing");
    ctx = canvas.getContext('2d');
    i = 5;
    members.push(new Blob(Math.random()*canvas.width*.95 + 16, Math.random()*canvas.height*.95 + 16));
    for (i; i > 0; i--)
         members.push(new Blob(Math.random()*canvas.width*.95 + 16, Math.random()*canvas.height*.95 + 16));     

    animloop();
}
function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i = 0;i<members.length;i++){
        //console.log(i);
        members[i].move();
        members[i].draw();
    }

}
