//rock paper scissors
//player one picks rock paper or scissors at same time that player 2 picks rock paper or scissors.
//player 1 has to beat player 2 or player 2 has to beat player 1.
// rock > scissor, scissor > paper, paper > rock. matching attempt = draw (no win, no lose)
//wins loses draws displayed. ultimate win = 3 wins.
//rock paper scissor gifs between matches, clock/waiting gif while you wait on other player to go.
//make a RPC background
//Win condition code doesn't run until both players have made a selection.  

//make 3 buttons (rock, paper, scissors) - assign to playerData turn variable. Evaluate player vs opponent, and set win and loss on player. 
//find player and opponent icons/avitars
//choices 

class PlayerData {
    constructor(){
        this.name = "";
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        this.turn = null;
        this.playerID = "";
    }
}

const Player1 = "player1";
const Player2 = "player2";
class Game {
    constructor(){
        this.database = new Database();
        this.playerData = this.findPlayerData();
        this.opponentData = new PlayerData();
        let opponentData = this.findOpponentData();
        this.database.onSetValue(opponentData.playerID, this.handleOpponent.bind(this));
        this.database.onSetValue(this.playerData.playerID, this.handlePlayer.bind(this));
        setTimeout(() => this.database.setValue(opponentData.playerID, opponentData), 3000);
        let rock = document.getElementById("rock");
        rock.addEventListener("click", () => this.handleClick("rock"));
        let paper = document.getElementById("paper");
        paper.addEventListener("click", () => this.handleClick("paper"));
        let scissors = document.getElementById("scissors");
        scissors.addEventListener("click", () => this.handleClick("scissors"));
    }
    handlePlayer(playerData){
        this.playerData = playerData;
        console.log(this.playerData);
        this.evaluateThrow();
    }
    handleOpponent(opponentData){
        this.opponentData = opponentData;
        console.log(this.opponentData);
        this.evaluateThrow();
    }
    findPlayerData() {
        let playerData = new PlayerData();
        playerData.name = "me";
        playerData.playerID = Player1;
        return playerData;
    }
    findOpponentData(){
        let playerData = new PlayerData();
        playerData.name = "opponent";
        playerData.playerID = Player2;
        playerData.turn = "scissors";
        return playerData;
    }
    evaluateThrow(){
        if (!this.playerData.turn || !this.opponentData.turn) {
            return;
        }
        if (this.playerData.turn === this.opponentData.turn){
            this.playerData.draws += 1;
        } else if (this.playerData.turn === "rock" && this.opponentData.turn === "scissors") {
            this.playerData.wins += 1;
        } else if (this.playerData.turn === "paper" && this.opponentData.turn === "rock") {
            this.playerData.wins += 1;
        } else if (this.playerData.turn === "scissors" && this.opponentData.turn === "paper") {
            this.playerData.wins += 1;
        } else {
            this.playerData.losses += 1;
        }
        this.playerData.turn = null;
        this.savePlayer();
    }
    handleClick(action){
        this.playerData.turn = action;
        this.savePlayer();
    }
    savePlayer(){
        this.database.setValue(this.playerData.playerID, this.playerData);
    }
}