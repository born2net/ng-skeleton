import {Component, ChangeDetectionStrategy, Output, EventEmitter} from "@angular/core";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs/Subscription";
declare var google: any;

@Component({
    selector: 'MapAddress',
    template: `
                <input class="form-control" placeholder="enter address" 
                type="text" [formControl]="searchControl"/>
              `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapAddress {
    private geocoder: any;
    private unsub: Subscription;
    private searchControl = new FormControl();

    @Output()
    onChange: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {
        this.unsub = this.searchControl.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .filter((address: string)=> {
                return address.length > 3;
            }).do((address)=> {
                if (!this.geocoder)
                    this.geocoder = new google.maps.Geocoder();
                this.geocoder.geocode({'address': address}, (results, status) => {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                            var event = {
                                coords: {
                                    lat: results[0].geometry.location.lat(),
                                    lng: results[0].geometry.location.lng()
                                }
                            }
                            this.onChange.emit(event);
                        } else {
                            //alert("No results found");
                        }
                    } else {
                        //alert("Geocode was not successful for the following reason: " + status);
                    }
                });

            }).subscribe(()=> {
            })

    }

    public clear() {
        this.searchControl.setValue('');
    }

    private ngOnDestroy() {
        this.unsub.unsubscribe();
    }
}