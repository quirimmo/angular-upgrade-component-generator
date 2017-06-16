'use strict';

const fs = require('fs');

class OVUpgradeComponent {

    constructor(input, output) {

        let componentInput = input ?
            input :
            fs.readdirSync(process.cwd()).find((f) => f.includes('.component.js'));

        let componentOutput = output ?
            output :
            componentInput.includes('component.js') ?
            componentInput.replace('component.js', 'directive.ts') :
            componentInput + '.directive.ts';


        fs.readFile(componentInput, 'utf8', function(err, contents) {
            contents = contents.replace(/\s/g, '');
            let completeComponentName = contents.match(/component\((.)*,/gm)[0];
            let componentName = completeComponentName.split('\'')[1];
            let componentNameDashes = componentName.replace(/[A-Z]/g, (el) => '-' + el.toLocaleLowerCase());

            let completeBindings = contents.match(/bindings\:.*'}/g)[0];
            let fullBindings = completeBindings.split('{')[1].replace('}', '').split(',');
            let bindings = [];
            let twoWayDataBindings = [];
            let param;
            fullBindings.map((el) => {
                param = el.replace(/\'/g, '');
                param.split(':')[1].includes('=') ?
                    twoWayDataBindings.push(param.split(':')[0]) :
                    bindings.push(param.split(':')[0]);
            });

            fs.readFile('./lib/ng2-component-template.js', 'utf8', function(err, contents) {
                let contentWithSelector = contents.replace('$$selector_dashes$$', componentNameDashes);
                let contentWitClassNae = contentWithSelector.replace('$$class_name$$', componentName.charAt(0).toUpperCase() + componentName.substring(1) + 'Directive');
                let contentWitSelectorCamelCase = contentWitClassNae.replace('$$selector_camel_case$$', componentName);

                let inputs = bindings.concat(twoWayDataBindings).reduce((acc, el, ind, arr) => {
                    if (ind > 0) acc += '    ';
                    return acc += `@Input() ${el}: any;\n`;
                }, '');
                let contentsWithInputs = contentWitSelectorCamelCase.replace('$$inputs$$', inputs);

                let outputs = twoWayDataBindings.reduce((acc, el, ind, arr) => {
                    if (ind > 0) acc += '    ';
                    return acc += `@Output() ${el}Change: EventEmitter < any >;\n`;
                }, '');
                let contentsWithOutputs = contentsWithInputs.replace('$$outputs$$', outputs);

                fs.writeFile(componentOutput, contentsWithOutputs, function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("Upgraded version of component correctly generated");
                });
            });
        });
    }

};

module.exports = OVUpgradeComponent;