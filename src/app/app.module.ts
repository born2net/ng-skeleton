import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {AlertModule, ModalModule} from "ng2-bootstrap/ng2-bootstrap";
import {Ng2Bs3ModalModule} from "ng2-bs3-modal/ng2-bs3-modal";
import {AppComponent} from "./app.component";
import {LocalStorage} from "../services/LocalStorage";
import {MsLibModule} from "ng-mslib/dist/mslib.module";
import {ToastModule} from "ng2-toastr";
import {DropdownModule, AccordionModule} from "ng2-bootstrap";
import {TreeModule, InputTextModule, SelectButtonModule, DropdownModule as DropdownModulePrime} from "primeng/primeng";
import {NgStringPipesModule} from "angular-pipes";
import {routing} from "../App.routes";
import {LoginPanel} from "../comps/entry/LoginPanel";
import {Logout} from "../comps/logout/Logout";
import {Orders} from "../comps/app1/orders/Orders";
import {Logo} from "../comps/logo/Logo";
import {BlurForwarder} from "../comps/blurforwarder/BlurForwarder";
import {Ngmslib} from "ng-mslib";
import {ImgLoader} from "../comps/imgloader/ImgLoader";
import {ChartModule} from "angular2-highcharts";
import {CommBroker} from "../services/CommBroker";
import {AUTH_PROVIDERS} from "../services/AuthService";
import {StoreService} from "../services/StoreService";
import {NgMenu} from "../comps/ng-menu/ng-menu";
import {NgMenuItem} from "../comps/ng-menu/ng-menu-item";
import {AutoLogin} from "../comps/entry/AutoLogin";
import {Sliderpanel} from "../comps/sliderpanel/Sliderpanel";
import {Slideritem} from "../comps/sliderpanel/Slideritem";
import {StoreModule, combineReducers} from "@ngrx/store";
import {INITIAL_APPLICATION_STATE} from "../store/application-state";
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {appDb} from "../store/reducers/app-db-reducer";
import {storeData} from "../store/reducers/uiStoreDataReducer";
import {AppdbAction} from "../store/actions/app-db-actions";
import {AppDbEffects} from "../store/effects/app-db-effects";
import {Dashboard} from "../comps/app1/dashboard/dashboard";
import {App1} from "../comps/app1/App1";
import {Privileges} from "../comps/app1/privileges/Privileges";
import {Account} from "../comps/app1/account/Account";
import {Tab} from "../comps/tabs/tab";
import {Tabs} from "../comps/tabs/tabs";
import {InputEdit} from "../comps/inputedit/InputEdit";
import {Twofactor} from "../comps/twofactor/Twofactor";
import "hammerjs";

export var providing = [CommBroker, AUTH_PROVIDERS,
    {
        provide: LocalStorage,
        useClass: LocalStorage
    },
    {
        provide: StoreService,
        useClass: StoreService
    },
    {
        provide: AppdbAction,
        useClass: AppdbAction
    },
    {
        provide: "DEV_ENV",
        useValue: Ngmslib.DevMode()
    },
    {
        provide: "OFFLINE_ENV",
        useValue: false
    }
];


var decelerations = [AppComponent, AutoLogin, LoginPanel, Logo, App1, Account, Dashboard, Privileges, Tabs, Tab, Sliderpanel, Slideritem, Orders, Logout, InputEdit, Twofactor, NgMenu, NgMenuItem, ImgLoader, BlurForwarder, ];

@NgModule({
    declarations: [decelerations],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2Bs3ModalModule,
        HttpModule,
        StoreModule.provideStore(combineReducers({
            storeData,
            appDb
        }), INITIAL_APPLICATION_STATE),
        EffectsModule.run(AppDbEffects),
        //EffectsModule.run(AnotherEffectService),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        ChartModule,
        ToastModule.forRoot({
            animate: 'flyRight',
            positionClass: 'toast-bottom-right',
            toastLife: 5000,
            showCloseButton: true,
            maxShown: 5,
            newestOnTop: true,
            enableHTML: true,
            dismiss: 'auto',
            messageClass: "",
            titleClass: ""
        }),
        MsLibModule.forRoot(),
        JsonpModule,
        AlertModule,
        ModalModule,
        DropdownModule,
        AccordionModule,
        TreeModule,
        NgStringPipesModule,
        InputTextModule,
        SelectButtonModule,
        InputTextModule,
        DropdownModulePrime,
        routing,
    ],
    providers: [providing],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
    }

}
