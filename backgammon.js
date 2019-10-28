var canvas;
var gl;
var aspectRatio = 1.0;
var die1Val = 0;
var die2Val = 0;
var isWhiteTurn = true;
var isMoved = true;
var moveStep=0;
var isRolled = false;
var whiteEnded = [];
var blackEnded = [];

var program;
var num1 = 9.8;
var num2 = num1 / 1.75;
var t = 30;
var start = false;//if start the game button click or not
var ready = false;//if the game is ready to play


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
    isRolled=true;
    changeTurn();
  };

  // Set's up whose turn it is first
  isWhiteTurn = Math.random() >= Math.random() ? false : true;

  //Set up the game buttons(in game.js)
  setupAllMoveButtons();


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

  ThreeDCalculation();

  //Check if a buttons is available to show or not
  if (ready) {
    if(isMoved){
      document.getElementById("roll").disabled=false;
    }else{
      document.getElementById("roll").disabled=true;
    }
    colors = readyColors;
    hiddenAllButtons();
    if(isRolled){
      showAllButtons();
    }
  } else {
    colors = notReadyColors;
    document.getElementById("roll").disabled=true;
    hiddenAllButtons();
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

//Disabled all the buttons
function hiddenAllButtons(){
  for(var i=0; i<columnIds.length; i++){
    hideButton(i);
  }
}

//Enabled all the buttons
function showAllButtons(){
  var validButton = validMoveColumns();
  for(var i=0; i<validButton.length; i++){
    showButton(validButton[i]);
  }
}


// Helpers to disabled or enabled buttons to aid with checker movement
function hideButton(colIndex) {
  document.getElementById(columnIds[colIndex]).disabled = true;
}

function showButton(colIndex) {
  document.getElementById(columnIds[colIndex]).disabled = false;
}
