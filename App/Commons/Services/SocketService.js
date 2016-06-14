app.service('SocketService', ['$location', '$rootScope', '$q', function ($location, $rootScope, $q) {
    this.socket = null;
    this.listener = {};


    this.initSocket = function () {
        var self = this;
        var deferred = $q.defer();

        this.socket = io('/principal', { port: 80 });
        this.status = enumStatus.none;

        this.socket.on('connect', function () {
            self.status = enumStatus.connected;
            deferred.resolve(self.status);
        });

        this.socket.on('connect_error', function () {
            self.status = enumStatus.error;
            self.disconnect();
            deferred.reject(self.status);
        });

        this.socket.on('disconnect', function () {
            self.status = enumStatus.disconnected;
            self.disconnect();
            deferred.reject(self.status);

            $rootScope.$apply(function () {
                $location.path('/');
            })
        });

        this.socket.connect();
        return deferred.promise;
    };

    this.disconnect = function(callback){
        if(this.socket) {
            this.socket.disconnect();
        }
        this.removeAllListenners();
        this.socket = null;
    };

    this.removeAllListenners = function () {
        var self = this;
        angular.forEach(this.listener, function (value, key) {
            self.socket.removeAllListeners(key);
        });
        this.listener = {};
        self.socket.removeAllListeners('connect');
        self.socket.removeAllListeners('connect_error');
        self.socket.removeAllListeners('disconnect');
    };

    this.addListener = function (name, sender, cb) {
        var launch;
        if (!this.listener[name]) {
            this.listener[name] = [];
            launch = true;
        }
        this.listener[name].push({ sender: sender, cb: cb });
        if (launch) {
            this.launchEvent(name);
        }
    };

    this.launchEvent = function (name) {
        var self = this;
        this.socket.on(name, function (arg) {
            for (var i = 0, j = self.listener[name].length; i < j; i++) {
                if (self.listener[name][i].cb) {
                    self.listener[name][i].cb(arg);
                }
            }
        });
    };

    this.emit = function (name, value) {
        this.socket.emit(name, value);
    };
}]);