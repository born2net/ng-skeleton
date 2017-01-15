import {Component, ChangeDetectionStrategy, Inject} from "@angular/core";
import {ApplicationState} from "../../../store/application-state";
import {Store} from "@ngrx/store";
import {UserModel} from "../../../models/UserModel";
import {Observable} from "rxjs";
import {Compbaser} from "ng-mslib";

@Component({
    selector: 'Dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <h2>Dashboard</h2>
               <h4>user name: {{(userModel$ | async)?.getUser() }}</h4>
               <h4>account type: {{(userModel$ | async)?.getAccountType()}}</h4>
           `,
})
export class Dashboard extends Compbaser {
    private userModel$: Observable<UserModel>;

    constructor(private store: Store<ApplicationState>, @Inject('OFFLINE_ENV') private offlineEnv) {
        super();
        this.userModel$ = this.store.select(store => store.appDb.userModel);
    }

    destroy() {
    }
}