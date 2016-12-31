import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "../compbaser/Compbaser";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {Observable} from "rxjs";

@Component({
    selector: 'AutoLogin',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<h5 style="padding-left: 10px"><span class="fa fa-key"></span> verifying access...</h5>`
})
export class AutoLogin extends Compbaser {
}