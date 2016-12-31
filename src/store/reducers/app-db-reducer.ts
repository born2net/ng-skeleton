import {IAppDb} from "../store-data";
import {Map} from "immutable";
import {UserModel} from "../../models/UserModel";
import * as StoreActions from "../actions/app-db-actions";
import * as EffectActions from "../effects/app-db-effects";

const baseUrl = 'https://galaxy.signage.me/WebService/ResellerService.ashx';
export const appBaseUrlCloud = 'https://secure.digitalsignage.com';

export function appDb(state: IAppDb, action: any): IAppDb {

    switch (action.type) {
        case StoreActions.APP_INIT:
            state.appStartTime = Date.now();
            state.appBaseUrl = `${baseUrl}`;
            return state;

        case EffectActions.EFFECT_UPDATE_USER_MODEL:
            var userModel: UserModel = action.payload;
            state.userModel = userModel.setTime();
            state.appBaseUrlUser = `${baseUrl}?resellerUserName=${userModel.getKey('user')}&resellerPassword=${userModel.getKey('pass')}`;
            state.appBaseUrlCloud = `${appBaseUrlCloud}/END_POINT/${userModel.getKey('user')}/${userModel.getKey('pass')}`;
            return state;

        case EffectActions.EFFECT_TWO_FACTOR_UPDATED:
            var userModel = state.userModel;
            userModel = userModel.setTwoFactorRequired(action.payload);
            state.userModel = userModel.setTime();
            return state;

        case StoreActions.ACTION_TWO_FACTOR_REMOVED:
            var userModel = state.userModel;
            userModel = userModel.setTwoFactorRequired(false);
            state.userModel = userModel.setTime();
            return state;

        case EffectActions.EFFECT_AUTH_STATUS:
            state.appAuthStatus = Map({authStatus: action.payload});
            return state;

        default:
            return state;
    }


}



