import {Component, ViewContainerRef, VERSION} from "@angular/core";
import "rxjs/add/operator/catch";
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {CommBroker} from "../services/CommBroker";
import {Title} from "@angular/platform-browser";
import {ToastsManager} from "ng2-toastr";
import {Ngmslib} from "ng-mslib";
import {Consts} from "../Conts";
import {Observable} from "rxjs";
import * as packageJson from "../../package.json";
import {AuthService} from "../services/AuthService";
import {LocalStorage} from "../services/LocalStorage";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    public version: string;
    private ngVersion: string;

    constructor(private router: Router,
                private localStorage: LocalStorage,
                private commBroker: CommBroker,
                private authService: AuthService,
                private activatedRoute: ActivatedRoute,
                private vRef: ViewContainerRef,
                private titleService: Title,
                private toastr: ToastsManager) {

        this.version = packageJson.version;
        this.ngVersion = VERSION.full

        // this.localStorage.removeItem('remember_me')
        // this.localStorage.removeItem('business_id')

        this.checkPlatform();
        this.toastr.setRootViewContainerRef(vRef);
        this.listenRouterUpdateTitle();
        Observable.fromEvent(window, 'resize').debounceTime(250).subscribe(() => {
            this.appResized();
        });
        Ngmslib.GlobalizeStringJS();
        console.log(StringJS('app-loaded-and-ready').humanize().s);
    }

    ngOnInit() {
        let s = this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.authService.start();
                s.unsubscribe();
            }
        });
    }

    private checkPlatform() {
        switch (platform.name.toLowerCase()) {
            case 'microsoft edge': {
                alert(`${platform.name} browser not supported at this time, please use Google Chrome`);
                break;
            }
            case 'chrome': {
                break;
            }
            default: {
                alert('for best performance please use Google Chrome');
                break;
            }
        }
    }

    public appResized(): void {
        var appHeight = document.body.clientHeight;
        var appWidth = document.body.clientWidth;
        this.commBroker.setValue(Consts.Values().APP_SIZE, {
            height: appHeight,
            width: appWidth
        });
        this.commBroker.fire({
            fromInstance: self,
            event: Consts.Events().WIN_SIZED,
            context: '',
            message: {
                height: appHeight,
                width: appWidth
            }
        })
    }

    private listenRouterUpdateTitle() {
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map(route => {
                while (route.firstChild) {
                    route = route.firstChild
                }
                return route;
            }).filter(route => route.outlet === 'primary')
            .mergeMap(route => route.data)
            .subscribe((event) => {
                this.titleService.setTitle(event['title'])
            });
    }
}

