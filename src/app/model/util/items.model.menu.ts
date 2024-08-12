import {AccessModel} from '@app/model/access';

export class ItemsModelMenu {
    label: string;
    icon?: string;
    routerLink?: any;
    items?: ItemsModelMenu[];

    accessToItem(items: AccessModel[]): ItemsModelMenu[] {
        // console.log('items::', items);
        let list: ItemsModelMenu[];
        if (items === null || items.length === 0) {
            return list;
        }
        list = [];
        let model: ItemsModelMenu;
        for (const item of items) {
            // los t_menu que tienen el icono en null, no se deben de cargar a la UI
            if (/*item.parentId > 0 &&*/ item.icon == null)
                continue;
            model = new ItemsModelMenu();
            model.label = item.name;
            model.icon = item.icon;
            model.routerLink = item.path != null ? new Array(item.path) : '';
            model.items = this.accessToItem(item.list);
            list.push(model);
        }
        return list;
    }
}
