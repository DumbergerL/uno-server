let express = require('express');
let rateLimit = require('express-rate-limit');
let slowDown = require("express-slow-down");

let app = express();


class HttpInterface{

    constructor(UnoGame){
        this.UnoGame = UnoGame;
        app.use(express.static(__dirname));

        app.use(express.json()) // for parsing application/json
        app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

        app.use(this.middleware_authorize.bind(this));

        //var limiter = rateLimit({
        //    windowsMs:  1000,         // 50 ms
        //    max: 500                 // Limit each IP to XY requests per windowMS
        //});
        //app.use(limiter);

        var speedLimiter = slowDown({
            windowMs: 1000, // 15 minutes
            delayAfter: 100, // allow 100 requests per 15 minutes, then...
            delayMs: 100 // begin adding 500ms of delay per request above 100:
            // request # 101 is delayed by  500ms
            // request # 102 is delayed by 1000ms
            // request # 103 is delayed by 1500ms
            // etc.
        });
        app.use(speedLimiter);

        app.get('/', this.startpage.bind(this));
        app.post('/join', this.join.bind(this));
        app.get('/games', this.getGames.bind(this));
        app.post('/games', this.postGames.bind(this));

        app.use(this.middleware_errorhandler);
        
        app.listen(3000, function () {
            console.log('\nUno-Server started and listening to port 3000!');
        });
    }

    startpage(req, res){
        var output = "";
        output += "<h1>Uno Game Server</h1>";
        output += "<rem>"+JSON.stringify( this.UnoGame.players.map( (pl) => {return {player_name: pl.player_name, score: pl.score }}) )+"</rem>";

        res.send(output);
    }

    join(req, res){
        if (req.body.name === null || req.body.name === "" || !req.body.hasOwnProperty('name')) {
            throw {code: 400, message: "Parameter not valid"};
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
            throw {code: 403, message: "It's not your turn!"};  //forbidden, spieler ist nicht am zug zum zeitpunkt der post anfrage
        }
        if (!req.body.hasOwnProperty('play_card')) {//prüfen ob karte vorhanden
            throw {code: 400, message: "'play_card' Attribute has not been set!"};
        }

        var card = null;
        if (req.body.play_card != null) {//prüfen ob karte null (=karte ziehen)
            if (!req.body.play_card.hasOwnProperty('color') || !req.body.play_card.hasOwnProperty('value')) {//prüfen ob karte die nicht null valid ist
                throw {code: 400, message: "'play_card' Object ist not well-formed!"};
            }
            
            card = this.UnoGame.getCard(req.query.id, req.body.play_card);//karte im system auswählen
            if(card === null)throw {code: 400, message: "The Card you selected is not on your hand!"};
        }
        this.UnoGame.playCard(card);//karte spielen

        this.getGames(req, res);
    }

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
                throw {code: 401, message: "The player_id is not valid!"};
            }
        }
        next();
    }

    middleware_errorhandler(err, req, res, next){
        var status_code = 500;
        var status_message = err;

        if(err.hasOwnProperty('code') && err.hasOwnProperty('message')){ //well formed throwed exception
            status_code = err.code;
            status_message = err.message;
        }
        
        res.status(status_code);
        res.json({error: err, stack: err.stack});
    }
}

module.exports = HttpInterface;