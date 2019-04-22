const Player1 = "player1";
const Player2 = "player2";
class Game {
    constructor(){
        this.database = new Database();
        this.database.onSetValue(Player1, this.handlePlayer1);
        this.database.onSetValue(Player2, this.handlePlayer2);
        this.database.setValue(Player1, "welcome");
    }
    handlePlayer1(player1Data){
        console.log(player1Data);
    }
    handlePlayer2(player2Data){
        console.log(player2Data);
    }
}