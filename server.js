let configuration = {
    'expected_player': 2,
    'rounds_to_play': 100,
    'auto_generated' : 0,
};

let HttpInterface = require('./src/http-interface');
let UnoGame = require('./src/uno-game');
let AutoplayUnoGame = require('./src/autoplay');

var theUno = new UnoGame(configuration.expected_player, configuration.rounds_to_play);


autoPlayer = ['John', 'Mustafa', 'Lukas', 'Vincent', 'Jan', 'Nils', 'Dietmar', 'Hans-Juergen', 'TheBoss', 'Uno-Chef'];
for(var i = 0; i < configuration.auto_generated; i++)
{
    theUno.registerPlayer(autoPlayer[i]);
}


var theInterface = new HttpInterface(theUno);

