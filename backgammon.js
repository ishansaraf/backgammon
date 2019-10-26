var canvas;
var gl;
var aspectRatio = 1.0;
var die1Val = 0;
var die2Val = 0;
var isWhiteTurn = true;
var isMoved = false;
var whiteEnded = [];
var blackEnded = [];

var program;
var num1 = 9.8;
var num2 = num1 / 1.75;
var t = 30;
var start = false;
var ready = false;


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

  // Sets up 3D movement to play mode
  document.getElementById("play").onclick = function() {
    if (!start) {
      start = true;
      document.getElementById("play").innerHTML = "Stop The Game";
    } else {
      document.getElementById("play").innerHTML = "Start The Game";
      start = false;
    }
  };

  // Sets up die values
  document.getElementById("roll").onclick = function() {
    die1Val = rollDie();
    document.getElementById("die1").innerHTML = die1Val;
    die2Val = rollDie();
    document.getElementById("die2").innerHTML = die2Val;
  };

  // Set's up whose turn it is first
  isWhiteTurn = Math.random() >= Math.random() ? false : true;
  changeTurn();

  // WebGL Shader initialization
  program = initShaders(gl, "vertex-shader", "fragment-shader");
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

  if (start && t != 75) {
    t = t + 0.5;
    ready = false;
  } else if (!start && t != 30) {
    t = t - 0.5;
    ready = false;
  } else if (t == 75) {
    ready = true;
  }

  if(!ready){
    hiddenAllButtons();
  }else{

  }
  ThreeDCalculation();

  if (ready) {
    colors = [
      vec4(0.5976, 0.2968, 0, 1.0),
      vec4(0.5, 0.5, 0.5, 1.0),
      vec4(0, 0, 0, 1),
      vec4(1, 1, 1, 1),
      vec4(0.76, 0.6, 0.42, 1),
      vec4(0.2, 0.2, 0.18, 1),
      vec4(0.52, 0.08, 0.08, 1)
    ];
  } else {
    colors = [
      vec4(0.3, 0.3, 0.3, 1.0),
      vec4(0.5, 0.5, 0.5, 1.0),
      vec4(0, 0, 0, 1),
      vec4(1, 1, 1, 1),
      vec4(0.7, 0.7, 0.7, 1),
      vec4(0.2, 0.2, 0.18, 1),
      vec4(0.52, 0.08, 0.08, 1)
    ];
  }
  draw();
  requestAnimFrame(StartRender);
}

function ThreeDCalculation() {
  mat = mat4(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    Math.cos(radians(t)),
    -Math.sin(radians(t)),
    0.0,
    0.0,
    Math.sin(radians(t)),
    Math.cos(radians(t)),
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
  angle = lookAt(
    vec3(num2, num2, 3.5 * num1),
    vec3(num2, num2, 0),
    vec3(0.0, 1.0, 0.0)
  );
  projection = perspective(45.0, aspectRatio, 1, 10 * num1);
  modelView = mult(angle, mult(mat2, mult(mat, mat1)));
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
  gl.uniformMatrix4fv(projectionLoc, false, flatten(projection));

}

function draw() {
  //Middle Black Nodes
  createPoints();
  gl.bufferSubData (gl.ARRAY_BUFFER, 0, flatten(verticesTest));
  gl.bufferSubData (gl.ELEMENT_ARRAY_BUFFER, 0, new Uint8Array(index));



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

  //White Triangle Column
  gl.uniform4fv(colorLoc, colors[5]);
  for (var i = 60; i < 68; i++) {
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

function changeTurn() {
  checkGameEnd();

  if (isWhiteTurn) {
    isWhiteTurn = false;
    document.getElementById("turn").innerHTML = "Black's Turn";
  } else {
    isWhiteTurn = true;
    document.getElementById("turn").innerHTML = "White's Turn";
  }
}

// Moves a piece from column 1 to column 2
// true if move was successful, false otherwise
function movePiece(col1, col2) {
  var piece = col1.pop();
    col2.push(piece);
    return true;

  return false;
}

// This function returns the indices of columns that can be moved
// to, given a starting column index. It does not check if these
// moves are valid.
function getColumnsToMove(startIndex) {
  const tl_start = 0;
  const tr_start = 6;
  const bl_start = 12;
  const br_start = 18;
  var validIndices = [];

  if (isWhiteTurn) {
    // White moves counter-clockwise

    // Piece starts in bottom-right
    if (startIndex >= br_start) {
      if ((startIndex + die1Val) < 24) {
        validIndices.push(startIndex + die1Val);
      }
      if ((startIndex + die2Val) < 24) {
        validIndices.push(startIndex + die2Val);
      }
    }
    // Piece starts in bottom-left
    else if (startIndex < br_start && startIndex >= bl_start) {
      validIndices.push(startIndex + die1Val);
      validIndices.push(startIndex + die2Val);
    }
    // Piece starts in top-left
    else if (startIndex < tr_start && startIndex >= tl_start) {
      validIndices.push((die1Val - 1) + bl_start);
      validIndices.push((die2Val - 1) + bl_start);
    }
    // Piece starts in top-right
    else if (startIndex < bl_start && startIndex >= tr_start) {
      validIndices.push(startIndex - die1Val);
      validIndices.push(startIndex - die2Val);
    }
  } else {
    // Black moves clockwise

    // Piece starts in bottom-right
    if (startIndex >= br_start) {
      validIndices.push[startIndex - die1Val];
      validIndices.push[startIndex - die2Val];
    }
    // Piece starts in bottom-left
    else if (startIndex < br_start && startIndex >= bl_start) {
      validIndices.push[die1Val - 1];
      validIndices.push[die2Val - 1];
    }
    // Piece starts in top-left
    else if (startIndex < tr_start && startIndex >= tl_start) {
      validIndices.push(startIndex + die1Val);
      validIndices.push(startIndex + die2Val);
    }
    // Piece starts in top-right
    else if (startIndex < bl_start && startIndex >= tr_start) {
      if ((startIndex + die1Val) < 12) {
        validIndices.push(startIndex + die1Val);
      }
      if ((startIndex + die2Val) < 12) {
        validIndices.push(startIndex + die2Val);
      }
    }
  }

  return validIndices;
}

function hiddenAllButtons(){
  for(var i=0; i<columnIds.length; i++){
    hideButton(i);
  }
}

// Helpers to show and hide buttons to aid with checker movement
function hideButton(colIndex) {
  document.getElementById(columnIds[colIndex]).disabled = true;
}

function showButton(colIndex) {
  document.getElementById(columnIds[colIndex]).disabled = false;
}
