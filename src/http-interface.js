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
        try {
            if (req.body.name === undefined || req.body.name.length == 0) {
                throw '400: No name set';
            }
            res.send("Ein neuer Spieler ist gejoint: >>> "+ req.body.name + " <<<");//Data Type: URLencoded form data, Name = name; Value = $PLAYERNAME
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