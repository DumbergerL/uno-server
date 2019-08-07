let express = require('express');
let app = express();


class HttpInterface{


    constructor(UnoGame){
        this.UnoGame = UnoGame;
        app.use(express.static(__dirname));

        app.use(express.json()) // for parsing application/json
        app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

        
        app.post('/join', this.join.bind(this));
        app.get('/games', this.getGames);
        app.post('/games', this.postGames);

        app.listen(3000, function () {
            console.log('Example app listening on port 3000!');
        });
    }



    join(req, res){
        try {
            if (req.body.name === null || req.body.name === "") {
                throw '400: No name set';
            }
            
            var hash = this.UnoGame.registerPlayer(req.body.name);
            res.send("Ein neuer Spieler ist gejoint: >>> "+ req.body.name + " mit dem Hash: "+ hash +" <<<");
        } catch (error) {
            res.send('Es ist ein Fehler aufgetreten: '+error);
        }


    }

    getGames(req, res){
        //...
    }

    postGames(req, res){
        //...
    }

    //...
}

module.exports = HttpInterface;