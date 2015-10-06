app.service('EmoticonService', function () {
    var emoticons = [{ text: '\\:\\)', class: 'emoticon1' },
                    { text: '\\:\\(', class: 'emoticon2' },
                    { text: '\\:D', class: 'emoticon3' }];

    this.searchEmoticon = function (input) {
        var newInput = input;
        for (var i = 0, l = emoticons.length; i < l; i++) {
            //regex = new RegExp('^(' + emoticons[i].text + ')\\s|\\s(' + emoticons[i].text + ')\\s|\\s(' + emoticons[i].text + ')$|^(' + emoticons[i].text + ')$', 'g');
            regex = new RegExp(emoticons[i].text, 'g');

            newInput = newInput.replace(regex, function (test) {
                return '<span class="emoticon ' + emoticons[i].class + '"></span>'
            });
        }
        return newInput;
    };
});