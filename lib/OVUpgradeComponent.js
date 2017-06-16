'use strict';

const fs = require('fs');

const ANGULARJS_COMPONENT_EXTENSION = 'component.js';
const ANGULARJS_DIRECTIVE_EXTENSION = 'directive.js';
const ANGULAR2_DIRECTIVE_EXTENSION = 'directive.ts';

class OVUpgradeComponent {

    constructor(input, output) {
        // get the component input provided as parameter 
        // if not provided, look inside the current folder and retrieve the file with .ANGULARJS_COMPONENT_EXTENSION extension
        this.componentInput = input ?
            input :
            fs.readdirSync(process.cwd()).find((f) => f.includes(ANGULARJS_COMPONENT_EXTENSION));


        // check if a valid component input has been found
        this._checkInputError();

        // set the component output provided as parameter
        // if not provided, use the found one replacing the .ANGULARJS_COMPONENT_EXTENSION with .ANGULAR2_DIRECTIVE_EXTENSION
        this.componentOutput = output ?
            output :
            this.componentInput.includes(ANGULARJS_COMPONENT_EXTENSION) ?
            this.componentInput.replace(ANGULARJS_COMPONENT_EXTENSION, ANGULAR2_DIRECTIVE_EXTENSION) :
            this.componentInput + '.' + ANGULAR2_DIRECTIVE_EXTENSION;
    }


    generateUpgradedComponent() {
        this._checkInputError();
        this._readComponentInput();
    }



    _readComponentInput() {
        // read the component input file
        fs.readFile(this.componentInput, 'utf8', (err, contents) => {
            // replace all spaces inside the file contnet
            contents = contents.replace(/\s/g, '');
            // check if the provided content has a component defined inside or a directive
            let completeComponentName = contents.match(/component\((.)*,/gm)[0];
            // get the component name as camel case syntax as it is in the file
            this.componentName = completeComponentName.split('\'')[1];
            // convert from camel case to kebab-case
            this.componentNameDashes = this.componentName.replace(/[A-Z]/g, (el) => '-' + el.toLocaleLowerCase());

            // get all the bindings block of the component
            let completeBindings = contents.match(/bindings\:.*'}/g)[0];
            // get the bindings list of the component
            let fullBindings = completeBindings.split('{')[1].replace('}', '').split(',');

            // parse the bindings in order the get the names of the two way data bindings and all other bindings
            this.bindings = [];
            this.twoWayDataBindings = [];
            let param;
            fullBindings.map(extractBindings.bind(this, param));

            function extractBindings(param, el) {
                param = el.replace(/\'/g, '');
                param.split(':')[1].includes('=') ?
                    this.twoWayDataBindings.push(param.split(':')[0]) :
                    this.bindings.push(param.split(':')[0]);
            }

            this._parseTemplate();
        });

    }

    _parseTemplate() {

        fs.readFile('./lib/ng2-component-template.js', 'utf8', (err, contents) => {
            // inject selector
            let contentWithSelector = contents.replace('$$selector_dashes$$', this.componentNameDashes);
            // inject class name
            let contentWitClassNae = contentWithSelector.replace('$$class_name$$', this.componentName.charAt(0).toUpperCase() + this.componentName.substring(1) + 'Directive');
            // inject camel case selector as 
            let contentWitSelectorCamelCase = contentWitClassNae.replace('$$selector_camel_case$$', this.componentName);

            // inject all the inputs
            let inputs = this.bindings.concat(this.twoWayDataBindings).reduce(generateInputParams, '');
            let contentsWithInputs = contentWitSelectorCamelCase.replace('$$inputs$$', inputs);

            // inject all the outputs
            let outputs = this.twoWayDataBindings.reduce(generateOutputParams, '');
            let contentsWithOutputs = contentsWithInputs.replace('$$outputs$$', outputs);

            this._outputUpgradedComponent(contentsWithOutputs);

            function generateInputParams(acc, el, ind) {
                if (ind > 0) acc += '    ';
                return acc += `@Input() ${el}: any;\n`;
            }

            function generateOutputParams(acc, el, ind) {
                if (ind > 0) acc += '    ';
                return acc += `@Output() ${el}Change: EventEmitter < any >;\n`;
            }

        });

    }

    _outputUpgradedComponent(contentsWithOutputs) {
        // output the file
        fs.writeFile(this.componentOutput, contentsWithOutputs, onWriteFileCallback);

        function onWriteFileCallback(err) {
            if (err) {
                return console.log(err);
            }
            console.log("Upgraded version of component correctly generated");
        }

    }

    _checkInputError() {
        // if the input component has not be defined, throw an error
        if (!this.componentInput) {
            throw new Error('Please provide a valid location with a .component.js file or provide a specific AngularJS component file');
        }
    }


};

module.exports = OVUpgradeComponent;