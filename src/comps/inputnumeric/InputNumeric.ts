/**
 Custom Form numeric enforcer component compatible with both template and reactive forms

 While <input type="number> sort of works, it does not prevent the user
 from still entering invalid values via pasting wrong text, enter the letter 'e'
 and a number of other ways that users can find to screw your SQL numeric only database entries.

 This simple to use component will make sure you will never get anything but
 allowed values within your selected range (+, -, decimal point).. enjoy,

 Sean

=====================

 Originally based on examples from:
     http://almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel
     http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html



/////////////////////////////////// api ///////////////////////////////////////////

 (onChange):                        notify when a change occurred, includes value and if change is from keUp or final value
 [defaultValue]="88"                starting value as well as reset value, make sure it falls between your range values
 [step]="0.1"                       options include 'any', 1, 0.1, 0.5 ...
 [round]="true"                     if you set round to true be sure to set step to 1
 [textholder]="'numbers please'"    placeholder text
 [counterRangeMin]="-10.5"          min value allowed
 [counterRangeMax]="102"            max value allowed
 [formControl]="someValue">         for reactive forms, or use ngModel

 /////////////////////////////////// example ///////////////////////////////////////////

 <InputNumeric
     (onChange)="runMeAndShowValue($event)"
     [defaultValue]="88"
     [step]="0.1"
     [round]="true"
     [textholder]="'numbers please'"
     [counterRangeMin]="-10.5"
     [counterRangeMax]="102"
     [formControl]="someValue">
 </InputNumeric>
 <small [hidden]="contGroup.controls.duration.valid || contGroup.controls.duration.pristine">invalid value</small>

 and add CSS

 .ng-valid[required] { border-left: 5px solid green; }
 .ng-invalid { border-left: 5px solid red; }
 **/

import {
    Component,
    forwardRef,
    Input,
    OnChanges,
    ElementRef,
    Renderer,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,
    Output,
    EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import {
    FormControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS
} from "@angular/forms";

export function createCounterRangeValidator(maxValue, minValue) {
    return (c: FormControl) => {
        let err = {
            rangeError: {
                given: c.value,
                max: maxValue || 10,
                min: minValue || 0
            }
        };
        // console.log('value: ' + c.value);
        return (c.value > +maxValue || c.value < +minValue) ? err : null;
    }
}

@Component({
    selector: 'InputNumeric',
    host: {
        '(blur)': 'onBlur($event)'
    },
    styles: [`        
       :host(.ng-invalid input) {
            border-left: 3px solid red;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div (click)="$event.preventDefault()">
            <input #inputElement
                   (keyup)="onKeyUp($event)"
                   value="{{counterValue}}"                   
                   min="{{counterRangeMin}}"
                   max="{{counterRangeMax}}"
                   step="{{step}}"
                   placeholder="{{placer}}"
                   type="number"                    
                   class="form-control" 
                   (blur)="onBlur($event)"/>
        </div>
  `,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputNumeric),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => InputNumeric),
        multi: true
    }]
})
export class InputNumeric implements ControlValueAccessor, OnChanges {

    constructor(private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) {
    }

    @ViewChild('inputElement') inputElement: ElementRef;

    @Input('counterValue') _counterValue;

    @Input() counterRangeMax;

    @Input() counterRangeMin;

    @Input() round:boolean = false;

    @Input() defaultValue = 0;

    @Input() step = 1;

    @Input() onKeyUpNotify:boolean = false;

    @Input()
    set textholder(i_placer: string) {
        this.placer = i_placer;
    }

    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {
        this.writeValue(this.defaultValue);
    }

    private placer: string = ''

    onKeyUp(event) {
        if (!this.onKeyUpNotify)
            return;
        var v = event.target.value;
        if (v.length == 0)
            return;
        this.onBlur(event, true)
    }

    onBlur($event, fromKeyUp: boolean = false) {
        var n = Number($event.target.value);
        if (_.isNaN(n)) {
            n = this.defaultValue;
            this.writeValue(n);
        } else if (!fromKeyUp && (this.validateFn({value: n}))) {
            n = this.defaultValue;
            this.writeValue(n);
        } else {
            this.writeValue(n);
        }

        /** fire custom input-blur so we can easily bind to any changes using our custom BlurForwarder directive **/
        this.renderer.invokeElementMethod(this.elRef.nativeElement, 'dispatchEvent', [new CustomEvent('input-blur', {bubbles: true})]);

        /** fire even for onChange and notify when final value is being delivered **/
        this.onChange.emit({
            value: n,
            finalValue: !fromKeyUp
        });

        // or just
        // el.dispatchEvent(new CustomEvent('input-blur', { bubbles: true }));
        // if you don't care about outside dom compatibility
        this.cd.markForCheck();
    }

    propagateChange: any[] = [];
    validateFn: any = () => {
    };


    get counterValue() {
        return this._counterValue;
    }

    set counterValue(val) {
        this._counterValue = val;
        this.propagateChange.forEach(fn => fn(val));
    }

    ngOnChanges(inputs) {
        if (inputs.counterRangeMax || inputs.counterRangeMin) {
            this.validateFn = createCounterRangeValidator(this.counterRangeMax, this.counterRangeMin);
        }
    }

    writeValue(value) {
        if (_.isUndefined(value))
            return;
        if (this.round){
            value = Math.round(value);
        }
        this.counterValue = value;
        this.cd.markForCheck();
        // this.inputElement.nativeElement.value = value;

    }

    registerOnChange(fn) {
        this.propagateChange.push(fn);
    }

    registerOnTouched(fn) {
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }
}