var conf = require('../conf.json');

function User(login, socket, index) {
    this.login = login;
    this.socket = socket;
    this.index = index;
    this.getImg = function(){
        if(conf.users[this.login]){
            var img = conf.users[this.login];
        }else{
            var img = "Contents/images/1.jpg";
        }
        return img;
    };
    this.img = this.getImg();
    this.firstEnter = true;
}

module.exports = User;