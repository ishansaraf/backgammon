
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