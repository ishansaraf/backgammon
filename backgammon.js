var canvas;
var gl;
var aspectRatio = 1.0;
const SPACE_WIDTH = 50;
const CIRCLE_POINTS = 20;
const DIE_VAL_RADIUS = 0.01;
var die1Val = 0;
var die2Val = 0;

var num1 = 9.8;
var num2 = num1 / 1.75;
var t=30;
var start=false;
var ready=false;
var index = [

  15, 12, 11,
  8, 4, 10,
  14, 8, 7,
  13, 3, 10,
  13, 14, 3,
  8, 14, 9,
  9, 10, 8,
  11, 16, 15,
  4, 10, 3,
  3, 14, 7,

  1, 6, 2,
  1, 6, 5,

  1, 4, 3,
  1, 3, 2,

  11, 10, 18,
  19, 11, 18,

  13, 20, 12,
  20, 21, 13,

  8, 4, 1,
  1, 5, 8,

  18, 10, 9,
  9, 17, 18,

  7, 8, 5,
  7, 5, 6,

  24, 9, 16,
  24, 17, 9,

  15, 14, 22,
  22, 23, 15,

  2, 3, 7,
  7, 6, 2,

  14, 13, 21,
  21, 22, 14,

  15, 23, 12,
  23, 20, 12,

  16, 11, 19,
  19, 24, 16,

  47, 48, 49,
  43, 44, 45,
  39, 40, 41,
  33, 34, 35,
  29, 30, 31,
  25, 26, 27,
  54, 56, 55,
  58, 60, 59,
  62, 64, 63,
  68, 70, 69,
  72, 74, 73,
  76, 78, 77,

  49, 50, 51,
  45, 46, 47,
  41, 42, 43,
  35, 36, 37,
  31, 32, 33,
  27, 28, 29,
  52, 54, 53,
  56, 58, 57,
  60, 62, 61,
  66, 68, 67,
  70, 72, 71,
  74, 76, 75,
  81, 80, 79,
  80, 79, 82,

  83, 84, 85,
  84, 83, 86,

  87,88,89,
  87,88,90,

  91,92,93,
  93,94,92


]
var verticesTest = [
  vec4(0, 0, 0, 1),//0
  vec4(2, 0, 0, 1),//1
  vec4(30, 0, 0, 1),//2
  vec4(32, 3, 0, 1),//3
  vec4(0, 3, 0, 1),//4
  vec4(2, 0, -26, 1),//5
  vec4(30, 0, -26, 1),//6
  vec4(32, 3, -26, 1),//7
  vec4(0, 3, -26, 1),//8
  vec4(3, 3, -25, 1),//9
  vec4(3, 3, -1, 1),//10
  vec4(15, 3, -1, 1),//11
  vec4(17, 3, -1, 1),//12
  vec4(29, 3, -1, 1),//13
  vec4(29, 3, -25, 1),//14
  vec4(17, 3, -25, 1),//15
  vec4(15, 3, -25, 1),//16
  vec4(1, 0, -25, 1),//17
  vec4(1, 0, -1, 1),//18
  vec4(15, 0, -1, 1),//19
  vec4(17, 0, -1, 1),//20
  vec4(31, 0, -1, 1),//21
  vec4(31, 0, -25, 1),//22
  vec4(17, 0, -25, 1),//23
  vec4(15, 0, -25, 1),//24
];
var colors = [
  vec4(0.5976, 0.2968, 0, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0, 0, 0, 1),
  vec4(1, 1, 1, 1),
  vec4(0.76, 0.60, 0.42, 1),
  vec4(0.20, 0.20, 0.18, 1),
  vec4(0.52, 0.08, 0.08, 1),
];
var  mat1 = mat4(1.0, 0.0, 0.0, -16,
    0.0, 1.0, 0.0, -1.5,
    0.0, 0.0, 1.0, -13,
    0.0, 0.0, 0.0, 1.0);

var mat2 = mat4(1.0, 0.0, 0.0, 5,
    0.0, 1.0, 0.0, -18,
    0.0, 0.0, 1.0, 0,
    0.0, 0.0, 0.0, 1.0);

// 0->white
// 1->black
var columntl1=[0,0,0,0,0];
var columntl2=[];
var columntl3=[];
var columntl4=[];
var columntl5=[1,1,1];
var columntl6=[];

var columntr1=[1,1,1,1,1];
var columntr2=[];
var columntr3=[];
var columntr4=[];
var columntr5=[];
var columntr6=[0,0];

var columnbl1=[1,1,1,1,1];
var columnbl2=[];
var columnbl3=[];
var columnbl4=[];
var columnbl5=[0,0,0];
var columnbl6=[];

var columnbr1=[0,0,0,0,0];
var columnbr2=[];
var columnbr3=[];
var columnbr4=[];
var columnbr5=[];
var columnbr6=[1,1];

