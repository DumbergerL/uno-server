let configuration = {
    'expected_player': 3,
    'rounds_to_play': 6,
    'database_name' : 'mongo_test'
};

let AutoplayUnoGame = require('./src/autoplay');

var theUno = new AutoplayUnoGame(configuration.expected_player, configuration.rounds_to_play);

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