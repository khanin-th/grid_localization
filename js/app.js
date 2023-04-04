// https://www.javascripttutorial.net/web-apis/javascript-draw-line/

// define lines for outer edges of the rectangle here 
// later will get this line from 4 mmarkers 
Point = function(x, y) {
    this.x = x;
    this.y = y;
  } 
var POINT1 = new Point(0, 0); 
var POINT2 = new Point(0, 400);
var POINT3 = new Point(300, 0); 
var POINT4 = new Point(400, 400);

var NUMBER_OF_HORIZONTAL_GRID = 3;
var NUMBER_OF_VERTICAL_GRID = 3;


function get_points_between_2_points(pointA, pointB, number_of_points) {
    // pointA and pointB are Point() object with .x and .y value
    var SIDE = new Array()

    for (var i = 1; i < number_of_points+1; i++) {
        SIDE.push(new Point(((pointB.x - pointA.x) / (number_of_points+1)) * i + pointA.x, ((pointB.y - pointA.y) / (number_of_points+1)) * i + pointA.y));
    }

    return SIDE;             
  }

// split vertical edges into equally spaced points to draw horizontal grids 
SIDE12 = get_points_between_2_points(POINT1, POINT2, NUMBER_OF_HORIZONTAL_GRID);
SIDE34 = get_points_between_2_points(POINT3, POINT4, NUMBER_OF_HORIZONTAL_GRID);

// split horizontal edges into equally spaced points to draw vertical grids 
SIDE24 = get_points_between_2_points(POINT2, POINT4, NUMBER_OF_VERTICAL_GRID);
SIDE13 = get_points_between_2_points(POINT1, POINT3, NUMBER_OF_VERTICAL_GRID);


function draw_line(pointA, pointB, ctx) {
    // pointA and pointB are Point() object with .x and .y value
    // ctx is ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.stroke();

}

function draw() {
    const canvas = document.querySelector('#canvas');

    if (!canvas.getContext) {
        return;
    }
    const ctx = canvas.getContext('2d');

    // set line stroke and line width
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;

    // draw a rectangle based on 4 points 
    // note that 4 points should already be ordered
    draw_line(POINT1, POINT2, ctx);
    draw_line(POINT2, POINT4, ctx);
    draw_line(POINT4, POINT3, ctx);
    draw_line(POINT3, POINT1, ctx);


    // draw horizontal grid 
    for (var i = 0; i < NUMBER_OF_HORIZONTAL_GRID; i++) {
        draw_line(SIDE12[i], SIDE34[i], ctx)
    }

    // draw vertical grid 
    for (var i = 0; i < NUMBER_OF_VERTICAL_GRID; i++) {
        draw_line(SIDE13[i], SIDE24[i], ctx)
    }

}

draw();