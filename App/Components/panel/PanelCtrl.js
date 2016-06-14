app.controller('PanelCtrl', [function () {
    this.plugins = [
        {
            label: 'quizz',
            view : 'Components/quizz/quizzView.html'
        }
    ]
    this.selectPlugin = this.plugins[0];
}])
