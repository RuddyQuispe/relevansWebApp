import {Pipe, PipeTransform} from '@angular/core';
import {LOG_WS_APP_REQUEST} from "@app/utils/constants";

@Pipe({
    name: 'typeAppRequest'
})
export class TypeAppRequestPipe implements PipeTransform {

    transform = (value: string): string => LOG_WS_APP_REQUEST[value]

}
