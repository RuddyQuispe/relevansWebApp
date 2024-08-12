import {Pipe, PipeTransform} from '@angular/core';
import {DomainModel} from "@models/domain";
import {SelectItem} from "primeng/api";

@Pipe({
    name: 'currentType'
})
export class CurrentTypePipe implements PipeTransform {

    transform(value: string, currentTypes: Array<SelectItem>): string {
        if (currentTypes.length === 0) return '*';
        if (!value) return '-';
        return currentTypes.filter(d => d.value === value.toString())[0]?.title ?? '-';
    }
}
