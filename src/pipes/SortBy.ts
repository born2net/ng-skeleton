/*
 * Example use
 *		Basic Array of single type: *ngFor="#todo of todoService.todos | sortBy : '-'"
 *		Multidimensional Array Sort on single column: *ngFor="#todo of todoService.todos | sortBy : ['-status']"
 *		Multidimensional Array Sort on multiple columns: *ngFor="#todo of todoService.todos | sortBy : ['status', '-title']"
 */

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'sortBy', pure: false})
export class SortBy implements PipeTransform {

    static _orderByComparator(a:any, b:any):number{
        if((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))){
            //Isn't a number so lowercase the string to properly compare
            if(a.toLowerCase() < b.toLowerCase()) return -1;
            if(a.toLowerCase() > b.toLowerCase()) return 1;
        }
        else{
            //Parse strings as numbers to compare properly
            if(parseFloat(a) < parseFloat(b)) return -1;
            if(parseFloat(a) > parseFloat(b)) return 1;
        }

        return 0; //equal each other
    }
    transform(input:any, ...args:any[]): Object[] {
    //transform(input:any, [config = '+']): any{
        var config:any;
        if (args.length==0){
            config = ['+'];
        } else {
            config = args[0];
        }
        if(!Array.isArray(input)) return input;

        if(!Array.isArray(config) || (Array.isArray(config) && config.length == 1)){
            var propertyToCheck:string = !Array.isArray(config) ? config : config[0];
            var desc = propertyToCheck.substr(0, 1) == '-';

            //Basic array
            if(!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+'){
                return !desc ? input.sort() : input.sort().reverse();
            }
            else {
                var property:string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
                    ? propertyToCheck.substr(1)
                    : propertyToCheck;

                return input.sort(function(a:any,b:any){
                    return !desc
                        ? SortBy._orderByComparator(a[property], b[property])
                        : -SortBy._orderByComparator(a[property], b[property]);
                });
            }
        }
        else {
            //Loop over property of the array in order and sort
            return input.sort(function(a:any,b:any){
                for(var i:number = 0; i < config.length; i++){
                    var desc = config[i].substr(0, 1) == '-';
                    var property = config[i].substr(0, 1) == '+' || config[i].substr(0, 1) == '-'
                        ? config[i].substr(1)
                        : config[i];

                    var comparison = !desc
                        ? SortBy._orderByComparator(a[property], b[property])
                        : -SortBy._orderByComparator(a[property], b[property]);

                    //Don't return 0 yet in case of needing to sort by next property
                    if(comparison != 0) return comparison;
                }

                return 0; //equal each other
            });
        }
    }
}


// See https://plnkr.co/edit/DVk2ip

//<h2>OrderBy Examples</h2>
//<button (click)="addToArrays()" [style.display]="added?'none':'block'" class="btn btn-primary">Add to Arrays</button>
//<section class="row m-a">
//<h3>One-Dimensional Arrays</h3>
//<div class="col-sm-4 col-md-4">
//<h4>Unordered</h4>
//<code>*ngFor="#elem of someArray"</code><br/>
//<div class="row">
//<div class="col-sm-6 col-md-6">
//<ul>
//<li *ngFor="#f of fruit">{{f}}</li>
//</ul>
//</div>
//<div class="col-sm-6 col-md-6">
//<ul>
//<li *ngFor="#n of numbers">{{n}}</li>
//</ul>
//</div>
//</div>
//</div>
//<div class="col-sm-4 col-md-4">
//<h4>Asc</h4>
//<code>*ngFor="#elem of someArray | orderBy"</code><br/>
//OR<br/>
//<code>*ngFor="#elem of someArray | orderBy : '+'"</code><br/>
//OR<br/>
//<code>*ngFor="#elem of someArray | orderBy : ['+']"</code><br/>
//<div class="row">
//<div class="col-sm-6 col-md-6">
//<ul>
//<li *ngFor="#f of fruit | orderBy">{{f}}</li>
//</ul>
//</div>
//<div class="col-sm-6 col-md-6">
//<ul>
//<li *ngFor="#n of numbers | orderBy">{{n}}</li>
//</ul>
//</div>
//</div>
//</div>
//<div class="col-sm-4 col-md-4">
//<h4>Desc</h4>
//<code>*ngFor="#elem of someArray | orderBy : '-'"</code><br/>
//OR<br/>
//<code>*ngFor="#elem of someArray | orderBy : ['-']"</code><br/>
//<div class="row">
//<div class="col-sm-6 col-md-6">
//<ul>
//<li *ngFor="#f of fruit | orderBy : '-'">{{f}}</li>
//</ul>
//</div>
//<div class="col-sm-6 col-md-6">
//<ul>
//<li *ngFor="#n of numbers | orderBy : '-'">{{n}}</li>
//</ul>
//</div>
//</div>
//</div>
//</section>
//<section class="row m-a">
//<h3>Multi-Dimensional Arrays</h3>
//<div class="col-sm-4 col-md-4">
//<h4>Unordered</h4>
//<code>*ngFor="#person of people"</code><br/>
//<ul>
//<li *ngFor="#person of people">{{person.firstName}} {{person.lastName}}, {{person.age}}</li>
//</ul>
//</div>
//<div class="col-sm-4 col-md-4">
//<h4>By Last Name Asc</h4>
//<code>*ngFor="#person of people | orderBy : 'lastName'"</code><br/>
//OR<br/>
//<code>*ngFor="#elem of someArray | orderBy : ['lastName']"</code><br/>
//<ul>
//<li *ngFor="#person of people | orderBy : 'lastName'">{{person.firstName}} {{person.lastName}}, {{person.age}}</li>
//</ul>
//</div>
//<div class="col-sm-4 col-md-4">
//<h4>By Age Desc Then First Name Asc</h4>
//<code>*ngFor="#person of people | orderBy : ['-age', 'firstName']"</code><br/>
//<ul>
//<li *ngFor="#person of people | orderBy : ['-age', 'firstName']">{{person.firstName}} {{person.lastName}}, {{person.age}}</li>
//</ul>
//</div>
//</section>
//<button (click)="addToArrays()" [style.display]="added?'none':'block'" class="btn btn-primary">Add to Arrays</button>

