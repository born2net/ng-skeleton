import {Component} from "@angular/core";
import {LocalStorage} from "../../services/LocalStorage";

@Component({
    selector: 'Logout',
    providers: [LocalStorage],
    template: `
        <h1>Goodbye</h1>
        <small>I am Logout component</small>
        `
})

export class Logout {
    constructor(private localStorage: LocalStorage) {
        this.localStorage.removeItem('remember_me')
        jQuery('body').fadeOut(1000, function () {
            window.location.replace('http://www.digitalsignage.com');
        });
    }
}
