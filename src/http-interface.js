let express = require('express');
let app = express();


class HttpInterface{


    constructor(UnoGame){
        this.UnoGame = UnoGame;
        app.use(express.static(__dirname));

        app.use(express.json()) // for parsing application/json
        app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

        app.use(this.middleware_authorize.bind(this));


        app.post('/join', this.join.bind(this));
        app.get('/games', this.getGames.bind(this));
        app.post('/games', this.postGames.bind(this));

        app.use(this.middleware_errohandler);
        
        app.listen(3000, function () {
            console.log('\nUno-Server started and listening to port 3000!');
        });
    }



    join(req, res){
        
            if (req.body.name === null || req.body.name === "" || !req.body.hasOwnProperty('name')) {
                throw 400;
            }
            var hash = this.UnoGame.registerPlayer(req.body.name);
            res.json({player_id: hash, player_name: req.body.name});
    }

    getGames(req, res){
        var person_id = req.query.id;
        res.send( this.UnoGame.getGameStatePerson(person_id));
    }

    postGames(req, res){
        if (req.query.id != this.UnoGame.getCurrentPlayer().name) {
            throw 403;  //forbidden, spieler ist nicht am zug zum zeitpunkt der post anfrage
        }
        if (!req.body.hasOwnProperty('play_card')) {//prüfen ob karte vorhanden
            throw 400;
        }

        var card = null;
        if (req.body.play_card != null) {//prüfen ob karte null (=karte ziehen)
            if (!req.body.play_card.hasOwnProperty('color') || !req.body.play_card.hasOwnProperty('value')) {//prüfen ob karte die nicht null valid ist
                throw 400;
            }
            if(!this.UnoGame.hasCard(req.query.id, req.body.play_card))throw 400;
            
            card = this.UnoGame.getCard(req.query.id, req.body.play_card);//karte im system auswählen
            if(card === null)throw 400;
        }
        console.log(card);
        this.UnoGame.playCard(card);//karte spielen

        this.getGames(req, res);
    }

    //...

    middleware_authorize(req, res, next){
        if (req.query.hasOwnProperty('id')) {
            var person_id = req.query.id;
            var valid = false;

            this.UnoGame.players.forEach(element => {
                
                if (person_id === element.player_id) {
                    valid = true;
                }
            });

            if (!valid) {
                throw 401;
            }
        }
        next();
    }

    middleware_errohandler(err, req, res, next){
        var status_code = parseInt(err);
        if(isNaN(status_code)){
            status_code = 500;
        }
        res.status(status_code);
        res.json({error: err.stack});
    }
}

module.exports = HttpInterface;