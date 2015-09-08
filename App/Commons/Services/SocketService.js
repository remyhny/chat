app.service('SocketService', ['$location', '$rootScope', '$q', function ($location, $rootScope, $q) {
    this.socket = null;
    this.isInit = false;

    this.initSocket = function () {
        var self = this;
        var deferred = $q.defer();
        console.log('init socket');

        this.socket = io('http://localhost/principal', { port: 5555 });
        this.socket.connect();
        this.isInit = true;

        this.socket.on('connect', function () {
            deferred.resolve();
        });

        this.socket.on('connect_error', function () {
            console.log('connect error');
            if (self.socket) {
                self.socket.disconnect();
                self.socket = null;
            }
        });

        this.socket.on('disconnect', function () {
            console.log('socket deconnecté');
            self.socket.disconnect();
            self.socket = null;
            $rootScope.$apply(function () {
                $location.path('/');
            })
        });

        return deferred.promise;
    }

}]);