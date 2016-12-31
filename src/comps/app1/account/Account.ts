import {Component, ChangeDetectionStrategy, trigger, transition, animate, state, style} from "@angular/core";

@Component({
    selector: 'account',
    host: {
        '[@routeAnimation]': 'true',
        '[style.display]': "'block'"
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
    template: `<Twofactor></Twofactor>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class Account {


}

