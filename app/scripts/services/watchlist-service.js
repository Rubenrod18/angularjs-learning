/*global angular, localStorage*/
(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name stockDogApp.WatchlistService
     * @description
     * # WatchlistService
     * Service in the stockDogApp.
     */
    angular
        .module('stockDogApp')
        .service('WatchlistService', function WatchlistService() {
            /*jslint nomen: true*/
            // AngularJS will instantiate a singleton by calling "new" on this function
            // [1] Helper: Load watchlists from localStorage
            var loadModel = function () {
                var model = {
                    watchlists: localStorage['StockDog.watchlists'] ?
                            JSON.parse(localStorage['StockDog.watchlists']) : [],
                    nextId: localStorage['StockDog.nextId'] ?
                            parseInt(localStorage['StockDog.nextId'], 10) : 0
                };
                return model;
            },
                // [7] Initialize Model for this singleton service
                Model = loadModel(),
                // [2] Helper: Save watchlists to localStorage
                saveModel = function () {
                    localStorage['StockDog.watchlists'] = JSON.stringify(Model.watchlists);
                    localStorage['StockDog.nextId'] = Model.nextId;
                },
                // [3] Helper: Use lodash to find a watchlist with given ID
                findById = function (listId) {
                    return _.find(Model.watchlists, function (watchlist) {
                        return watchlist.id === parseInt(listId, 10);
                    });
                };

            // [4] Return all watchlists or find by given ID
            this.query = function (listId) {
                if (listId) {
                    return findById(listId);
                } // if
                return Model.watchlists;
            };

            // [5] Save a new watchlist to watchlists model
            this.save = function (watchlist) {
                Model.nextId += 1;
                watchlist.id = Model.nextId;
                Model.watchlists.push(watchlist);
                saveModel();
            };

            // [6] Remove given watchlist from watchlists model
            this.remove = function (watchlist) {
                _.remove(Model.watchlists, function (list) {
                    return list.id === watchlist.id;
                });
                saveModel();
            };
            /*jslint nomen: false*/
        });
}());
