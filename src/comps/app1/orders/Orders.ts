import {Component, ChangeDetectionStrategy, trigger, transition, animate, state, style} from "@angular/core";

@Component({
    selector: 'orders',
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
    styles: [`
        .page {
            padding-left: 100px;
            padding-top: 40px;
        }
    `],
    template: `
               <Sliderpanel style="padding: 200px">
                  <div>
                    <Slideritem class="page center order1 selected" [toDirection]="'left'" [to]="'order2'">
                      <h1>Order 1</h1>
                    </Slideritem>
                    <Slideritem class="page right order2" class="page right order2" [toDirection]="'left'" [fromDirection]="'right'" [from]="'order1'" [to]="'order3'">
                      <h1>Order 2</h1>
                    </Slideritem>
                    <Slideritem class="page right order3" [fromDirection]="'right'" [from]="'order2'" >
                      <h1>Order 3</h1>
                    </Slideritem>
                  </div>
                </Sliderpanel>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class Orders {
}

