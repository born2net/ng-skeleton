import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
    name: 'FilterPipe'
})
export class FilterPipe implements PipeTransform {
    transform(input:Object[], ...args:any[]):boolean {
        var filterWith:string = args[0].toLowerCase();
        var filterBy = args[1](input).toLowerCase();
        if (filterBy.indexOf(filterWith) > -1)
            return false;
        return true;
    }
}