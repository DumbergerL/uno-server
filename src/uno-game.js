const { Game, Values } = require('uno-engine');
const { Colors } = require('./custom_color');
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
        if (this.gameEngine) throw {code: 503, message: "Game has not been startet yet!"};
        var hash = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 4; i++ ) {
           hash += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        var playerdata = {'player_name': playerName, 'player_id': hash, 'score': 0};
        
        if(this.players.length <= 0) console.log("\nREGISTER PLAYER");
        console.log(playerdata);
        this.players.push(playerdata);
        
        if(this.expectedPlayers <= this.players.length)this.initGame();
        
        return hash;
    }

    initGame(){
        var player = this.players.map(pl => pl.player_id);
        this.gameEngine = new Game(player, []);
        this.gameEngine.on('end', this.endGame.bind(this));

        this.gameEngine.on('nextplayer', (data) => {
            if(this.DEBUG_MODE) console.log("\n\t:: Nächster Spieler: "+data.player.name);
        });

        this.gameEngine.on('cardplay', (data) => {
            if(this.DEBUG_MODE) console.log("\t>> Karte gespielt: "+ Values[data.card.value] +"-"+ Colors[data.card.color]);
        });

        this.gameEngine.on('draw', (data) => {
            if(this.DEBUG_MODE) console.log("\t<< Karte gezogen ("+ data.cards.length +"):"+ Values[data.cards[0].value] +"-"+ Colors[data.cards[0].color]);
        });

        console.log("\nINITALIZED / STARTED GAME");
        console.log('First Player: '+this.gameEngine.currentPlayer);
        //this.autoplay2();
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

    getPerson(person_id){
        return this.gameEngine.getPlayer(person_id);
    }
    
    getCardsPerson(person_id){
        return this.getPerson(person_id).hand;
    }

    getCard(person_id, card_obj){
        var cards = this.getCardsPerson(person_id);
        for(var i = 0; i < cards.length; i++){
            if((Values[cards[i].value] == "WILD" || Values[cards[i].value] == "WILD_DRAW_FOUR") && (card_obj.value == "WILD" ||card_obj.value == "WILD_DRAW_FOUR")){
                var card = cards[i];
                card.color = Colors[card_obj.color];
                return card;
            }
            if(Colors[cards[i].color] === card_obj.color && Values[cards[i].value] === card_obj.value)return cards[i];
        }
        return null;
    }

    hasCard(person_id, card_obj){
        try{
            this.getCard(person_id, card_obj);
            return true;
        }catch(e){
            return false;
        }
    }


    endGame(data){
        console.log("\nEND THE GAME!");

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

    getGameStatePerson(person_id)
    {
        let output = {};
        if (!this.gameEngine) {
            return output;
        }
        var person = this.gameEngine.getPlayer(person_id);
        if(person === this.gameEngine.currentPlayer){
            output.my_turn = true;
        }else{
            output.my_turn = false;
        }

        output.other_players = [];
        this.players.forEach(function(pl) {
            var playerObj = this.gameEngine.getPlayer(pl.player_id);
            output.other_players.push({player_name: pl.player_name, card_count: playerObj.hand.length });
        }.bind(this));

        output.hand = person.hand.map( (card) => {return {color: Colors[card.color], value: Values[card.value]}});
        output.discarded_card = {color: Colors[this.gameEngine.discardedCard.color], value: Values[this.gameEngine.discardedCard.value]};
        return output;
    }
}

module.exports = UnoGame;