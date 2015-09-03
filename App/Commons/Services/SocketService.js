app.service('SocketService', [function () {
    this.socket = null;
    this.isInit = false;

    this.initSocket = function () {
        this.socket = io.connect('http://localhost/principal', { port: 5555 });
        this.isInit = true;
    }

}]);