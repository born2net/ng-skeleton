import {Component, trigger, transition, animate, state, style} from "@angular/core";
import {SelectItem} from 'primeng/primeng';

export class MyModel {

    cities: SelectItem[];

    selectedCity: string;

    constructor() {
        this.cities = [];
        this.cities.push({label: 'Select City', value: null});
        this.cities.push({label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}});
        this.cities.push({label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}});
        this.cities.push({label: 'London', value: {id: 3, name: 'London', code: 'LDN'}});
        this.cities.push({label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}});
        this.cities.push({label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}});
    }

}

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
        <hr/>
        <h4>ng-prime dropdown</h4>
        <div class="row">
             <p-dropdown [options]="cities" [(ngModel)]="selectedCity"></p-dropdown>
        </div>
        <hr/>
        <h4>ng-bootstrap dropdown</h4>
        <div class="btn-group" dropdown (click)="$event.preventDefault()">
          <button id="single-button" type="button" class="btn btn-primary" dropdownToggle>
            Button dropdown <span class="caret"></span>
          </button>
          <ul dropdownMenu role="menu" aria-labelledby="single-button">
            <li role="menuitem"><a class="dropdown-item" href="#">Action</a></li>
            <li role="menuitem"><a class="dropdown-item" href="#">Another action</a></li>
            <li role="menuitem"><a class="dropdown-item" href="#">Something else here</a></li>
            <li class="divider dropdown-divider"></li>
            <li role="menuitem"><a class="dropdown-item" href="#">Separated link</a></li>
          </ul>
        </div>
    `
})
export class Privileges {
    cities: SelectItem[];
    selectedCity: string;
    constructor() {
        this.cities = [];
        this.cities.push({label: 'Select City', value: null});
        this.cities.push({label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}});
        this.cities.push({label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}});
        this.cities.push({label: 'London', value: {id: 3, name: 'London', code: 'LDN'}});
        this.cities.push({label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}});
        this.cities.push({label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}});
    }
}


