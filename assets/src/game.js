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
        this.token = "";
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

function getNewToken() {
    return Date.now().toString();
}
//game logic class
class Game {
    constructor(){
        //initializing database wrapper. Will be wrapping Firebase data.
        this.database = new Database();
        let opponentData = new PlayerData();
        opponentData.playerID = Player2;
        opponentData.turn = "scissors";
        opponentData.token = getNewToken();
        this.database.setValue(Player2, opponentData);
        //registering handle functions to database
        //these functions will be called when there is a change at this key 
        this.database.onSetValue(Player2, this.handlePlayer.bind(this));
        this.database.onSetValue(Player1, this.handlePlayer.bind(this));
        this.setupInitialPlayerState();
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
        let token = this.getPlayToken();
        if (!this.checkTokenValidity(token)) {
            return;
        }
        if (playerData && !this.checkTokenValidity(playerData.token)) {
            return;
        }
        if (playerData && token === playerData.token) {
            this.playerData = playerData;
        } else {
            this.opponentData = playerData;
        }
        this.evaluateThrow();
    }
    setupInitialPlayerState() {
        let player1Data = this.database.getValue(Player1);
        let player2Data = this.database.getValue(Player2);
        let token = this.getPlayToken();
        if (!player1Data || !this.checkTokenValidity(player1Data.token)) {
            let playerData = new PlayerData();
            playerData.playerID = Player1;
            playerData.token = getNewToken();
            this.savePlayToken(playerData.token);
            this.database.setValue(Player1, playerData);
            //this.database.setValue(Player2, null);
            return;
        }
        if (this.checkTokenValidity(token) && token === player1Data.token) {
            player1Data.token = getNewToken();
            this.savePlayToken(player1Data.token);
            this.database.setValue(Player1, player1Data);
            return;
        }

        if (this.checkTokenValidity(token) && token === player2Data.token) {
            player2Data.token = getNewToken();
            this.savePlayToken(player2Data.token);
            this.database.setValue(Player2, player2Data);
            return;
        }
        if (this.checkTokenValidity(player1Data.token)) {
            console.log("game already in session");
        }
    }
    //Evaluates win condition when both players have made a move
    evaluateThrow(){
        if (!this.playerData) {
            return;
        }

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
    savePlayToken(token) {
        localStorage.setItem("play-token", token);
    }
    getPlayToken() {
        return localStorage.getItem("play-token");
    }
    checkTokenValidity(token) {
        if (!token) {
            return false;
        } 
        if (parseInt(token) > Date.now() + 18000) {
            return false;
        }
        return true;
    }
}