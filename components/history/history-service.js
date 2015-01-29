/**
 * Created by jakub on 28.1.15.
 */
angular.module('calcApp.historyService', [])
    .service('historyService', function () {

        this.push = function (entry) {
            entry.timestamp = new Date();
            var history = this.list();
            history.push(entry);
            localStorage.setItem('calcHistory', JSON.stringify(history));
            console.log('Inserted item:');
            console.log(entry);
        };

        this.list = function () {
            return localStorage.getItem('calcHistory') === null ? [] : JSON.parse(localStorage.getItem('calcHistory'));
        };

        this.clear = function() {
            localStorage.removeItem('calcHistory');
            console.log('Cleared history.');
        };
    });