import {Component, trigger, transition, animate, state, style} from "@angular/core";
// import * as bootbox from "bootbox";

@Component({
    selector: 'privileges',
    host: {
        '[@routeAnimation]': 'true',
        '[style.display]': "'block'",
        '[style.position]': "'absolute'"
    },
    animations: [
        trigger('routeAnimation', [
            state('*', style({opacity: 1})),
            transition('void => *', [
                style({opacity: 0}),
                animate(333)
            ]),
            transition('* => void', animate(333, style({opacity: 0})))
        ])
    ],
    template: `
        <div class="row">
             <h1>privileges</h1>
        </div>
    `
})
export class Privileges {

}

