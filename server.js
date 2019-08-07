let express = require('express');
let app = express();

let UnoGame = require('./src/uno-game');
let AutoplayUnoGame = require('./src/autoplay');

var theUno = new AutoplayUnoGame(2,200);

theUno.registerPlayer("john");
theUno.registerPlayer("mustafa");
theUno.registerPlayer("vincent");


console.log(theUno.getGameState());

theUno.autoplay2();


/*
app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.send('Hello World!');
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});*/