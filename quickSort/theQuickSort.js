var deepFont = null;
var balls = [];
var animate;
var counter;
var animTension;
var	table = [];
var waiting = false;
var tsnQueue;
var myQueue = [];
var pivotQueue = [];
var pivotToShow = null;
var HEIGHT = '500px';
var WIDTH = '800px';


function Node(newMdl){
	this.mdl = newMdl;
	this.next = null;
};

function MdlNode (){
	
	this.head = null;
	this.tail = null;
	
	this.enQueue = function (newMdl){
		

		last = new Node(newMdl);
		
		if (this.head == null){
			this.head = last;
			this.tail = last;
		} else {
			console.log('queue');
			this.tail.next = last;
			this.tail = last;
		}
		
	};
	
	this.deQueue = function (){
		
		first = this.head.mdl;
		
		this.head = this.head.next;
		
		if (this.head == null){
			this.tail = null;
		}

		return first;
	};
}

window.onload=init;

function init(){
	
	//tsnQueue = new MdlNode(null);
	
	myQueue = [];
	pivotQueue = [];
	
	deepFont = document.getElementById("rotationAnimation");
	deepFont.style.height = HEIGHT;
	deepFont.style.width = WIDTH;
	deepFont.style.backgroundColor = "#000000";
	
	for (var i = 0; i < 10; i++){
		e = new ElemToSort(Math.floor((Math.random() * 100) + 1));
		e.setBall(createBall(50 + (i * 80), 275, 25, 'grey', e.value))
		table.push(e);
		deepFont.appendChild(table[i].ball);
	}
}

setBall = function(ball){
	this.ball = ball;
}

ElemToSort = function(value){
	this.ball = null;
	this.value = value;
	this.setBall = setBall;
}

Point = function(x, y){
	this.x = x;
	this.y = y;
};

Point = function(modl){
	this.x = modl.x;
	this.y = modl.y;
}

Segment = function(aPoint, bPoint){
	//Extremums
	this.aPoint = new Point(aPoint);
	this.bPoint = new Point(bPoint);
	
	//Set segment size
	this.size = Math.round(
				Math.sqrt(
					Math.pow(this.aPoint.x - this.bPoint.x, 2) 
					+ Math.pow(this.aPoint.y - this.bPoint.y, 2)));
	
	//Initialize center Point
	this.center = new Point(0, 0);
	
	var temp = this.aPoint.x - this.bPoint.x;
	if (temp < 0){
		this.center.x = this.aPoint.x - (temp / 2);
	} else {
		this.center.x = this.aPoint.x + (temp / 2)
	}
	
	temp = this.aPoint.y - this.bPoint.y;
	if (temp < 0){
		this.center.y = this.aPoint.y - (temp / 2);
	} else {
		this.center.y = this.aPoint.y + (temp / 2);
	}
	
	//Set Radius;
	this.radius = Math.round(this.size/2);
};

function createBall(x, y, radius, color, html){
	var ball = document.createElement('div');
	
	ball.style.left = 'float';
	ball.style.height = radius * 2 + 'px';
	ball.style.width = radius * 2 + 'px';
	ball.style.position = 'absolute';
	ball.style.borderRadius = radius + 'px';
	ball.style.backgroundColor = color;
	ball.style.left = (x - radius) + 'px';
	ball.style.top = y + 'px';
	
	var p = document.createElement('p');
	p.innerHTML = html;
	p.style.marginLeft = radius - (p.innerHTML.length * 4) + 'px';
	ball.appendChild(p);
	
	ball.x = x;
	ball.y = y;
	ball.radius = radius;
	
	//ball.rotate = rotate;
	
	return ball;
}

