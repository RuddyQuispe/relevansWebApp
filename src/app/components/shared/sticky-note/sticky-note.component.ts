import {Component, Input} from '@angular/core';

@Component({
    selector: 'shared-sticky-note',
    templateUrl: './sticky-note.component.html',
    styleUrls: ['./sticky-note.component.scss']
})
export class StickyNoteComponent {

    @Input()
    public title: string;

    constructor() {
    }

}
