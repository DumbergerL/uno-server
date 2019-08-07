const { Game, Colors, Values } = require('uno-engine');

class UnoGame {

    constructor(expectedPlayers, roundsToPlay)
    {
        this.players = [];  //player_name, player_id, score
        this.gameEngine;
        this.DEBUG_MODE = true;

        this.expectedPlayers = expectedPlayers;
        this.roundsToPlay = roundsToPlay;
        this.round = 1;
    }

    registerPlayer(playerName)
    {
        var hash = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 10; i++ ) {
           hash += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        this.players.push({'player_name': playerName, 'player_id': hash, 'score': 0});
        
        if(this.expectedPlayers <= this.players.length)this.initGame();

        return hash;
    }

    initGame(){
        var player = this.players.map(pl => pl.player_id);
        this.gameEngine = new Game(player, []);
        this.gameEngine.on('end', this.endGame.bind(this));

        this.gameEngine.on('nextplayer', (data) => {
            if(this.DEBUG_MODE) console.log(":: Nächster Spieler");
        });

        this.gameEngine.on('cardplay', (data) => {
            if(this.DEBUG_MODE) console.log(">> Karte gespielt "+ Values[data.card.value] +"-"+ Colors[data.card.color]);
        });

        this.gameEngine.on('draw', (data) => {
            if(this.DEBUG_MODE) console.log("<< Karte gezogen "+ Values[data.cards[0].value] +"-"+ Colors[data.cards[0].color]);
        });
    
    }

    //PLAYING THE GAME
    playCard(card){
        if(card){
            this.gameEngine.play(card);
        }else{
            this.gameEngine.draw(); 
            this.gameEngine.pass();
        }
    }

    isMatchingPile(card){
        var discardedCard = this.gameEngine.discardedCard;
        if(discardedCard.value == card.value || discardedCard.color == card.color || Values[card.value] === 'WILD' || Values[card.value] === 'WILD_DRAW_FOUR'){
            return true;
        }else{
            return false;
        }
    }

    getCurrentPlayer(){
        return this.gameEngine.currentPlayer;
    }

    endGame(data){
        console.log("END THE GAME!");

        let winner = this.players.find(function(player){
            return player.player_id === data.winner.name;
        });

        winner.score += data.score;
        this.round++;
        
        console.log(this.players);
        
        this.gameEngine = null;
        
        if(this.roundsToPlay >= this.round){
            this.initGame();
            this.autoplay2();
        }
    }


    //DEBUGGING
    getGameState()
    {
        return {
            'currentPlayer': this.gameEngine.currentPlayer,
            'discardedCard': this.gameEngine.discardedCard,
            'allPlayers': this.players.map(pl => this.gameEngine.getPlayer(pl.player_id)),
        };
    }

    getGameStatePerson(hash)
    {
        let output = {};
        var person = this.gameEngine.getPlayer(hash);
        if(person === this.gameEngine.currentPlayer){
            output.my_turn = true;
        }else{
            output.my_turn = false;
        }

        output.hand = person.hand.map( (card) => {return {color: card.color, value: card.value}});
        output.discarded_card = this.gameEngine.discardedCard;
        return output;
    }

}

module.exports = UnoGame;