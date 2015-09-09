app.directive('chatScroll', ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var hasLostFocus, manualScroll;
            var chatBox = element[0];
            var endOfChat = document.createElement('div');
            endOfChat.id = 'endOfChat'
            element.append(endOfChat);

            var watchHistory = scope.$watch('CC.messages', function (value) {
                if (value.length > 0) {
                    if (scope.CC.isHistory) {
                        $timeout(function () {
                            endOfChat.scrollIntoView(true);
                        },0)
                    }
                    watchHistory();
                }
            });

            $window.onblur = function () {
                hasLostFocus = true;
                manualScroll = true;
                if (scope.CC.onblur) {
                    scope.CC.onblur();
                }
            };

            $window.onfocus = function () {
                hasLostFocus = false;
                if (chatBox.scrollTop >= chatBox.scrollHeight - chatBox.offsetHeight - 20) {
                    manualScroll = false;
                }
                if (scope.CC.onfocus) {
                    scope.CC.onfocus();
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