function cloneBall(ball){
	newBall = document.createElement('div');
	newBall.style.heigth = ball.style.heigth;
	newBall.style.width = ball.style.width;
	newBall.style.position = ball.style.position;
	newBall.style.backgroundColor = ball.style.backgroundColor;
	newBall.style.borderRadius = ball.style.borderRadius;
	
	newBall.innerHTML = ball.innerHTML;
	
	newBall.x = ball.x;
	newBall.y = ball.y;
	newBall.radius = ball.style.radius;
	
	return newBall;
}

Tension = function(aModl, bModl){
	this.aModl = aModl;
	this.bModl = bModl;
	this.diam = null;
}

Tension.prototype = {
	setDiameter : function(){
		this.diam = new Segment(this.aModl, this.bModl);
	}
}

Tension.rotate = function(){
	var step = 10;
	
	if (tension.aModl.y < tension.diam.center.y || 
		tension.aModl.y == tension.diam.center.y && tension.aModl.x < tension.diam.center.x)
	{
		console.log('right');
		//left ball x position
		tension.aModl.x = tension.aModl.x + step;
		tension.aModl.style.left = (parseInt(tension.aModl.style.left) + step) + 'px';
	
		//calculate sin between 0 and 1 only
		var cos = Math.abs(tension.diam.center.x - tension.aModl.x);
		var sin = Math.round(Math.sqrt(Math.pow(tension.diam.radius, 2) - Math.pow(cos, 2))) 
	
		/*if (sin > tension.diam.radius){
			sin = sin - tension.diam.radius;
		}*/
	
		//left ball y position --> voir operateur ternaire
		tension.aModl.y = Math.round(tension.diam.center.y - sin);
		/*if (tension.aModl.y > tension.diam.center.y){
			tension.aModl.y = tension.diam.center.y;
		}*/
		tension.aModl.style.top = tension.aModl.y - tension.aModl.radius + 'px';

		//right ball x, y position
		tension.bModl.x = tension.bModl.x - step;
		tension.bModl.style.left = (parseInt(tension.bModl.style.left) - step) + 'px';
		tension.bModl.y = Math.round(tension.diam.center.y + sin);
		/*if (tension.bModl.y < tension.diam.center.y){
			tension.bModl.y = tension.diam.center.y;
		}*/
		tension.bModl.style.top = tension.bModl.y - tension.bModl.radius + 'px';
		
		animate = setTimeout(Tension.rotate, 50);
		
	} else {
		console.log('left');
		//left ball x position
		tension.bModl.x = tension.bModl.x + step;
		tension.bModl.style.left = (parseInt(tension.bModl.style.left) + step) + 'px';
	
		//calculate sin between 0 and 1 only
		var cos = Math.abs(tension.diam.center.x - tension.bModl.x);
		var sin = Math.round(Math.sqrt(Math.pow(tension.diam.radius, 2) - Math.pow(cos, 2))) 
	
		/*if (sin > tension.diam.radius){
			sin = sin - tension.diam.radius;
		}*/
	
		//left ball y position
		tension.bModl.y = Math.round(tension.diam.center.y - sin);
		/*if (tension.bModl.y > tension.diam.center.y){
			tension.bModl.y = tension.diam.center.y;
		}*/
		tension.bModl.style.top = tension.bModl.y - tension.aModl.radius + 'px';
		
		//right ball x, y position
		tension.aModl.x = tension.aModl.x - step;
		tension.aModl.style.left = (parseInt(tension.aModl.style.left) - step) + 'px';
		tension.aModl.y = Math.round(tension.diam.center.y + sin);
		/*if (tension.aModl.y < tension.diam.center.y){
			tension.aModl.y = tension.diam.center.y;
		}*/
		tension.aModl.style.top = tension.aModl.y - tension.bModl.radius + 'px';

		animate = setTimeout(Tension.rotate, 50);
	}
}

