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