//rock paper scissors pseudocode
//player one picks rock paper or scissors at same time that player 2 picks rock paper or scissors.
//player 1 has to beat player 2 or player 2 has to beat player 1.
// rock > scissor, scissor > paper, paper > rock. matching attempt = draw (no win, no lose)
//wins loses draws displayed. ultimate win = 3 wins.
//rock paper scissor gifs between matches, clock/waiting gif while you wait on other player to go.
//make a RPC background
//Win condition code doesn't run until both players have made a selection.  

//playerdata class that is saved on database
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
//2 player game
const Player1 = "player1";
const Player2 = "player2";
const Images = {
    "waiting": "https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif",
    "rock": "assets/images/rock.jpg",
    "paper": "assets/images/paper.jpg",
    "scissors": "assets/images/scissors.jpg",
};

//game logic class
class Game {
    constructor(){
        //initializing database wrapper. Will be wrapping Firebase data.
        this.database = new Database();
        this.playerData = this.findPlayerData();
        this.opponentData = new PlayerData();
        let opponentData = this.findOpponentData();
        //registering handle functions to database
        //these functions will be called when there is a change at this key 
        this.database.onSetValue(opponentData.playerID, this.handleOpponent.bind(this));
        this.database.onSetValue(this.playerData.playerID, this.handlePlayer.bind(this));
        //click action
        let rock = document.getElementById("rock");
        rock.addEventListener("click", () => this.handleClick("rock"));
        let paper = document.getElementById("paper");
        paper.addEventListener("click", () => this.handleClick("paper"));
        let scissors = document.getElementById("scissors");
        scissors.addEventListener("click", () => this.handleClick("scissors"));
        //grab player's turn images 
        this.playerMoveImage = document.getElementById("player-move");
        this.opponentMoveImage = document.getElementById("opponent-move");
        //grab play-again area to hide and un-hide
        this.playAgainArea = document.getElementById("play-again-area");
        let playAgainButton = document.getElementById("play-again-button");
        playAgainButton.addEventListener("click", this.playAgain.bind(this));
        this.playing = true;
    }
    //handles incoming player data changes from the database
    handlePlayer(playerData){
        this.playerData = playerData;
        console.log(this.playerData);
        this.evaluateThrow();
    }
    //handles incoming opponent data changes from the database
    handleOpponent(opponentData){
        this.opponentData = opponentData;
        console.log(this.opponentData);
        this.evaluateThrow();
    }
    //to figure out which player you are assigned. You play as player 1 on front end but on database this will be determined in order of arrival.
    findPlayerData() {
        let playerData = new PlayerData();
        playerData.name = "me";
        playerData.playerID = Player1;
        return playerData;
    }
    //to figure out which opponent you are assigned. You play as player 1 on front end but on database this will be determined in order of arrival.
    findOpponentData(){
        let playerData = new PlayerData();
        playerData.name = "opponent";
        playerData.playerID = Player2;
        playerData.turn = "scissors";
        return playerData;
    }
    //Evaluates win condition when both players have made a move
    evaluateThrow(){
        if (this.playerData.turn) {
            this.playerMoveImage.src = Images[this.playerData.turn];
        }
        if (!this.playerData.turn || !this.opponentData.turn) {
            return;
        }
        if (this.opponentData.turn) {
            this.opponentMoveImage.src = Images[this.opponentData.turn];
        }
        //checking turn conditions
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
        this.playAgainArea.style.display = "block";
        this.playing = false;
    }
    //handling click action from available moves
    handleClick(action){
        if (!this.playing) {
            return;
        }
        this.playerData.turn = action;
        this.savePlayer();
    }
    //stores player data in database
    savePlayer(){
        this.database.setValue(this.playerData.playerID, this.playerData);
    }
    playAgain() {
        this.playAgainArea.style.display = "none";
        this.playerMoveImage.src = Images["waiting"];
        this.opponentMoveImage.src = Images["waiting"];
        this.playing = true;
    }
}