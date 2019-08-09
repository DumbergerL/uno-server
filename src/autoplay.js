const { Colors } = require('./uno-engine');
const UnoGame = require('./uno-game');

class Autoplay extends UnoGame{
      
    constructor(p1,p2)
    {
        super(p1,p2);
    }
    
    autoplay2(){
        if(this.DEBUG_MODE)this.visualizeCards();
        
        var currentPlayer = this.gameEngine.currentPlayer;
        var playedCard = false;

        var playedCard = false;
        for(var i = 0; i < currentPlayer.hand.length; i++){
            var card = currentPlayer.hand[i];
            if(this.isMatchingPile(card)){
                if(!card.color)card.color = Colors['BLUE'];
                this.playCard(card);
                playedCard = true;
                break;
            }
        }
        if(!playedCard){
            this.playCard(null);
        }

        setTimeout(() => {
            try{
                this.autoplay2();
            }catch(e){}
        }, 800); 
    }

    autoplay(){
        this.visualizeCards();
        //console.log("_________________________________________________________________");
        var currentPlayer = this.gameEngine.currentPlayer;
        var playedCard = false;

        //console.log("Current Player: "+currentPlayer.name + "("+currentPlayer.hand.length+")");

        var playedCard = false;
        for(var i = 0; i < currentPlayer.hand.length; i++){
            try{
                var card = currentPlayer.hand[i];
                if(!card.color)card.color = Colors['GREEN'];
                this.gameEngine.play(card);
                playedCard = true;
                break;
            }catch (e){
                //console.log("\t card not match: "+e);
            }
        }
        if(!playedCard){
            this.gameEngine.draw(); 
            try {
                this.gameEngine.pass();
            } catch (e) {
                console.log(e);
            }
        }

        if(!this.FINISHED){
            setTimeout(() => {
                this.autoplay();
            }, 500); 
        }
    }

    visualizeCards(){
        console.log("_________________________________________________________________");
        var gameState = this.getGameState();
        gameState.allPlayers.forEach( function(player){
            var output = player.name+'\t';
            for(var i = 0; i < player.hand.length; i++){
                output += 'X';
            }
            console.log(output)
        
        });
    }
}

module.exports = Autoplay;