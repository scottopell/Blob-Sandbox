var canvas; 
var ctx; 
var members = [];

var RESTI = .1;
var gravity = 0;
var colors = ['black', 'blue', 'red', 'green', 'brown', 'darkblue', 'gray', 'orange'];
var hash;
var velocityLine;
var gravityPosition = 0;
$(function() {
	$( "#gravity-slider" ).slider({
		value:0,
		min: -.5,
		max: .5,
		step: .01,
		slide: function( event, ui ) {
			$( "#gravity-amount" ).val( ui.value );
			changeGravity(ui.value);
		}
	
	});
	

	$("#gravity-pos-slider").slider({
		value:0,
		min: -.5,
		max: .5,
		step: .01,
		slide: function (event,ui){
			$( "#gravity-position").val(ui.value);
			gravPos(ui.value);
		}
	});
	
	$( "#gravity-amount" ).val($( "#gravity-slider" ).slider( "value" ) );
	changeGravity($( "#gravity-slider" ).slider( "value" ));
	$( "#gravity-position" ).val($( "#gravity-pos-slider" ).slider( "value" ) );
	changeGravity($( "#gravity-pos-slider" ).slider( "value" ));
});


function gravPos(x){

	gravityPosition = x;

}

function changeGravity(g) {
	gravity = g;
}

var HashMap = function(width, m) {
	this.width = width;
	this.m = m;
	this.size = this.width / this.m;
	this.grid = [];
	for (var i = 0; i < this.m * this.m; i++)
		this.grid.push([]);
	
	this.key = function(o) {
		x = (o.pos.x - o.pos.x % this.size) / this.size;
		y = (o.pos.y - o.pos.x % this.size) / this.size;
		return y * m + x;
	}
	
	this.insert = function(obj) {
		key = this.key(obj);
		if (this.grid[key] == undefined)
			this.grid[key] = [];
		this.grid[key].push(obj.id);
	}
	this.recalc = function(obj) {
		key = this.key(obj);
		cell = this.grid[key];
		index = cell.indexOf(obj.id);
		index = cell.indexOf(obj.id);
		cell.splice(index, 1);
		this.insert(obj);
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
	this.sumSize = function() {
		var size = 0;
		for (var key in this.grid)
			if (this.grid.hasOwnProperty(key)) size += this.grid[key].length;
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

function Blob(x,y, id){
    this.id = id;
    this.size = 2;
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.pos = new Vector(x, y);
    this.v = new Vector(0,0);
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
		
		cell = hash.query(this);
		if (cell != undefined) {
			for (var id in cell) {
				if (this.id != id)
					if (collide(members[id], this))
						resolveCollision(this, members[id]);
			}		
		}

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
		//this.v.y += gravity;
		this.v.y += gravity;
		this.v.x += gravityPosition;
		//this.v.add(gravityPosition);
		//console.log(this.v);
			
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
		
		recalc(this);
    }
    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI*2, true); 
        //ctx.fillStyle = this.color;
		MAX = 10;
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
	//console.log(d);
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
	//console.log(mtd.length());
	// push-pull them apart
	
	
	b1.pos = b1.pos.add(mtd.multiply(im1 / (im1 + im2)));
	b2.pos = b2.pos.subtract(mtd.multiply(im2 / (im1 + im2)));
	
	// impact speed
	v = (b1.v.subtract(b2.v));
	mtd = mtd.normalize();
	vn = v.dot(mtd);
	// sphere intersecting but moving away from each other already
	if (vn > 0) return;

	// collision impulse
	i = -((1.0 + RESTI) * vn) / (im1 + im2);
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

function recalc(blob) {
	hash.recalc(blob);
}
//37 - left
//38 - up
//39 - right
//40 - down
c = 5;
function keydown(e) {
	function impulse(vec) {
	for (var i = 0; i < members.length; i++) {
		members[i].v = members[i].v.add(vec);
	}
}
	if (e.keyCode >= 37 && e.keyCode <= 40)
		e.preventDefault();
	
	if (e.keyCode == 37) { 
	  impulse(new Vector(-c, 0));
	}
	if (e.keyCode == 38) { 
	  impulse(new Vector(0, -c));
	}
	if (e.keyCode == 39) {
	  impulse(new Vector(c, 0));
	}
	if (e.keyCode == 40) { 
	  impulse(new Vector(0, c));
	}
}



function init(){
	smoothie = new SmoothieChart();
	smoothie.streamTo(document.getElementById("graph"), 1000 /*delay*/); 
	velocityLine = new TimeSeries();
	smoothie.addTimeSeries(velocityLine);

	
	if (document.addEventListener){
	//document.addEventListener("mouseup",mouseup,false);
	document.addEventListener("keydown",keydown,false);
	}
	else if (document.attachEvent){
	//document.attachEvent("onmouseup",mouseup);
	document.attachEvent("onkeydown", keydown);
	}
	else{
	//document.onmouseup = mouseup;
	document.onkeydown= keydown;

	}
	
    canvas = document.getElementById("drawing");
    ctx = canvas.getContext('2d');

	hash = new HashMap(canvas.width, 100);
	
	gravityPosition = 0; //new Vector(.1,gravity)

	
    i = 500;
    for (i; i > 0; i--) {
		blob = new Blob(Math.random()*canvas.width*.95 + 16, Math.random()*canvas.height*.95 + 16, members.length);
		hash.insert(blob);
        members.push(blob);
	}		 

	
    animloop();
}
function render(){
	
    ctx.clearRect(0,0,canvas.width,canvas.height);
	var sum = 0;
    for(var i = 0;i<members.length;i++){
        members[i].move();
        members[i].draw();
		sum += members[i].v.length();
    }
	sum /= members.length;
	velocityLine.append(new Date().getTime(), sum);

}
