import {ItemsModelMenu} from '@app/model/util/items.model.menu';

export class AuthModel {
    userId: number;
    user: string;
    name: string;
    token: string;
    rol: string;
    language: string;
    companyId: string;
    menu: ItemsModelMenu[];
}
