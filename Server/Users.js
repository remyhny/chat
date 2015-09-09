var conf = require('../conf.json');

function User(login, socket, index) {
    this.login = login;
    this.socket = socket;
    this.index = index;
 
    this.firstEnter = true;


    var getImg = function (login) {
        if(conf.users[login]){
            var color = conf.users[login].img;
        }else{
            var color = "Contents/images/1.jpg";
        }
        return color;
    };

    var getColor = function(login){
        if(conf.users[login]){
            var img = conf.users[login].color;
        }else{
            var img = "black";
        }
        return img;
    };

    this.img = getImg(this.login);
    this.color = getColor(this.login);
}

module.exports = User;