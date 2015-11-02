app.service('EmoticonService', ['$sce', function ($sce) {
    var emoticons = [{ text: '\\:\\)', class: 'emoticon1' },
                    { text: '\\:\\(', class: 'emoticon2' },
                    { text: '\\:D', class: 'emoticon3' },
                    { text: '\\:p', class: 'emoticon4' }];

    this.searchEmoticon = function (input) {
        var newInput = input;

        //verification des liens
        html = new RegExp('(http|https)://[\\S]*', 'g');
        newInput = newInput.replace(html, function (test) {
            console.log(test);
            return '<a href="' + test + '" target="_blank">' + test + '</a>';
        });

        //verification des emoticones
        for (var i = 0, l = emoticons.length; i < l; i++) {
            regex = new RegExp(emoticons[i].text, 'g');
            newInput = newInput.replace(regex, function (test) {
                return '<span class="emoticon ' + emoticons[i].class + '"></span>'
            });
        }
        return $sce.trustAsHtml(newInput);
    };
}]);