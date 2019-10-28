function checkGameEnd() {
    if (whiteEnded.length == 15) {
        alert("White Wins!");
        window.location.reload();
        return;
    } else if (blackEnded.length == 15) {
        alert("Black Wins!");
        window.location.reload();
    }
}

function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// Moves a piece from column 1 to column 2
// true if move was successful, false otherwise
function movePiece(col1, col2) {
    var piece = col1.pop();
    if(piece!=null){
    col2.push(piece);
    return true;
    }
    return false
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

//This is the function to check if the column contains chess that is able to
// make a valid move and return the indes of the colums.
function validMoveColumns(){
    var result=[];
    for (var i=0;i<24;i++){
        var checker = getColumnsToMove(i);
        if(columns[i].length > 0 && columns[i][0]==0 && isWhiteTurn){
//            if(checker.length == 2) {
//                var checkCol1 = checker[0];
//                if (columns[checkCol1].length==0||columns[checkCol1][0]==0){
//                    result.push(i);
//                }
//            }else if (moveStep==0){
//                
//                    result.push(i);
//                
//            }
            if (checker.length>0){
                if(moveStep == 0) {
                var checkCol = checker[0];
                if (columns[checkCol].length==0||columns[checkCol][0]==0){
                    result.push(i);
                }}}
            if (checker.length==2){
                if (moveStep == 1){
                    var checkCol = checker[1];
                    if (columns[checkCol].length==0||columns[checkCol][0]==0){
                        result.push(i);
                    }
                }
            }
            
                
        }else if(columns[i].length > 0 && columns[i][0]==1 && !isWhiteTurn){
//            if(checker.length == 2) {
//                var checkCol1 = checker[0];
//                if (columns[checkCol1].length==0||columns[checkCol1][0]==1){
//                    result.push(i);
//                }
//                
//            }else if (moveStep==0){
//                
//                result.push(i);
//            }
            if (checker.length>0){
                if(moveStep == 0) {
                var checkCol = checker[0];
                if (columns[checkCol].length==0||columns[checkCol][0]==1){
                    result.push(i);
                }}}
            if (checker.length==2){
                if (moveStep == 1){
                    var checkCol = checker[1];
                    if (columns[checkCol].length==0||columns[checkCol][0]==1){
                        result.push(i);
                    }
                }
            }
        }
    }
    return result;
}

function changeTurn() {
    checkGameEnd();
    isMoved=false;
    if (isWhiteTurn) {
        isWhiteTurn = false;
        document.getElementById("turn").innerHTML = "Black's Turn";
    } else {
        isWhiteTurn = true;
        document.getElementById("turn").innerHTML = "White's Turn";
    }
}

//Move the chess
function moveHelper(id){
    if(moveStep==1){
        movePiece(columns[id],columns[getColumnsToMove(id)[moveStep]]);
        moveStep=0;
        isMoved=true;
        isRolled=false;
        document.getElementById("turn").innerHTML = "Next Player...Rolling for turn";
    }else{
        movePiece(columns[id],columns[getColumnsToMove(id)[moveStep]]);
        moveStep++;

    }
}

function setupAllMoveButtons(){
    document.getElementById(columnIds[0]).onclick=function(){
        var id = 0;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[1]).onclick=function(){
        var id = 1;
        console.log(id+" click");
        moveHelper(id);
    };

    document.getElementById(columnIds[2]).onclick=function(){
        var id = 2;
        console.log(id+" click");
    };
    document.getElementById(columnIds[3]).onclick=function(){
        var id = 3;
        console.log(id+" click");
        moveHelper(id);
    };

    document.getElementById(columnIds[4]).onclick=function(){
        var id = 4;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[5]).onclick=function(){
        var id = 5;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[6]).onclick=function(){
        var id = 6;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[7]).onclick=function(){
        var id = 7;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[8]).onclick=function(){
        var id = 8;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[9]).onclick=function(){
        var id = 9;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[10]).onclick=function(){
        var id = 10;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[11]).onclick=function(){
        var id = 11;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[12]).onclick=function(){
        var id = 12;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[13]).onclick=function(){
        var id = 13;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[14]).onclick=function(){
        var id = 14;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[15]).onclick=function(){
        var id = 15;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[16]).onclick=function(){
        var id = 16;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[17]).onclick=function(){
        var id = 17;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[18]).onclick=function(){
        var id = 18;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[19]).onclick=function(){
        var id = 19;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[20]).onclick=function(){
        var id = 20;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[21]).onclick=function(){
        var id = 21;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[22]).onclick=function(){
        var id = 22;
        console.log(id+" click");
        moveHelper(id);
    };
    document.getElementById(columnIds[23]).onclick=function(){
        var id = 23;
        console.log(id+" click");
        moveHelper(id);
    };
}