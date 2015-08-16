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
            // [3] Helper: Use lodash to find a watchlist with given ID
            var Model = null,
                findById = function (listId) {
                    return _.find(Model.watchlists, function (watchlist) {
                        return watchlist.id === parseInt(listId, 10);
                    });
                }, // findById
                // [2] Helper: Save watchlists to localStorage
                saveModel = function () {
                    localStorage['StockDog.watchlists'] = JSON.stringify(Model.watchlists);
                    localStorage['StockDog.nextId'] = Model.nextId;
                }, // saveModel
                // Augment Stocks with additional helper functions
                StockModel = {
                    save: function () {
                        var watchlist = findById(this.listId);
                        watchlist.recalculate();
                        saveModel();
                    } // save
                }, // StockModel
                // Augment Watchlists with additional helper functions
                WatchlistModel = {
                    addStock: function (stock) {
                        var existingStock = _.find(this.stocks, function (s) {
                            return s.company.symbol === stock.company.symbol;
                        });
                        if (existingStock) {
                            existingStock.shares += stock.shares;
                        } else {
                            _.extend(stock, StockModel);
                            this.stocks.push(stock);
                        }
                        this.recalculate();
                        saveModel();
                    }, // addStock
                    removeStock: function (stock) {
                        _.remove(this.stocks, function (s) {
                            return s.company.symbol === stock.company.symbol;
                        });
                        this.recalculate();
                        saveModel();
                    }, // removeStock
                    recalculate: function () {
                        var calcs = _.reduce(this.stocks, function (calcs, stock) {
                            calcs.shares += stock.shares;
                            calcs.marketValue += stock.marketValue;
                            calcs.dayChange += stock.dayChange;
                            return calcs;
                        }, { shares: 0, marketValue: 0, dayChange: 0 });

                        this.shares = calcs.shares;
                        this.marketValue = calcs.marketValue;
                        this.dayChange = calcs.dayChange;
                    } // recalculate
                }, // WatchlistModel
                // [1] Helper: Load watchlists from localStorage
                loadModel = function () {
                    var model = {
                        watchlists: localStorage['StockDog.watchlists'] ?
                                JSON.parse(localStorage['StockDog.watchlists']) : [],
                        nextId: localStorage['StockDog.nextId'] ?
                                parseInt(localStorage['StockDog.nextId'], 10) : 0
                    };
                    _.each(model.watchlists, function (watchlist) {
                        _.extend(watchlist, WatchlistModel);
                        _.each(watchlist.stocks, function (stock) {
                            _.extend(stock, StockModel);
                        });
                    });
                    return model;
                }; // loadModel

            // [4] Return all watchlists or find by given ID
            this.query = function (listId) {
                if (listId) {
                    return findById(listId);
                }
                return Model.watchlists;
            }; // query

            // [5] Save a new watchlist to watchlists model
            this.save = function (watchlist) {
                //Model.nextId += 1;
                watchlist.id = Model.nextId++;
                watchlist.stocks = [];
                _.extend(watchlist, WatchlistModel);
                Model.watchlists.push(watchlist);
                saveModel();
            }; // save

            // [6] Remove given watchlist from watchlists model
            this.remove = function (watchlist) {
                _.remove(Model.watchlists, function (list) {
                    return list.id === watchlist.id;
                });
                saveModel();
            }; // remove

            // [7] Initialize Model for this singleton service
            Model = loadModel();
            /*jslint nomen: false*/
        }); // WatchlistService
}());
