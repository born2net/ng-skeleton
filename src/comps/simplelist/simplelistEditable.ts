import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ApplicationRef} from "@angular/core";

@Component({
    selector: 'simplelistEditable',
    template: `
                <span *ngIf="!m_editing" class="li-content pull-left">{{getContent(item)}}</span>
                <input #editInput *ngIf="m_editing && editable" [(ngModel)]="m_value" class="li-content pull-left"  value="{{getContent(item)}}" />
                <span *ngIf="editable" (click)="onEdit(true)" class="editable fa {{m_icon}} pull-right"></span>
    `,
    styleUrls: ['./simplelist.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class simplelistEditable {
    constructor(private app:ApplicationRef, private ref:ChangeDetectorRef) {
    }

    @Input()
    item;
    @Input()
    content:((any)=>string);
    @Input()
    editable:boolean = false;
    @Output()
    editChange:EventEmitter<any> = new EventEmitter();

    private m_editing:boolean = false;
    private m_icon:string = 'fa-edit';
    private m_value:string = '';

    private onEdit(changed:boolean) {
        if (this.m_editing) {
            var delay = 100;
            this.m_icon = 'fa-edit';
            if (changed)
                this.editChange.emit({item: this.item, value: this.m_value});
        } else {
            var delay = 0;
            this.m_icon = 'fa-check';
        }
        this.updateDetection();
        // use small delay so you don't see a skip in data appending
        setTimeout(()=> {
            this.m_editing = !this.m_editing
            this.updateDetection();
        }, delay);
    }

    private updateDetection(){
        this.ref.markForCheck();
    }

    private getContent(item):string {
        if (this.content) {
            return this.content(item);
        } else {
            return item;
        }
    }

}

