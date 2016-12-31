import {Component} from "@angular/core";


@Component({
    selector: 'EntryPanel',
    template: `
                <!--<a [routerLink]="['/App1']">And back to Test1</a><br/>-->
                <!--<a [routerLink]="['/EntryPanel', {id: 1111}, 'Route3']">Login {{someId}}</a><br/>-->
                <!--<a [routerLink]="['/EntryPanel', {id: 1111}, 'Route4']">Forgot pass {{someId}}</a><br/>-->
                <small>I am entrypanel component and I am inside main App</small>
                <router-outlet></router-outlet>`
})
export class EntryPanel {
    // constructor(params:RouteParams, commBroker:CommBroker) {
    //     if (params.get('id') != null) {
    //         commBroker.setValue(Consts.Values().USER_NAME, params.get('id'));
    //     } else {
    //         commBroker.setValue(Consts.Values().USER_NAME, 'foo-bar');
    //     }
    //
    // }
}