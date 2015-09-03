var conf = require('./conf.json');
var http = require('http');
var url = require('url');
var fs = require('fs');
var Socket = require('./Server/SocketIo.js');


var httpServer = http.createServer(onRequest).listen(conf.http.port);
var mySocket = new Socket(httpServer);

var principalRoom = mySocket.createRoom('principal');
principalRoom.init();


//Fonction onRequest est exécutée à chaque requête sur le serveur
function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    var extension = pathname.split('.').pop();
    if (pathname == '/') {
        pathname = conf.http.index;
    }
    response.writeHead(200, {
        'Content-Type': conf.http.mime[extension],
        'Access-Control-Allow-Origin': '*'
    });
    try {
        response.end(fs.readFileSync(conf.http.www + pathname));
    } catch (e) {
        response.writeHead(302, {
            'Location': 'http://localhost:5555/'
        });
        response.end();
    }
}
