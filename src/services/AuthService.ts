import {Injectable, Inject, forwardRef} from "@angular/core";
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from "@angular/router";
import {LocalStorage} from "./LocalStorage";
import {StoreService} from "./StoreService";
import "rxjs/add/observable/fromPromise";
import {Observable} from "rxjs/Observable";
import {Map} from "immutable";
import {Ngmslib} from "ng-mslib";
import * as _ from "lodash";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {AuthenticateFlags} from "../store/actions/app-db-actions";
import {UserModel} from "../models/UserModel";
import {EFFECT_AUTH_START, EFFECT_TWO_FACTOR_AUTH} from "../store/effects/app-db-effects";

@Injectable()
export class AuthService {
    private userModel: UserModel;

    constructor(private router: Router,
                @Inject(forwardRef(() => Store)) private store: Store<ApplicationState>,
                @Inject(forwardRef(() => LocalStorage)) private localStorage: LocalStorage,
                @Inject(forwardRef(() => StoreService)) private storeService: StoreService,
                private activatedRoute: ActivatedRoute) {

        this.store.select(store => store.appDb.userModel).subscribe((userModel: UserModel) => {
            this.userModel = userModel;
        })
        this.listenEvents();
    }

    private listenEvents() {
        this.store.select(store => store.appDb.appAuthStatus).subscribe((i_authStatus: Map<string,AuthenticateFlags>) => {
            let authStatus: AuthenticateFlags = i_authStatus.get('authStatus')
            switch (authStatus) {
                case AuthenticateFlags.WRONG_PASS: {
                    this.saveCredentials('', '', '');
                    this.router.navigate(['/UserLogin']);
                    break;
                }
                case AuthenticateFlags.TWO_FACTOR_ENABLED: {
                    var user = Ngmslib.Base64().encode(this.userModel.getUser());
                    var pass = Ngmslib.Base64().encode(this.userModel.getPass());
                    this.router.navigate([`/UserLogin/twoFactor/${user}/${pass}`])
                    break;
                }
                case AuthenticateFlags.TWO_FACTOR_PASS: {
                    this.saveCredentials('', '', '');
                    this.enterApplication();
                    break;
                }
                case AuthenticateFlags.AUTH_PASS_NO_TWO_FACTOR: {
                    if (this.userModel.getRememberMe()) {
                        this.saveCredentials(this.userModel.getUser(), this.userModel.getPass(), this.userModel.rememberMe());
                    } else {
                        this.saveCredentials('', '', '');
                    }
                    this.enterApplication();
                    break;
                }
            }
        })
    }

    private enterApplication() {
        setTimeout(() => {
            console.log('enter app');
            this.router.navigate(['/App1/Dashboard']);
            this.storeService.loadServices();
        }, 1000)
    }

    public start() {
        var i_user, i_pass, i_remember;

        // check local store first
        var credentials = this.localStorage.getItem('remember_me');
        if (credentials && (credentials && credentials.u != '')) {
            i_user = credentials.u;
            i_pass = credentials.p;
            i_remember = credentials.r;

        } else {
            // check url params
            var id = this.activatedRoute.snapshot.queryParams['id'];
            if (!_.isUndefined(id)) {
                id = `${id}=`;
                try {
                    credentials = Ngmslib.Base64().decode(id);
                    var local = this.activatedRoute.snapshot.queryParams['local'];
                    var credentialsArr = credentials.match(/user=(.*),pass=(.*)/);
                    i_user = credentialsArr[1];
                    i_pass = credentialsArr[2];
                    i_remember = 'false';
                } catch (e) {
                }
            }
        }
        if (i_user && i_pass) {
            this.router.navigate(['/AutoLogin']);
            this.authUser(i_user, i_pass, i_remember)
        } else {
            // no valid user/pass found so go to user login, end of process
            this.router.navigate(['/UserLogin']);
        }
    }

    public  saveCredentials(i_user, i_pass, i_remember) {
        if (i_remember) {
            this.localStorage.setItem('remember_me', {
                u: i_user,
                p: i_pass,
                r: i_remember
            });
        } else {
            this.localStorage.setItem('remember_me', {
                u: '',
                p: '',
                r: i_remember
            });
        }
    }

    public authUser(user: string, pass: string, rememberMe: boolean = false): void {
        this.store.dispatch({
            type: EFFECT_AUTH_START,
            payload: this.userModel.setUser(user.trim()).setPass(pass.trim()).setRememberMe(rememberMe)
        })
    }

    public authServerTwoFactor(token): void {
        this.store.dispatch({type: EFFECT_TWO_FACTOR_AUTH, payload: {token: token, enable: false}})
    }


    public getLocalstoreCred(): { u: string, p: string, r: string } {
        var credentials = this.localStorage.getItem('remember_me');
        if (!credentials)
            return {
                u: '',
                p: '',
                r: ''
            };
        return {
            u: credentials.u,
            p: credentials.p,
            r: credentials.r,
        }
    }

    public checkAccess(): Promise<any> {
        if (this.userModel.getAuthenticated()) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    public canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> {
        return Observable
            .fromPromise(this.checkAccess())
            .do(result => {
                if (!result)
                    this.router.navigate(['/AutoLogin']);
            });
    }
}

export const AUTH_PROVIDERS: Array<any> = [{
    provide: AuthService,
    useClass: AuthService
}];