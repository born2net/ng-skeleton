/**
 Custom Form string enforcer component compatible with both template and reactive forms

 While <input type="text> sort of works, it does not prevent the user
 from still entering invalid values via pasting wrong text, enter problematic characters such as &;
 and a number of other ways that users can find to screw your SQL database entries.

 This simple to use component will make sure you will never get anything but
 allowed values within your selected range (min,max, allowed characters, real time swapping of characters and more).. enjoy,

 currently this library swaps characters using the Lib.CleanCharForXml but
 you can easily change to any mechanism you like per your app needs.

 Sean

 =====================

 Originally based on examples from:
 http://almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel
 http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html



 /////////////////////////////////// api ///////////////////////////////////////////

 (onChange):                       notify when a change occurred, includes value and if change is from keUp or final value
 [defaultValue]="'FooBar'"         starting value as well as reset value, make sure it falls between your range values
 [safe]="true"                     allow only safe characters (see Lib.CleanCharForXml)
 [textholder]="'simple text'"      placeholder text
 [stringRangeMin]="2"              min value allowed
 [stringRangeMax]="4"              max value allowed
 [formControl]="someValue">        for reactive forms, or use ngModel


 /////////////////////////////////// example ///////////////////////////////////////////

 <InputString
 (onChange)="runMeAndShowValue($event)"
 [defaultValue]="'FooBar'"
 [safe]="true"
 [textholder]="'enter text'"
 [stringRangeMin]="3"
 [stringRangeMax]="6">
 [formControl]="someValue">
 </InputString>
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
import {Lib} from "../../Lib";

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
        return (c.value.length > +maxValue || c.value.length < +minValue) ? err : null;
    }
}

@Component({
    selector: 'InputString',
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
                   required 
                   (keyup)="onKeyUp($event)"
                   value="{{stringValue}}"                   
                   placeholder="{{placer}}"
                   type="text"                    
                   class="form-control" 
                   (blur)="onBlur($event)"/>
                   <!--
                   you can also use code below to always include an error as part of the component
                   required minlength="3"
                   <p *ngIf="!inputElement.checkValidity()">not valid</p>-->
			         <!--<pre>{{ inputElement.value | json }}-->
			       <!--</pre>-->
        </div>
  `,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputString),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => InputString),
        multi: true
    }]
})
export class InputString implements ControlValueAccessor, OnChanges {

    constructor(private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) {
    }

    @ViewChild('inputElement') inputElement: ElementRef;

    @Input('stringValue') _stringValue;

    @Input() stringRangeMax;

    @Input() stringRangeMin;

    @Input() safe:boolean = false;

    @Input() defaultValue = '';

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

    stringFixLength(i_value){
        return i_value.substr(0, this.stringRangeMax)
    }

    stringFixSafe(i_value){
        return Lib.CleanCharForXml(i_value)
    }

    onKeyUp(event) {
        if (!this.onKeyUpNotify)
            return;
        var v = event.target.value;
        if (v.length == 0)
            return;
        this.onBlur(event, true)
    }

    onBlur($event, fromKeyUp: boolean = false) {
        var s = $event.target.value;
        if (!fromKeyUp && (this.validateFn({value: s}))) {
            s = this.stringFixLength(s);
            this.writeValue(s);
        } else {
            this.writeValue(s);
        }

        /** fire custom input-blur so we can easily bind to any changes using our custom BlurForwarder directive **/
        this.renderer.invokeElementMethod(this.elRef.nativeElement, 'dispatchEvent', [new CustomEvent('input-blur', {bubbles: true})]);

        /** fire even for onChange and notify when final value is being delivered **/
        this.onChange.emit({
            value: s,
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


    get stringValue() {
        return this._stringValue;
    }

    set stringValue(val) {
        this._stringValue = val;
        this.propagateChange.forEach(fn => fn(val));
    }

    ngOnChanges(inputs) {
        if (inputs.stringRangeMax || inputs.stringRangeMin) {
            this.validateFn = createCounterRangeValidator(this.stringRangeMax, this.stringRangeMin);
        }
    }

    writeValue(value) {
        if (_.isUndefined(value))
            return;
        if (this.safe){
            value = this.stringFixSafe(value);
        }
        this.stringValue = value;
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