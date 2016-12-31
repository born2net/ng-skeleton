import {
    Subject,
    Observable
} from "rxjs";


export function TakeUntilDestroy(constructor) {
    var original = constructor.prototype.ngOnDestroy;
    var subject;
    var unsub;
    constructor.prototype.componentDestroy = function () {
        subject = new Subject();
        return subject.asObservable();
    };
    constructor.prototype.unsubOnDestroy = function (i_unsub) {
        unsub = i_unsub;
    };
    constructor.prototype.ngOnDestroy = function () {
        original && typeof original === 'function' && original.apply(this, arguments);
        unsub === 'function' && unsub();
        subject && subject.next('ngOnDestroy') && subject.unsubscribe();
    };
}