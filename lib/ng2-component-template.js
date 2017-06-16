import { Input, Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: '$$selector_dashes$$'
})
export class $$class_name$$ extends UpgradeComponent {

    $$inputs$$
    $$outputs$$

    constructor(elementRef: ElementRef, injector: Injector) {
        super('$$selector_camel_case$$', elementRef, injector);
    }
}