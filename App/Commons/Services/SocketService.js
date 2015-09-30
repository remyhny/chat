app.service('SocketService', ['$location', '$rootScope', '$q', function ($location, $rootScope, $q) {
    this.socket = null;
    this.isInit = false;
    this.listener = {};


    this.initSocket = function () {
        var self = this;
        var deferred = $q.defer();

        this.socket = io('/principal', { port: 5555 });
        this.isInit = true;

        this.socket.on('connect', function () {
            deferred.resolve();
        });

        this.socket.on('connect_error', function () {
            if (self.socket) {
                self.socket.disconnect();
                self.socket = null;
            }
        });

        this.socket.on('disconnect', function () {
            console.log('disconnect');
            self.socket.disconnect();
            self.removeAllListenners();
            self.socket = null;

            $rootScope.$apply(function () {
                $location.path('/');
            })
        });

        this.socket.connect();
        return deferred.promise;
    };


    this.removeAllListenners = function () {
        var self = this;
        console.log(self.listener);
        angular.forEach(this.listener, function (value, key) {
            self.socket.removeAllListeners(key);
        });
        this.listener = {};
        self.socket.removeAllListeners('connect');
        self.socket.removeAllListeners('connect_error');
        self.socket.removeAllListeners('disconnect');
    }

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