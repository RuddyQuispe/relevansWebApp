import {Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class MensajeService {

    constructor(public messageService: MessageService) {
    }

    showSuccess(message: string): void {
        this.messageService.add({severity: 'success', summary: message});
    }

    showInfo(message: string): void {
        this.messageService.add({severity: 'info', summary: message});
    }

    showWarning(message: string): void {
        this.messageService.add({severity: 'warn', detail: message});
    }

    showError(message: string): void {
        this.messageService.add({severity: 'error', summary: message});
    }
}
