import {StoreModel} from "../models/StoreModel";
import * as _ from 'lodash';
export class UserModel extends StoreModel {

    constructor(data: {user: string, pass: string, authenticated: boolean, businessId: number, rememberMe: boolean, twoFactorRequired:boolean, accountType: number, authTime?: Date}) {
        super(data);
    }

    // setKey2 = <T extends new (...args: any[]) => UserModel, K extends keyof UserModel>
    //     (c: T, key: K, value: UserModel[K]) => {
    //     c.prototype[key] = value;
    // };
    // getKey2 = (key: string) => {
    //     return key as any;
    // };
    //
    // set authenticated2(value: boolean) {
    //     this.setKey2(UserModel, 'authenticated2', value);
    // }
    //
    // get authenticated2(): boolean {
    //     return this.getKey2('authenticated');
    // }

    public setTime() {
        return this.setKey<UserModel>(UserModel, 'authTime', new Date());
    }

    public getTime() {
        return this.getKey('authTime');
    }

    setAuthenticated(value:boolean) {
        return this.setKey<UserModel>(UserModel, 'authenticated', value);
    }

    getAuthenticated(): boolean {
        return this.getKey('authenticated');
    }

    setUser(value:string) {
        return this.setKey<UserModel>(UserModel, 'user', value);
    }

    getUser() {
        return this.user();
    }

    user() {
        return this.getKey('user');
    }

    setPass(value:string) {
        return this.setKey<UserModel>(UserModel, 'pass', value);
    }

    getPass() {
        return this.pass();
    }

    pass() {
        return this.getKey('pass');
    }

    setAccountType(value:number) {
        return this.setKey<UserModel>(UserModel, 'accountType', value);
    }

    getAccountType(): boolean {
        return this.getKey('accountType');
    }

    setTwoFactorRequired(value:boolean) {
        return this.setKey<UserModel>(UserModel, 'twoFactorRequired', value);
    }

    getTwoFactorRequired(): boolean {
        return this.getKey('twoFactorRequired');
    }

    setBusinessId(value:number) {
        return this.setKey<UserModel>(UserModel, 'businessId', value);
    }

    getBusinessId(): boolean {
        return this.getKey('businessId');
    }

    businessId() {
        return this.getKey('businessId');
    }

    setRememberMe(value:boolean) {
        return this.setKey<UserModel>(UserModel, 'rememberMe', value);
    }

    getRememberMe() {
        return this.rememberMe()
    }

    rememberMe() {
        return this.getKey('rememberMe');
    }


    // public setField(i_field, i_value) {
    //     var value = this.getKey('Value');
    //     value[i_field] = i_value;
    //     return this.setKey<AdnetRateModel>(AdnetRateModel, 'Value', value);
    // }

}