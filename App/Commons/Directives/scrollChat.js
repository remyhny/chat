app.directive('chatScroll', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var hasLostFocus, manualScroll;
            var chatBox = element[0];
            var endOfChat = document.createElement('div');
            endOfChat.id = 'endOfChat'
            element.append(endOfChat);


            $window.onblur = function () {
                hasLostFocus = true;
                manualScroll = true;
            };

            $window.onfocus = function () {
                hasLostFocus = false;
                if (chatBox.scrollTop >= chatBox.scrollHeight - chatBox.offsetHeight - 20) {
                    manualScroll = false;
                }
            };

            var scrollToEndOfChat = function () {
                if (manualScroll || hasLostFocus) return;
                endOfChat.scrollIntoView(true);
            };

            scope.$watch('CC.messages.length', function () {
                if (scope.CC.messages.length > 0) {
                    scrollToEndOfChat();
                }
            });

            chatBox.onscroll = function () {
                if (chatBox) {
                    if (chatBox.scrollTop >= chatBox.scrollHeight - chatBox.offsetHeight - 20) {
                        manualScroll = false;
                    } else {
                        if (!manualScroll) {
                            manualScroll = true;
                        }
                    }
                }
            };

        }
    };
}]);