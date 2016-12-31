import {StoreData, INITIAL_STORE_DATA, INITIAL_APP_DB, IAppDb} from "./store-data";

export interface ApplicationState {
    storeData: StoreData
    appDb: IAppDb
}
export const INITIAL_APPLICATION_STATE: ApplicationState = {
    storeData: INITIAL_STORE_DATA,
    appDb: INITIAL_APP_DB
};