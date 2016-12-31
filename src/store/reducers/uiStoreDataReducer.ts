import {StoreData} from "../store-data";
import {Action} from "@ngrx/store";

export function storeData(state: StoreData, action: Action): StoreData {
    switch (action.type) {
        case 'FOO':
            return state
        default:
            return state;
    }
}










