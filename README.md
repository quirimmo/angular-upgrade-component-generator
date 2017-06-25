# ov-upgrade-component-generator

This is a global node module used in order to autogenerate an upgraded Angular2 Directive from an AngularJS component, following the [Angular Upgrade Convention](https://angular.io/guide/upgrade) and using the **ng-upgrade-module**.

A really good sample of application mixing up Angular and AngularJS can be found here: [Angular/AngularJS Mixing Sample](https://github.com/vsavkin/upgrade-book-examples).

## Installation

In order to install the module just type: 

`npm install -g ov-upgrade-component-generator`

You can also install that not globally, but for the current usage, a global installation would be preferred.

## Description

This module takes as input an *AngularJS* component and it gives as output and *Angular* directive in order to use your AngularJS component inside an Angular module. 

## Usage

In order to use the upgrade generator it is quite simple. After you installed it, you will have the following command available on your system: `ov-upgrade-component`

There are mainly 3 ways to use the current module:

1. Just type inside a folder the following command without providing any parameter:

   `ov-upgrade-component`

   In this way the module will automatically look for a file with extension *.component.js* inside the current folder where you executed the command. It will parse that file and it will give as output a *.directive.ts* file in the same location you ran the command, which corresponds to the upgraded component ready to be used inside your Angular modules.

2. Providing the **input** parameter when executing the command in the following way:

   `ov-upgrade-component input=pathtocomponent.js`

   In this way the module will use the provided path in order to read the file, parse it, and generate in the same location of the given input file, the corresponding output file.

3. Providing the **output** parameter when executing the command in the following way:

   `ov-upgrade-component output=pathofoutput.ts`

   In this way the module will use the provided path in order to output the file.

## Sample

Considering the following ng1 component:

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

the output as ng2 directive will be:

    import { Input, Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
    import { UpgradeComponent } from '@angular/upgrade/static';

    @Directive({
        selector: 'sample-component'
    })
    export class SampleComponentDirective extends UpgradeComponent {

        @Input() test: any;
        @Input() customer: any;

        @Output() customerChange: EventEmitter < any >;


        constructor(elementRef: ElementRef, injector: Injector) {
            super('sampleComponent', elementRef, injector);
        }
    }