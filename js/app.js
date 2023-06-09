// https://www.javascripttutorial.net/web-apis/javascript-draw-line/

/* Point assignment must follow this order 

pt1        pt3 
 -----------
|           |
|           |
|           |
 -----------
pt2        pt4  

*/

// define lines for outer edges of the rectangle here
// later will get this line from 4 mmarkers
Point = function (x, y) {
  this.x = x;
  this.y = y;
};
var POINT1 = new Point(0, 50);
var POINT2 = new Point(0, 500);
var POINT3 = new Point(400, 50);
var POINT4 = new Point(400, 400);

var NUMBER_OF_HORIZONTAL_GRID = 8;
var NUMBER_OF_VERTICAL_GRID = 8;

function get_points_between_2_points(pointA, pointB, number_of_points) {
  // pointA and pointB are Point() object with .x and .y value
  var SIDE = new Array();

  for (var i = 1; i < number_of_points + 1; i++) {
    SIDE.push(
      new Point(
        ((pointB.x - pointA.x) / (number_of_points + 1)) * i + pointA.x,
        ((pointB.y - pointA.y) / (number_of_points + 1)) * i + pointA.y
      )
    );
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

// calculate intersections of 2 lines defined by end points
function get_intersection(point1, point2, point3, point4) {
  // point1 and point2 are Point() object with .x and .y value which defines end points of Line1
  // point3 and point4 are Point() object with .x and .y value which defines end points of Line2

  // using determinant calculation https://en.wikipedia.org/wiki/Line–line_intersection
  // if can fine a more efficient way to compute det in JS, it could improve this function
  const deno =
    (point1.x - point2.x) * (point3.y - point4.y) -
    (point1.y - point2.y) * (point3.x - point4.x);

  const Px =
    ((point1.x * point2.y - point1.y * point2.x) * (point3.x - point4.x) -
      (point1.x - point2.x) * (point3.x * point4.y - point3.y * point4.x)) /
    deno;

  const Py =
    ((point1.x * point2.y - point1.y * point2.x) * (point3.y - point4.y) -
      (point1.y - point2.y) * (point3.x * point4.y - point3.y * point4.x)) /
    deno;

  var intersection = new Point(Px, Py);
  return intersection;
}

// creating a function to draw points on the plane
function drawPoints(point, ctx, color, textId, textColor) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(point.x, point.y, 10, 10, 2 * Math.PI);
  ctx.fill();

  ctx.font = "Italic 16px Arial";
  ctx.fillStyle = textColor;
  ctx.fillText(textId, point.x, point.y);
}

// calculate intersections of 2 lines defined by end points 
function get_intersection(point1, point2, point3, point4) {
    // point1 and point2 are Point() object with .x and .y value which defines end points of Line1
    // point3 and point4 are Point() object with .x and .y value which defines end points of Line2

    // using determinant calculation https://en.wikipedia.org/wiki/Line–line_intersection
    // if can fine a more efficient way to compute det in JS, it could improve this function
    const deno = ((point1.x-point2.x)*(point3.y-point4.y)-(point1.y-point2.y)*(point3.x-point4.x));

    const Px = ((point1.x*point2.y-point1.y*point2.x)*(point3.x-point4.x)-(point1.x-point2.x)*(point3.x*point4.y-point3.y*point4.x))/deno;

    const Py = ((point1.x*point2.y-point1.y*point2.x)*(point3.y-point4.y)-(point1.y-point2.y)*(point3.x*point4.y-point3.y*point4.x))/deno;

    var intersection = new Point(Px, Py);
    return intersection;

}

// console.log(SIDE12[0])
// console.log(SIDE34[0])
// console.log(SIDE24[0])
// console.log(SIDE13[0])

// console.log(get_intersection(SIDE12[0], SIDE34[0], SIDE24[0], SIDE13[0]));


function draw() {
  const canvas = document.getElementById("rectangleCanvas");

  if (!canvas.getContext) {
    return;
  }
  const ctx = canvas.getContext("2d");

  // set line stroke and line width
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;

  // draw a rectangle based on 4 points
  // note that 4 points should already be ordered
  draw_line(POINT1, POINT2, ctx);
  draw_line(POINT2, POINT4, ctx);
  draw_line(POINT4, POINT3, ctx);
  draw_line(POINT3, POINT1, ctx);

//   // draw horizontal grid
//   for (var i = 0; i < NUMBER_OF_HORIZONTAL_GRID; i++) {
//     draw_line(SIDE12[i], SIDE34[i], ctx);
//   }

//   // draw vertical grid
//   for (var i = 0; i < NUMBER_OF_VERTICAL_GRID; i++) {
//     draw_line(SIDE13[i], SIDE24[i], ctx);
//   }

  // getting all internal intersections
  /* Intersections will be generated as 1D array and by row starting from top left as index 0th as shown.

        pt1        pt3 
         ------------
        | 0|  1| 2...|
         ------------
        | x|x+1|  ...|
         ------------
        |  |   |  ...|
         ------------
        pt2        pt4  

        */
  var INTERSECTIONS = new Array();
  for (var i = 0; i < NUMBER_OF_HORIZONTAL_GRID; i++) {
    for (var j = 0; j < NUMBER_OF_VERTICAL_GRID; j++) {
      INTERSECTIONS.push(
        get_intersection(SIDE12[i], SIDE34[i], SIDE24[j], SIDE13[j])
      );
    }
  }

  // array that stores all the points
  var allPoints = new Array();
  // pushing corners
  allPoints.push(POINT1, POINT2, POINT3, POINT4);
  // pushing sides
  let allSides = [SIDE12, SIDE13, SIDE24, SIDE34];
  for (var i = 0; i < allSides.length; i++) {
    for (var j = 0; j < allSides[i].length; j++) {
      allPoints.push(allSides[i][j]);
    }
  }
  // pushing intersections
  for (var i = 0; i < INTERSECTIONS.length; i++) {
    allPoints.push(INTERSECTIONS[i]);
  }

  // sorting the allPoints array
  allPoints.sort(function(a,b) { return a.x-b.x })
  allPoints.sort(function(a,b) { return a.y-b.y })

  console.log(allPoints);
  // drawing points
  for (var i = 0; i < allPoints.length; i++) {
    drawPoints(allPoints[i], ctx, "blue", i, "green");
  }
  // console.log(allPoints);

  // highlighting a particular point
  point = 17
  drawPoints(allPoints[point], ctx, "red", point, "red");
}

draw();