Tension.invert = function(){
	var step = 10;
	
	if (animTension.aModl.y < animTension.diam.center.y || 
		animTension.aModl.y == animTension.diam.center.y && animTension.aModl.x < animTension.diam.center.x)
	{
		//console.log('right');
		//left ball x position
		animTension.aModl.x = animTension.aModl.x + step;
		animTension.aModl.style.left = (parseInt(animTension.aModl.style.left) + step) + 'px';
	
		//calculate sin between 0 and 1 only
		var cos = Math.abs(animTension.diam.center.x - animTension.aModl.x);
		var sin = Math.round(Math.sqrt(Math.pow(animTension.diam.radius, 2) - Math.pow(cos, 2))) 
	
		if (sin > animTension.diam.radius){
			sin = sin - animTension.diam.radius;
		}
	
		//left ball y position --> voir operateur ternaire
		animTension.aModl.y = Math.round(animTension.diam.center.y - sin);
		animTension.aModl.style.top = animTension.aModl.y - animTension.aModl.radius + 'px';

		//right ball x, y position
		animTension.bModl.x = animTension.bModl.x - step;
		animTension.bModl.style.left = (parseInt(animTension.bModl.style.left) - step) + 'px';
		animTension.bModl.y = Math.round(animTension.diam.center.y + sin);
		if (animTension.bModl.y < animTension.diam.center.y){
			animTension.bModl.y = animTension.diam.center.y;
		}
		animTension.bModl.style.top = animTension.bModl.y - animTension.bModl.radius + 'px';
		animate = setTimeout(Tension.invert, 75);
	} else {
		animTension.aModl.y = animTension.diam.center.y;
		animTension.aModl.style.top = animTension.diam.center.y + 'px';
		animTension.bModl.y = animTension.diam.center.y;
		animTension.bModl.style.top = animTension.diam.center.y + 'px';
		//console.log("Ends tension animation");
		clearTimeout(animate);
		trigerModlAnimation();
	}
}

function inversion(){
	var step = 10;
	
	if (tension.aModl.y < tension.diam.center.y || 
		tension.aModl.y == tension.diam.center.y && tension.aModl.x < tension.diam.center.x)
	{
		console.log('right');
		//left ball x position
		tension.aModl.x = tension.aModl.x + step;
		tension.aModl.style.left = (parseInt(tension.aModl.style.left) + step) + 'px';
	
		//calculate sin between 0 and 1 only
		var cos = Math.abs(tension.diam.center.x - tension.aModl.x);
		var sin = Math.round(Math.sqrt(Math.pow(tension.diam.radius, 2) - Math.pow(cos, 2))) 
	
		/*if (sin > tension.diam.radius){
			sin = sin - tension.diam.radius;
		}*/
	
		//left ball y position --> voir operateur ternaire
		tension.aModl.y = Math.round(tension.diam.center.y - sin);
		/*if (tension.aModl.y > tension.diam.center.y){
			tension.aModl.y = tension.diam.center.y;
		}*/
		tension.aModl.style.top = tension.aModl.y - tension.aModl.radius + 'px';

		//right ball x, y position
		tension.bModl.x = tension.bModl.x - step;
		tension.bModl.style.left = (parseInt(tension.bModl.style.left) - step) + 'px';
		tension.bModl.y = Math.round(tension.diam.center.y + sin);
		/*if (tension.bModl.y < tension.diam.center.y){
			tension.bModl.y = tension.diam.center.y;
		}*/
		tension.bModl.style.top = tension.bModl.y - tension.bModl.radius + 'px';
		
		animate = setTimeout(rotate, 50);
		
	} else {
		console.log('left');
		//left ball x position
		tension.bModl.x = tension.bModl.x + step;
		tension.bModl.style.left = (parseInt(tension.bModl.style.left) + step) + 'px';
	
		//calculate sin between 0 and 1 only
		var cos = Math.abs(tension.diam.center.x - tension.bModl.x);
		var sin = Math.round(Math.sqrt(Math.pow(tension.diam.radius, 2) - Math.pow(cos, 2))) 
	
		/*if (sin > tension.diam.radius){
			sin = sin - tension.diam.radius;
		}*/
	
		//left ball y position
		tension.bModl.y = Math.round(tension.diam.center.y - sin);
		/*if (tension.bModl.y > tension.diam.center.y){
			tension.bModl.y = tension.diam.center.y;
		}*/
		tension.bModl.style.top = tension.bModl.y - tension.aModl.radius + 'px';
		
		//right ball x, y position
		tension.aModl.x = tension.aModl.x - step;
		tension.aModl.style.left = (parseInt(tension.aModl.style.left) - step) + 'px';
		tension.aModl.y = Math.round(tension.diam.center.y + sin);
		/*if (tension.aModl.y < tension.diam.center.y){
			tension.aModl.y = tension.diam.center.y;
		}*/
		tension.aModl.style.top = tension.aModl.y - tension.bModl.radius + 'px';

		animate = setTimeout(rotate, 50);
	}
}

