app.service('SocketService', [function () {
    this.socket = null;
    this.isInit = false;


    this.initSocket = function () {
        this.socket = io.connect('http://78.249.100.158/principal', { port: 5555 });
        this.isInit = true;
    }

}]);