(function() {
    'use strict';

    angular.module('my-ng-module')

    .component('sampleComponent', {
        controller: 'SampleComponentController',
        controllerAs: 'vm',
        templateUrl: 'mytemplateURL.html',
        bindings: {
            customer: '=ngModel',
            test: '@'
        }
    });
})();