import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "../../compbaser/Compbaser";
import {ApplicationState} from "../../../store/application-state";
import {Store} from "@ngrx/store";
import {UserModel} from "../../../models/UserModel";
import {Observable} from "rxjs";

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

    constructor(private store: Store<ApplicationState>) {
        super();
        this.userModel$ = this.store.select(store => store.appDb.userModel);
    }

    destroy() {
    }
}