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
        console.log(this.UnoGame.getCurrentPlayer().name);
        console.log(req.query.id);
        if (req.query.id != this.UnoGame.getCurrentPlayer().name) {
            throw 403;//forbidden, spieler ist nicht am zug zum zeitpunkt der post anfrage
        }
        if (!req.body.hasOwnProperty('play_card')) {//prüfen ob karte vorhanden
            throw 400;
        }
        var card = null;
        if (req.body.playCard != null) {//prüfen ob karte null (=karte ziehen)
            if (!req.body.play_card.hasOwnProperty('color') || !req.body.play_card.hasOwnProperty('value')) {//prüfen ob karte die nicht null valid ist
                throw 400;
            }
            card  = getCard(req.query.id, req.body.play_card);//karte im system auswählen
        }
        playCard(card);//karte spielen

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

        var status_code = parseInt(err) ? parseInt(err) : 500;
        if (status_code === 500) {
            res.send(err);
        }
        else{
            res.status(status_code).send();
        }
   
    }
}

module.exports = HttpInterface;