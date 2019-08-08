let configuration = {
    'expected_player': 2,
    'rounds_to_play': 2,
    'database_name' : 'mongo_test'
};
let HttpInterface = require('./src/http-interface');
let UnoGame = require('./src/uno-game');
let AutoplayUnoGame = require('./src/autoplay');

var theUno = new UnoGame(configuration.expected_player, configuration.rounds_to_play);

var hash1 = theUno.registerPlayer("john");
var hash2 = theUno.registerPlayer("mustafa");
//var hash3 = theUno.registerPlayer("vincent");

//var rawHandCards = theUno.getGameStatePerson(hash1).hand;
//console.log(rawHandCards);

//var trueHandCards = theUno.gameEngine.getPlayer(hash1).hand;
//console.log(trueHandCards);



//console.log(theUno.getCardsPerson(hash1));
//console.log(theUno.getCard(hash1, getStatus.hand[0]));


var theInterface = new HttpInterface(theUno);

