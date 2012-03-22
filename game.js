var canvas; 
var ctx; 
var members = [];
var blib;
var bloob;
var ballIdent = 0;
var RESTI = .85;
var gravity = .1;
var colors = ['black', 'blue', 'red', 'green', 'brown', 'darkblue', 'gray', 'orange'];
var hash;

var HashMap = function(size) {
	this.size = size;
	this.grid = [];
	this.keys = [];
	this.key = function(obj) {
		vector = obj.pos;
		return '' + Math.floor(Math.floor(vector.x/size) * size) + ' ' +
			    Math.floor(Math.floor(vector.y/size) * size);
	}
	
	this.insert = function(obj) {
		key = this.key(obj);
		if (!this.keys[key])
			this.keys.push(key);
		if (!this.grid[key])
			this.grid[key] = [];
		this.grid[key].push(obj);
		//console.log(this.grid[key].length);
		console.log(hash.size());
	}
	this.remove = function(obj) {
		key = this.key(obj);
		cell = this.grid[key];
		index = cell.indexOf(obj);
		if (index != -1)
			cell.splice(index, 1);
	}
	this.query = function(obj) {
		return this.grid[this.key(obj)];
	}
	this.size = function() {
		var size = 0;
		for (var key in this.grid)
			if (this.grid.hasOwnProperty(key)) size++;
		return size;
	}
}

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
    this.dot = function(v) {
		return (this.x * v.x) + (this.y + v.y);
	}
	this.normalize = function() {
		l = this.length();
		if (l != 0) {
			nX = this.x / l;
			nY = this.y / l;//7654941776
		} else {
			nX = 0;
			nY = 0;
		}

		return new Vector(nX, nY);
	}
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
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
	this.distance = function(v) {
		return Math.sqrt((v.x - this.x) * (v.x - this.x) + (v.y - this.y) * (v.y - this.y));
	}
}

function Blob(x,y){
    this.id = ballIdent++;
    this.size = 8;
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.pos = new Vector(x, y);
    this.v = new Vector(0.0,0.0);
    this.move = function(){

        /*for(var i = 0;i<members.length;i++){
            if (members[i].id != this.id){
                if (collide(this,members[i])) {
                    //this.v.reverse();
                    //this.pos.add(this.v);
                    //members[i].v.reverse();
                    //members[i].pos.add(members[i].v);
					resolveCollision(this, members[i]);
                }
            }
        }*/
		
		//cell = hash.query(this);
		//for (var blob in cell)
		//	if (collide(blob, this))
		//		resolveCollision(blob, this);

		/*c = hash.getClosest(this);
		for (i = 0; i < c.length; i++)
			if (this.id != c[i].id)
				if (collide(this, c[i]))
					resolveCollision(this, c[i]);*/
		//console.log(hash.grid.length);
		/*for (i = 0; i < hash.grid.length; i++) {
			cell = grid[i];
			for (z = 0; z < cell.length; z++) {
				if (collide(this, cell[i]))
					resolveCollision(this, cell[i]);
			} 
		}*/
				
		this.v.y += gravity;
			
		this.pos.x += this.v.x;
		this.pos.y += this.v.y;
        // Check for collision with walls
		if (this.pos.x - this.size < 0)
		{
			this.pos.x = this.size;		// Place ball against edge
			this.v.x = -(this.v.x * RESTI);// Reverse direction and account for friction
		}
		else if (this.pos.x + this.size > canvas.width) // Right Wall
		{
			this.pos.x = canvas.width - this.size;		// Place ball against edge
			this.v.x = -(this.v.x * RESTI);// Reverse direction and account for friction
		}

		if (this.pos.y - this.size < 0)				// Top Wall
		{
			this.pos.y = this.size;		// Place ball against edge
			this.v.y = -(this.v.y * RESTI);// Reverse direction and account for friction∂∂∂
		}
		else if (this.pos.y + this.size > canvas.height) // Bottom Wall
		{
			this.pos.y = canvas.height - this.size;		// Place ball against edge
			prev = this.v;
			this.v.y = -(this.v.y * RESTI);// Reverse direction and account for friction
			//if (this.v.length() > .01)
				//console.log(prev.length() - this.v.length());
		}
		

    }
    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI*2, true); 
        //ctx.fillStyle = this.color;
		MAX = 20;
		red = Math.floor(255*Math.abs(this.v.y) / MAX);
		//console.log(red);
		green = 255 - red;
		ctx.fillStyle = 'rgb(' + red + "," + green + ',0)';
        ctx.closePath();
        ctx.fill();
    }
}
function collide(b1, b2){
    distance = Math.sqrt(Math.pow(b2.pos.x - b1.pos.x, 2) + Math.pow(b2.pos.y - b1.pos.y, 2));
    return distance < b1.size + b2.size;
}

function resolveCollision(b1, b2) {
	
	// get the mtd
	delta = (b1.pos.subtract(b2.pos));
	r = b1.size + b2.size;
	dist2 = delta.dot(delta);

	if (dist2 > r*r) return; // they aren't colliding


	d = delta.length();

	if (d != 0.0) {
		mtd = delta.multiply(((b1.size + b2.size)-d)/d); // minimum translation distance to push balls apart after intersecting
	}
	else { // Special case. Balls are exactly on top of eachother.  Don't want to divide by zero.
		d = b1.size + b2.size - 1.0;
		delta = new Vector(b1.size + b2.size, 0.0);
		mtd = delta.multiply(((b1.size + b2.size)-d)/d);
	}
	// resolve intersection
	im1 = 1 / (b1.size); // inverse mass quantities
	im2 = 1 / (b2.size);

	// push-pull them apart
	b1.pos = b1.pos.add(mtd.multiply(im1 / (im1 + im2)));
	b2.pos = b2.pos.subtract(mtd.multiply(im2 / (im1 + im2)));
	
	// impact speed
	v = (b1.v.subtract(b2.v));
	mtd = mtd.normalize();
	vn = v.dot(mtd);
	// sphere intersecting but moving away from each other already
	if (vn > 0.0) return;

	// collision impulse
	i = -(1.0 + RESTI * vn) / (im1 + im2);
	impulse = mtd.multiply(i);
	// change in momentum
	//console.log(impulse.length());
	b1.v = b1.v.add(impulse.multiply(im1));
	b2.v = b2.v.subtract(impulse.multiply(im2));
}
function animloop(){
      requestAnimFrame( animloop );
      render();
};
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

function init(){
	
    canvas = document.getElementById("drawing");
    ctx = canvas.getContext('2d');

	hash = new HashMap(canvas.width / 9);
	
	
    i = 40;
    for (i; i > 0; i--) {
		blob = new Blob(Math.random()*canvas.width*.95 + 16, Math.random()*canvas.height*.95 + 16);
		hash.insert(blob);
		//console.log(hash.size());
        members.push(blob);
	}		 

	
    animloop();
}
function render(){
	
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i = 0;i<members.length;i++){
        members[i].move();
        members[i].draw();
		
    }

}
