app.service('EmoticonService', function () {
    var emoticons = [{ text: '\\:\\)', class: 'emoticon1' }, { text: '\\:\\(', class: 'emoticon2' }];

    this.searchEmoticon = function (input) {
        for (var i = 0, l = emoticons.length; i < l; i++) {
           // regex = new RegExp('^' + emoticons[i].text + '\\s|\\s' + emoticons[i].text + '\\s|\\s' + emoticons[i].text + '$|^' + emoticons[i].text + '$', 'g');
           // input = input.replace(regex, '<span class="emoticon ' + emoticons[i].class + '"></span>');
        }
        return input;
    };
});