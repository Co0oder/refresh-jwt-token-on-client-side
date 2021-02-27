import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'short'})
export class ShortPipe implements PipeTransform{
    transform(value: string, length: number): string {
        if(value.length > length){
            return `${value.slice(0,20)}...`;
        }
        return value;
    }

}
