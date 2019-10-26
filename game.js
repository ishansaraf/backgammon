
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

//This is the function to check if the column contains chess that is able to
// make a volid move and return the indes of the colums.
function voliMoveColumns(){
    var result=[];
    for (var i=0;i<24;i++){
        if(columns[i].length > 0 && columns[i][0]==0 && isWhiteTurn){
            result.push(i);
        }else if(columns[i].length > 0 && columns[i][0]==1 && !isWhiteTurn){
            result.push(i);
        }
    }
    return result;
}