var columns = [columntl1,columntl2,columntl3,columntl4,columntl5,columntl6,
  columntr1,columntr2,columntr3,columntr4,columntr5,columntr6,
  columnbl1,columnbl2,columnbl3,columnbl4,columnbl5,columnbl6,
  columnbr1,columnbr2,columnbr3,columnbr4,columnbr5,columnbr6];


window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  //
  //  Configure WebGL
  //
  gl.viewport(0, 0, canvas.width, canvas.height);
  aspectRatio = canvas.width / canvas.height;
  gl.clearColor(1, 1, 1, 1.0);
  gl.enable(gl.DEPTH_TEST);
  createPoints();

  document.getElementById("play").onclick = function () {
    if(!start) {
      start = true;
      document.getElementById("play").innerHTML = "Stop The Game"
    } else {
      document.getElementById("play").innerHTML = "Start The Game"
      start = false;
    }
  }

  document.getElementById("roll").onclick = function() {
    die1Val = rollDie();
    document.getElementById("die1").innerHTML = die1Val;
    die2Val = rollDie();
    document.getElementById("die2").innerHTML = die2Val;
  }

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  colorLoc = gl.getUniformLocation(program, "color");
  modelViewLoc = gl.getUniformLocation(program, "modelView");
  projectionLoc = gl.getUniformLocation(program, "projection");

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesTest), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(index), gl.STATIC_DRAW);
  
  StartRender();
};

function StartRender() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if(start && t!=75){
    t=t+0.5;
    ready=false;
  }else if (!start && t!=30){
    t=t-0.5;
    ready=false;
  }else if(t==75){
    ready=true;
  }

  ThreeDCalculation();

  if(ready){
    colors = [
      vec4(0.5976, 0.2968, 0, 1.0),
      vec4(0.5, 0.5, 0.5, 1.0),
      vec4(0, 0, 0, 1),
      vec4(1, 1, 1, 1),
      vec4(0.76, 0.60, 0.42, 1),
      vec4(0.20, 0.20, 0.18, 1),
      vec4(0.52, 0.08, 0.08, 1),
    ];
  }else{
    colors = [
      vec4(0.3, 0.3, 0.3, 1.0),
      vec4(0.5, 0.5, 0.5, 1.0),
      vec4(0, 0, 0, 1),
      vec4(1, 1, 1, 1),
      vec4(0.7, 0.7, 0.7, 1),
      vec4(0.20, 0.20, 0.18, 1),
      vec4(0.52, 0.08, 0.08, 1)
    ];
  }
  draw();
  requestAnimFrame(StartRender);
};

function ThreeDCalculation(){
  mat = mat4(1.0, 0.0, 0.0, 0.0,
      0.0, Math.cos(radians(t)), -Math.sin(radians(t)), 0.0,
      0.0, Math.sin(radians(t)), Math.cos(radians(t)), 0.0,
      0.0, 0.0, 0.0, 1.0);
  angle = lookAt(vec3(num2 , num2, 3.5 * num1), vec3(num2,
      num2, 0), vec3(0.0, 1.0, 0.0));
  projection = perspective(45.0, aspectRatio, 1, 10 * num1);
  modelView = mult(angle, mult(mat2, mult(mat, mat1)));
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
  gl.uniformMatrix4fv(projectionLoc, false, flatten(projection));
}

function draw() {

    //Middle Black Nodes
    gl.uniform4fv(colorLoc, colors[5]);
    for (var i = 62; i < 66; i++) {
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
    }

    //middle white space
    gl.uniform4fv(colorLoc, colors[3]);
    for (var i = 60; i < 62; i++) {
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
    }
    gl.uniform4fv(colorLoc, colors[3]);
    for (var i = 66; i < 68; i++) {
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
    }

    //inner wall and outer wall
    gl.uniform4fv(colorLoc, colors[1]);
    for (var i = 12; i < 36; i++) {
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
    }

    //Top
    gl.uniform4fv(colorLoc, colors[4]);
    for (var i = 0; i < 10; i++) {
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
    }

    //Base
    gl.uniform4fv(colorLoc, colors[0]);
    for (var i = 10; i < 12; i++) {
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
    }

    //Red Triangle Column
    gl.uniform4fv(colorLoc, colors[6]);
    for (var i = 36; i < 48; i++) {
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
    }

    //White Triangle Column
    gl.uniform4fv(colorLoc, colors[3]);
    for (var i = 48; i < 60; i++) {
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
    }

    //Gray Chess
    gl.uniform4fv(colorLoc, colors[4]);
    for (var i = 68; i < 98; i++) {
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
    }

    //Black Chess
    gl.uniform4fv(colorLoc, colors[5]);
    for (var i = 98; i < 128; i++) {
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
    }
}

