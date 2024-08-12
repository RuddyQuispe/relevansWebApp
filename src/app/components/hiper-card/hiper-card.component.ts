import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-hiper-card',
    templateUrl: './hiper-card.component.html',
    styleUrls: ['./hiper-card.component.scss']
})
export class HiperCardComponent {

    @Input() protected width: string;
    @Input() protected heigh: string;

    constructor() {
    }

}