function rotation(){
	tension = new Tension(balls[0], balls[1]);
	Tension.rotate();
}

function invert(toSort, edx1, edx2, pivot){
	
	
	//Console.log("inversion");
	//console.log("creates a tension between two Models");
	var tension = null;
	
	if (edx1 < edx2){
		tension = new Tension(toSort[edx1].ball, toSort[edx2].ball);
	} else {
		tension = new Tension(toSort[edx2].ball, toSort[edx1].ball);
	}
	
	//console.log("push the tension in the global queue");
	//tsnQueue.enQueue(tension);
	myQueue.push(tension);
	pivotQueue.push(toSort[pivot].ball);
	
	//console.log("inverts the two elements of the array");
	temp = toSort[edx1];
	toSort[edx1] = toSort[edx2];
	toSort[edx2] = temp;
	
}

function partition(toSort, first, last){
	
	//console.log('pivot ' + pivot);
	
	var pivot = toSort[last].value;
	
	var j = first;
	
	for (var i = first; i < last; i++){
		if (toSort[i].value <= pivot){
			if (i != j){
				invert(toSort, i, j, last);
			}
			j += 1;
		}
	}
	
	invert(toSort, j, last, last);
	
	return j;
}

function trigerModlAnimation(){
	
	//clearTimeout(animate);
	//animTension = tsnQueue.deQueue();
	if (myQueue.length){
		
		for (var i = 0; i < table.length; i++){
			table[i].ball.style.backgroundColor = 'grey';
		}
		
		pivot = pivotQueue.shift();
		pivot.style.backgroundColor = 'red';
		
		//Clone and draw the pivot ball in the right corner
		if (pivotToShow != null && pivotToShow.innerHMTL != pivot.innerHTML){
			pivotToShow = cloneBall(pivot);
		} else {
			pivotToShow = cloneBall(pivot);
		}
		
		pivotToShow.x = parseInt(WIDTH) - 50;
		pivotToShow.y = parseInt(HEIGHT) - 50;
		pivotToShow.style.left = pivotToShow.x + 'px';
		pivotToShow.style.top = pivotToShow.y + 'px';
		deepFont.appendChild(pivotToShow);
		
		animTension = myQueue.shift();
		animTension.setDiameter();
		console.log('dequeued');
		Tension.invert();
	} else {
		for (var i = 0; i < table.length; i++){
			table[i].ball.style.backgroundColor = 'grey';
		}
	}
	
}

function sort(){
	
	for (var i = 0; i < table.length; i++){
		console.log("unsorted " + table[i].value);
	}
	
	quickSort(table, 0, 9);
	
	console.log("");
	
	for (var i = 0; i < table.length; i++){
		console.log("sorted " + table[i].value);
	}
	
	trigerModlAnimation();
}

function quickSort(toSort, first, last){
	if (first < last){
		var pivot = partition(toSort, first, last);
		quickSort(toSort, first, pivot - 1);
		quickSort(toSort, pivot + 1, last);
	}
	
}