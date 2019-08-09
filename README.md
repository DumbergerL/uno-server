# Uno - Server
Der Uno Server ist eine digitalisierte Version von UNO. Über die HTTP Schnittstelle können Spieler an der Runde teilnehmen und Karten ablegen. 

## Uno-Bot Challenge
Die Uno-Bot Challenge ist ein kleiner Wettbewerb, bei dem innerhalb von 2h ein Uno Bot programmiert werden muss. Die Bots die erstellt wurden treten dann gegeneinander an. Der beste Bot gewinnt.

**Teilgenommene Bot's**

* [staubichsauger](https://github.com/staubichsauger/jabberwoky) (Programmiersprache: Go)
* [dumbergerl](https://github.com/DumbergerL/uno-bot) (Programmiersprache: JavaScript / Node.js)
* revilo196 (Programmiersprache: Go)

## API Route

| Methode | Endpunkt | Parameter | Beschreibung |
| ------- | -------- | --------- | ------------ |
| POST    | /join    | `{"name": "Hans-Gert"}` | Bot “registrieren” mit Spielername; als Rückgabe wird die für die Authorisierung notwendige Player_id (hash) zurückgegeben |
| GET*    | /games   | `{"my_turn": true/false, "hand": [ handkarten, …], "other_players": [{"player_name": …, "card_count": …}], "discarded_card": { karte },}` | Gibt den aktuellen Status der Spielrunde zurück |
| POST*   | /games   | `{"play_card": { karte }/null }` | Legt eine Karte auf den Ablagestapel (nur möglich, wenn man am Zug ist); bei null wird eine Karte gezogen; wird eine Wildcard gespielt muss in Color die Wunschfarbe angegeben werden. |

\* Authentifizierung notwendig im Query Parameter: ?id=[hashwert aka player_id]

```
{
    "color": RED || BLUE || GREEN || YELLOW,
    "value": ZERO || ONE ... || NINE || DRAW_TWO || REVERSE || SKIP || WILD || WILD_DRAW_FOUR 
}
```

## Uno Engine
- Uno Engine: https://github.com/danguilherme/uno

Die Uno Engine hat ein Problem mit der Karte `WILD-YELLOW`, deshalb ist der Quellcode kopiert und angepasst [COMMIT](https://github.com/DumbergerL/uno-server/commit/229d93b67559931d77e6492891cce9b805f7c46d)