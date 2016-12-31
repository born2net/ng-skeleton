import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'ReplacePipe'
})
export class ReplacePipe implements PipeTransform {
    transform(input:string, ...args:any[]): string {
        if (args.length==0)
            return input;
        var re = new RegExp(args[0],'ig')
        var result = input.replace(re, args[1]);
        return result;
    }

}