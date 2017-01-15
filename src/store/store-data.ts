import {Map} from "immutable";
import {UserModel} from "../models/UserModel";
import {AuthenticateFlags} from "./actions/app-db-actions";
import {ActionReducer, combineReducers} from "@ngrx/store";
import {ApplicationState} from "./application-state";
import {storeFreeze} from "ngrx-store-freeze";
import {compose} from "@ngrx/core";
import {appDb} from "../store/reducers/app-db-reducer";
import {storeData} from "../store/reducers/uiStoreDataReducer";

const reducers = {storeData, appDb};
export const developmentReducer: ActionReducer<ApplicationState> = compose(storeFreeze, combineReducers)(reducers);
export const productionReducer: ActionReducer<ApplicationState> = combineReducers(reducers);

export interface StoreData {
    participants: { [key: number]: any };
    threads: { [key: number]: any };
    messages: { [key: number]: any };
}

export interface IAppDb {
    totalStations: string;
    appStartTime: number;
    appBaseUrl: string;
    userModel: UserModel,
    cloudServers: string;
    serversStatus: string;
    appAuthStatus: Map<string,AuthenticateFlags>;
    appBaseUrlUser: string;
    appBaseUrlCloud: string;
}

export const INITIAL_STORE_DATA: StoreData = {
    threads: {},
    messages: {},
    participants: {}
};


export const INITIAL_APP_DB: IAppDb = {
    totalStations: '',
    appStartTime: -1,
    appBaseUrl: '',
    userModel: new UserModel({
        user: '',
        pass: '',
        authenticated: false,
        businessId: -1,
        rememberMe: false,
        twoFactorRequired: false,
        accountType: -1
    }),
    appAuthStatus: Map({authStatus: AuthenticateFlags.NONE}),
    cloudServers: '',
    serversStatus: '',
    appBaseUrlUser: '',
    appBaseUrlCloud: ''
};

