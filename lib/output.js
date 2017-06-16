import { Input, Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: 'ov-open-account-eligibility-form-panel'
})
export class OvOpenAccountEligibilityFormPanelDirective extends UpgradeComponent {

    @Input() customer: any;
    @Input() test: any;


    constructor(elementRef: ElementRef, injector: Injector) {
        super('ovOpenAccountEligibilityFormPanel', elementRef, injector);
    }
}