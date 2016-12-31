import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    ViewChild,
    ChangeDetectorRef,
    ElementRef,
    NgZone,
    HostListener
} from "@angular/core";
import {List} from "immutable";
import {simplelistEditable} from "./simplelistEditable";
import * as _ from "lodash";

export interface IsimplelistItem {
    item: any,
    index: number,
    selected: boolean
}

@Component({
    selector: 'simplelist',
    templateUrl: './simplelist.html',
    styleUrls: ['./simplelist.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class simplelist {


    constructor(private cd: ChangeDetectorRef) {
    }

    /**
     constructor(private cd: ChangeDetectorRef, private _ngZone: NgZone, private el: ElementRef) {}

     worked on canceling scroll event
     ngOnInit() {
        this._ngZone.runOutsideAngular(() => {
            const nativeElement = this.el.nativeElement;
            this._handler = $event => {
                $event.stopImmediatePropagation();
                $event.preventDefault();
                // this.emitter.emit($event);
                return false;
            }
            nativeElement.addEventListener('mousewheel', this._handler, false);
            nativeElement.addEventListener('DOMMouseScroll', this._handler, false);
            nativeElement.addEventListener('onmousewheel', this._handler, false);
        });
    }

     @Output('outSideEventHandler')
     emitter = new EventEmitter();

     private _handler: Function;
     **/

    private filter: string = '';
    private m_icon: string;
    private m_iconCallback: ((a: number, b: any) => string);
    private m_iconInstanceOfFunction: boolean;
    private m_editing: boolean = false;
    private m_iconSelected: string = '';
    private m_iconSelectedIndex: number = -1;
    private m_iconSelectedMode: boolean = false;
    private m_metadata: any = {};
    // private m_metadata: { [key: string]: IsimplelistItem } = {};

    ngAfterViewInit() {
        // if (this.simplelistEditable)
        //     this.simplelistEditable.setContent(this.content)
    }

    @ViewChild(simplelistEditable)
    simplelistEditable: simplelistEditable;


    @Input()
    list: List<any>;

    @Input()
    editable: boolean = false;

    @Input()
    content: ((any)=>string);

    @Input()
    contentId: ((any)=>string);

    @Input()
    multiSelect: boolean = true;

    @Input()
    iconSelected: ((index: number, item: any)=>boolean);

    @Input()
    set icon(i_icon: any) {
        this.m_icon = i_icon;
    }

    @Input()
    set iconCallback(i_iconCallback: ((a: number, b: any) => string)) {
        this.m_iconCallback = i_iconCallback;
    }

    @Input()
    set iconSelectiondMode(mode: boolean) {
        if (mode) {
            this.m_iconSelectedMode = true;
            this.m_icon = 'fa-circle-o'
            this.m_iconSelected = 'fa-check-circle'
        }
    }

    // @Output()
    // hover: EventEmitter<any> = new EventEmitter();

    @Output()
    iconClicked: EventEmitter<any> = new EventEmitter();

    @Output()
    itemClicked: EventEmitter<any> = new EventEmitter();

    @Output()
    selected: EventEmitter<any> = new EventEmitter();

    @Output()
    edited: EventEmitter<any> = new EventEmitter();


    private onEditChanged(event) {
        this.edited.emit((event))
    }

    private itemSelected(item, index) {
        this.itemClicked.emit({
            item,
            index
        });
        let id = this.contentId ? this.contentId(item) : index;
        for (let id in this.m_metadata) {
            this.m_metadata[id] = {
                selected: false
            }
        }
        this.m_metadata[id] = {
            item: item,
            index: index,
            selected: true //this.m_editClickPending ? true : !this.m_metadata[id].selected

        }
        this.selected.emit(this.m_metadata);
    }

    private renderIcon(index, item) {
        if (this.m_iconSelectedMode) {
            if (this.iconSelected) {
                if (this.iconSelected(index, item)) {
                    this.m_iconSelectedIndex = index;
                    return this.m_iconSelected;
                } else {
                    return this.m_icon;
                }
            }
            if (index == this.m_iconSelectedIndex)
                return this.m_iconSelected;
            return this.m_icon;
        } else {
            if (!this.m_iconInstanceOfFunction)
                this.m_iconInstanceOfFunction = (this.m_iconCallback instanceof Function);
            if (this.m_iconInstanceOfFunction) {
                return this.m_iconCallback(index, item);
            }
            return this.m_icon;
        }
    }

    public itemAllSelected() {
        if (!this.multiSelect)
            return;
        for (let id in this.m_metadata)
            this.m_metadata[id].selected = true;
        this.list.forEach((i_item) => {
            this.selected.emit(this.m_metadata);
        })
    }

    private onIconClick(event, index) {
        var self = this;
        // this.m_editClickPending = true;
        this.m_iconSelectedIndex = index;
        setTimeout(() => {
            let match = _.find(self.m_metadata, (i: any) => i.index == index);
            // console.log(match.item.getBusinessId() + ' ' + match.item.getKey('name'));
            this.iconClicked.emit({
                item: match,
                target: event.target,
                index: index,
                metadata: this.m_metadata
            });
        }, 1)
        return true;
    }

    private getMetadata(index, item) {
        let id = this.contentId ? this.contentId(item) : index;
        return this.m_metadata[id];
    }

    public setContent(f) {
        this.content = f;
        // this.simplelistEditable.setContent(this.content)
    }

    public getContentId(item, index): string {
        let id = this.contentId ? this.contentId(item) : index;
        if (!this.m_metadata[id])
            this.m_metadata[id] = {};
        this.m_metadata[id].index = index;
        return id;
    }

    private getContent(item): string {
        if (this.content) {
            return this.content(item);
        } else {
            return item;
        }
    }

    public deselect() {
        this.itemSelected(null, -1);
        this.cd.markForCheck();
    }

    public getSelected(): IsimplelistItem | { [key: string]: IsimplelistItem } {
        if (this.multiSelect)
            return this.m_metadata;
        for (let v in this.m_metadata) {
            if (this.m_metadata[v].selected == true)
                return this.m_metadata[v];
        }
    }

    public set selectedIconIndex(i_index) {
        this.m_iconSelectedIndex = i_index;
    }

    public get selectedIconIndex() {
        return this.m_iconSelectedIndex;
    }
}