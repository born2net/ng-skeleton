import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange} from '@angular/core'

@Component({
    selector: 'InputEdit',
    styles: [`
        label {
            padding: 0;
            margin: 0;
        }
        .editableLabel {
            cursor: pointer;
        }
        input {
            padding: 0;
            margin: 0;
        }
        a {
            cursor: pointer;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <label [ngStyle]="_style.label" class="editableLabel"  *ngIf="!_editing" (click)="onEdit(true)">{{_value}}</label>
        <i *ngIf="!_editing && showIcon" [ngStyle]="_style.editIcon" (click)="onEdit(true)" class="editableLabel fa fa-edit"></i>
         <span *ngIf="_editing">
            <input [ngStyle]="_style.input"  value="{{_value}}" type="{{_type}}" [(ngModel)]="_value"/>
                <a (click)="onEdit(false)" class="editableLabel fa fa-check"></a>
         </span>
    `

})
//style="font-size: {{_size}}"
export class InputEdit {

    private _value:string = '';
    private _editable:boolean = false;
    private _editing:boolean = false;
    private _size:string = '2em';

    @Input()
    set value(i_value:string) {
        this._value = i_value
    }

    @Input()
    set editable(i_editable) {
        this._editable = i_editable;
    }

    @Input('type')
    _type:string = 'text';
    @Input('style')
    _style:Object = {};
    @Input()
    showIcon:boolean = true;

    @Output()
    labelEdited:EventEmitter<any> = new EventEmitter();

    onEdit(value:boolean) {
        if (!this._editable)
            return;
        this._editing = value;
        if (this._editing)
            return;
        this.labelEdited.emit(this._value);
        if (this._type == 'password')
            this._value = '*********';
    }
}