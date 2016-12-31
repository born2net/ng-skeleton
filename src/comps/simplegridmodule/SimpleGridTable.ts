import {
    Component,
    ChangeDetectionStrategy,
    Input,
    ContentChildren,
    QueryList
} from "@angular/core";
import {SimpleGridRecord} from "./SimpleGridRecord";

@Component({
    selector: 'simpleGridTable',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .simpleTable {
            background-color: white;
        }
        
        * {
            font-size: 0.9em;
        }
    `],
    template: `
        <table class="table simpleTable">
            <ng-content></ng-content>
        </table>      
    `,
})

export class SimpleGridTable {
    @Input() sort;

    @Input() list;

    private selected;

    @ContentChildren(SimpleGridRecord) simpleGridRecord: QueryList<SimpleGridRecord>;

    public setSelected(i_selected: SimpleGridRecord) {
        this.deselect();
        this.selected = i_selected;
        // var rec = i_selected.item;
        // console.log(`user selected ${rec.getBusinessId()}  ${rec.getName()} ${rec.getAccessMask()}`);
    }

    public deselect() {
        this.selected = null;
        if (!this.simpleGridRecord)
            return;
        this.simpleGridRecord.map((i_simpleGridRecord: SimpleGridRecord) => {
            i_simpleGridRecord.selectedClass = false;
        })
    }

    public getSelected(): SimpleGridRecord {
        return this.selected;
    }
}
