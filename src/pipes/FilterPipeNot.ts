import {Pipe, PipeTransform} from "@angular/core";
import * as _ from 'lodash';
@Pipe({
    name: 'FilterPipeEqual'
})
export class FilterPipeEqual implements PipeTransform {
    transform(input: Object[], ...args: any[]): boolean {
        var filterWith: string = args[0].toLowerCase();
        var filterBy = args[1](input).toLowerCase();
        if (_.isEqual(filterBy,filterWith))
            return true;
        return false;
    }
}