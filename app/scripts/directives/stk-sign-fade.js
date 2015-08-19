/*global angular*/
(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name stockDogApp.directive:stkSignFade
     * @description
     * # stkSignFade
     */
    angular
        .module('stockDogApp')
        .directive('stkSignFade', function ($animate) {
            return {
                restrict: 'A',
                link: function ($scope, $element, $attrs) {
                    var oldVal = null;
                    // [1] Use $observe to be notified on value changes
                    $attrs.$observe('stkSignFade', function (newVal) {
                        if (oldVal && oldVal == newVal) { return; }
                        var oldPrice = parseFloat(oldVal),
                            newPrice = parseFloat(newVal);
                        oldVal = newVal;
                        // [2] Add the appropriate direction class, and then remove it
                        if (oldPrice && newPrice) {
                            var direction = newPrice - oldPrice >= 0 ? 'up' : 'down';
                            $animate
                                .addClass($element, 'change-' + direction)
                                .then(function () {
                                    $animate.removeClass($element, 'change-' + direction);
                                }); // function
                        } // if
                    }); // observe
                } // link
            }; // return
        }); // directive
}());
