// import {
//     Pipe,
//     PipeTransform, ChangeDetectorRef
// } from '@angular/core';
// import * as _ from 'lodash';
// import {List} from 'immutable';
// import {StoreModel} from "../models/StoreModel";
//
//
// @Pipe({
//     name: 'ThrottlePipe',
//     pure: false
// })
// export class ThrottlePipe implements PipeTransform {
//     constructor(private cdRef: ChangeDetectorRef) {}
//     transform(i_list: List<StoreModel>, ...args: any[]) {
//         if (!i_list)
//             return List<any>();
//         i_list.forEach((model: StoreModel) => {
//             var t = _.random(100, 1000);
//             setTimeout(() => {
//                 this.cdRef.markForCheck();
//                 return model
//             }, t)
//             // return model;
//         })
//         // return i_list;
//     }
// }
import {Pipe, PipeTransform, ChangeDetectorRef} from "@angular/core";
import {List} from 'immutable';
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/timer";
import "rxjs/add/operator/take";
import {StoreModel} from "../models/StoreModel";
import * as _ from 'lodash';

/**
 * On number change, animates from `oldNumber` to `newNumber`
 */
// naive implementation assumes small number increments
@Pipe({
    name: 'ThrottlePipe',
    pure: false
})
export class ThrottlePipe implements PipeTransform {
    private counter = 0;
    private timeout = 0;
    private list:List<StoreModel> = List<StoreModel>();

    constructor(private cdRef: ChangeDetectorRef) {
    }


    transform(i_list: List<StoreModel>, ...args: any[]) {
        if (!i_list)
            return this.list;
        // if (this.list.size==i_list.size)
        //     return this.list;
        console.log(this.counter);
        var storeModel = i_list.get(this.counter);
        this.counter++;
        if (!storeModel)
            return this.list;
        setTimeout(() => {
            this.cdRef.markForCheck();
            return this.list = this.list.push(storeModel);
        }, 2)
        // i_list.forEach((model: StoreModel) => {
        //     this.counter++
        //     this.timeout = this.timeout + 50;
        //     console.log(this.counter);
        //     setTimeout(() => {
        //         this.cdRef.markForCheck();
        //         return this.list = this.list.push(model);
        //     }, this.counter)
        // })
        return this.list;
    }
}

    // transform(newNumber: number): any {
    //     if (this.newNumber === null) { // set inital value
    //         this.currentNumber = this.newNumber = newNumber;
    //     }
    //     if (newNumber !== this.newNumber) {
    //         if (this.subscription) {
    //             this.currentNumber = this.newNumber;
    //             this.subscription.unsubscribe();
    //         }
    //         this.newNumber = newNumber;
    //         const oldNumber = this.currentNumber;
    //         const direction = ((newNumber - oldNumber) > 0) ? 1 : -1;
    //         const numbersToCount = Math.abs(newNumber - oldNumber) + 1;
    //         this.subscription = Observable.timer(0, 100) // every 100 ms
    //             .take(numbersToCount)
    //             .subscribe(
    //                 () => {
    //                     this.currentNumber += direction;
    //                     this.cdRef.markForCheck();
    //                 },
    //                 null,
    //                 () => this.subscription = null
    //             );
    //     }
    //
    //     return this.currentNumber;
    // }