function createPoints() {

  //Create Triangle Column points
  for (i = 3; i < 60; i++) {
    if ((i % 2 != 0) && (i < 30)) {
      verticesTest.push(vec4(i, 0.01, -1, 1));
    } else if ((i % 2 != 1) && (i < 30)) {
      verticesTest.push(vec4(i, 0.01, -9, 1));
    } else if ((i % 2 != 0) && (33 <= i)) {
      verticesTest.push(vec4(i - 30, 0.01, -25, 1));
    } else if (33 <= i) {
      verticesTest.push(vec4(i - 30, 0.01, -17, 1));
    }

  }


  //Create middle white space and black nodes points.
  verticesTest.push(vec4(16.125, 3.01, -26, 1));//79
  verticesTest.push(vec4(15.875, 3.01, 0, 1));//80
  verticesTest.push(vec4(16.125, 3.01, 0, 1));//81
  verticesTest.push(vec4(15.875, 3.01, -26, 1));//82

  verticesTest.push(vec4(16.25, 3.02, -4, 1));//83
  verticesTest.push(vec4(15.75, 3.02, -3, 1));//84
  verticesTest.push(vec4(16.25, 3.02, -3, 1));//85
  verticesTest.push(vec4(15.75, 3.02, -4, 1));//86

  verticesTest.push(vec4(16.25, 3.02, -23, 1));//87
  verticesTest.push(vec4(15.75, 3.02, -22, 1));//88
  verticesTest.push(vec4(16.25, 3.02, -22, 1));//89
  verticesTest.push(vec4(15.75, 3.02, -23, 1));//90

  verticesTest.push(vec4(16.125, 0, 0, 1));//91
  verticesTest.push(vec4(15.875, 0, 0, 1));//92
  verticesTest.push(vec4(16.125, 3, 0, 1));//93
  verticesTest.push(vec4(15.875, 3, 0, 1));//94


  //Create White and Black chess points based on the columns.
  for (i = 0; i < 24; i++) {
    if (i < 6) {
      for (var j = 0; j < columns[i].length; j++) {
        if (columns[i][j] == 0) {
          verticesTest.push(vec4(i * 2 + 4, 0.015, (-25 + j * 1.5), 1));
          verticesTest.push(vec4(i * 2 + 3, 0.015, (-25 + j * 1.5 + 0.75), 1));
          verticesTest.push(vec4(i * 2 + 5, 0.015, (-25 + j * 1.5 + 0.75), 1));
          verticesTest.push(vec4(i * 2 + 4, 0.015, (-25 + (j + 1) * 1.5), 1));

          currentPosition = verticesTest.length;

          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
          index.push(currentPosition - 4);

          index.push(currentPosition - 1);
          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
        }

      }
    } else if (5 < i && 12 > i) {
      for (var j = 0; j < columns[i].length; j++) {
        if (columns[i][j] == 0) {
          verticesTest.push(vec4((i + 1) * 2 + 4, 0.015, (-25 + j * 1.5), 1));
          verticesTest.push(vec4((i + 1) * 2 + 3, 0.015, (-25 + j * 1.5 + 0.75), 1));
          verticesTest.push(vec4((i + 1) * 2 + 5, 0.015, (-25 + j * 1.5 + 0.75), 1));
          verticesTest.push(vec4((i + 1) * 2 + 4, 0.015, (-25 + (j + 1) * 1.5), 1));

          currentPosition = verticesTest.length;

          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
          index.push(currentPosition - 4);

          index.push(currentPosition - 1);
          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
        }
      }
    } else if (11 < i && 18 > i) {
      for (var j = 0; j < columns[i].length; j++) {
        if (columns[i][j] == 0) {
          verticesTest.push(vec4((i - 12) * 2 + 4, 0.015, (-1 - j * 1.5), 1));
          verticesTest.push(vec4((i - 12) * 2 + 3, 0.015, (-1 - j * 1.5 - 0.75), 1));
          verticesTest.push(vec4((i - 12) * 2 + 5, 0.015, (-1 - j * 1.5 - 0.75), 1));
          verticesTest.push(vec4((i - 12) * 2 + 4, 0.015, (-1 - (j + 1) * 1.5), 1));

          currentPosition = verticesTest.length;

          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
          index.push(currentPosition - 4);

          index.push(currentPosition - 1);
          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
        }
      }
    } else {
      for (var j = 0; j < columns[i].length; j++) {
        if (columns[i][j] == 0) {
          verticesTest.push(vec4((i - 11) * 2 + 4, 0.015, (-1 - j * 1.5), 1));
          verticesTest.push(vec4((i - 11) * 2 + 3, 0.015, (-1 - j * 1.5 - 0.75), 1));
          verticesTest.push(vec4((i - 11) * 2 + 5, 0.015, (-1 - j * 1.5 - 0.75), 1));
          verticesTest.push(vec4((i - 11) * 2 + 4, 0.015, (-1 - (j + 1) * 1.5), 1));

          currentPosition = verticesTest.length;

          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
          index.push(currentPosition - 4);

          index.push(currentPosition - 1);
          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
        }


      }
    }
  }

  for (i = 0; i < 24; i++) {
    if (i < 6) {
      for (var j = 0; j < columns[i].length; j++) {
        if (columns[i][j] == 1) {
          verticesTest.push(vec4(i * 2 + 4, 0.015, (-25 + j * 1.5), 1));
          verticesTest.push(vec4(i * 2 + 3, 0.015, (-25 + j * 1.5 + 0.75), 1));
          verticesTest.push(vec4(i * 2 + 5, 0.015, (-25 + j * 1.5 + 0.75), 1));
          verticesTest.push(vec4(i * 2 + 4, 0.015, (-25 + (j + 1) * 1.5), 1));

          currentPosition = verticesTest.length;

          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
          index.push(currentPosition - 4);

          index.push(currentPosition - 1);
          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
        }

      }
    } else if (5 < i && 12 > i) {
      for (var j = 0; j < columns[i].length; j++) {
        if (columns[i][j] == 1) {
          verticesTest.push(vec4((i + 1) * 2 + 4, 0.015, (-25 + j * 1.5), 1));
          verticesTest.push(vec4((i + 1) * 2 + 3, 0.015, (-25 + j * 1.5 + 0.75), 1));
          verticesTest.push(vec4((i + 1) * 2 + 5, 0.015, (-25 + j * 1.5 + 0.75), 1));
          verticesTest.push(vec4((i + 1) * 2 + 4, 0.015, (-25 + (j + 1) * 1.5), 1));

          currentPosition = verticesTest.length;

          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
          index.push(currentPosition - 4);

          index.push(currentPosition - 1);
          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
        }
      }
    } else if (11 < i && 18 > i) {
      for (var j = 0; j < columns[i].length; j++) {
        if (columns[i][j] == 1) {
          verticesTest.push(vec4((i - 12) * 2 + 4, 0.015, (-1 - j * 1.5), 1));
          verticesTest.push(vec4((i - 12) * 2 + 3, 0.015, (-1 - j * 1.5 - 0.75), 1));
          verticesTest.push(vec4((i - 12) * 2 + 5, 0.015, (-1 - j * 1.5 - 0.75), 1));
          verticesTest.push(vec4((i - 12) * 2 + 4, 0.015, (-1 - (j + 1) * 1.5), 1));

          currentPosition = verticesTest.length;

          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
          index.push(currentPosition - 4);

          index.push(currentPosition - 1);
          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
        }
      }
    } else {
      for (var j = 0; j < columns[i].length; j++) {
        if (columns[i][j] == 1) {
          verticesTest.push(vec4((i - 11) * 2 + 4, 0.015, (-1 - j * 1.5), 1));
          verticesTest.push(vec4((i - 11) * 2 + 3, 0.015, (-1 - j * 1.5 - 0.75), 1));
          verticesTest.push(vec4((i - 11) * 2 + 5, 0.015, (-1 - j * 1.5 - 0.75), 1));
          verticesTest.push(vec4((i - 11) * 2 + 4, 0.015, (-1 - (j + 1) * 1.5), 1));

          currentPosition = verticesTest.length;

          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
          index.push(currentPosition - 4);

          index.push(currentPosition - 1);
          index.push(currentPosition - 2);
          index.push(currentPosition - 3);
        }


      }
    }
  }
}

// class Die {
//   constructor(topLeft) {
//     this.topLeft = vec2(topLeft[0] * aspectRatio, topLeft[1]);
//     this.topRight = vec2((topLeft[0] + SPACE_WIDTH) * aspectRatio, topLeft[1]);
//     this.botttomLeft = vec2(topLeft[0] * aspectRatio, -topLeft[1]);
//     this.bottomRight = vec2(
//       (topLeft[0] + SPACE_WIDTH) * aspectRatio,
//       -topLeft[1]
//     );
//
//     this.value = 1;
//   }
//
//   getVertices() {
//     return [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight];
//   }
//
//   roll() {
//     this.value = Math.floor(Math.random() * 6) + 1;
//   }
//
//   getValue() {
//     return this.value;
//   }
// }

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}


// Helper for checkers / die values
function drawCircle(center, radius) {
  var theta = 0;

  for (var i = 0; i < CIRCLE_POINTS; i++) {
    point = vec2(
      (radius * Math.cos(theta) + center[0]) * aspectRatio,
       radius * Math.sin(theta) + center[1]);
    circles[0].push(point);
    theta += (2 * Math.PI) / CIRCLE_POINTS;
  }
}
