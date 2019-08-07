let express = require('express');
let app = express();


class HttpInterface{


    constructor(){
        app.use(express.static(__dirname));

        app.use(express.json()) // for parsing application/json
        app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

        
        app.post('/join', this.join);
        app.get('/games', this.getGames);
        app.post('/games', this.postGames);

        app.listen(3000, function () {
            console.log('Example app listening on port 3000!');
        });
    }

    join(req, res){
        //console.log(req);
        res.send("Ein neuer Spieler ist gejoint: >>> "+ req.body.name + " <<<");
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