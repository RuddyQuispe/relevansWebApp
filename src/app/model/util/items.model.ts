import { DomainModel } from '@app/model/domain';
import { AccessModel } from '@app/model/access';
import { ProfileModel } from '@app/model/profile';
import { UserModel } from '@app/model/user';


export class ItemsModel {
    label: string;
    value: any;

    constructor(label?: string, value?: string) {
        this.label = label;
        this.value = value;
    }

    domainToItem(c: DomainModel): ItemsModel {
        const model: ItemsModel = new ItemsModel();
        model.label = c.description;
        model.value = c.domValue;
        return model;
    }

    nuevo(label: string, values: string): ItemsModel {
        const model: ItemsModel = new ItemsModel();
        model.label = label;
        model.value = values;
        return model;
    }

    accessToItem(c: AccessModel): ItemsModel {
        const model: ItemsModel = new ItemsModel();
        model.label = c.name;
        model.value = c.menuId + '';
        return model;
    }

    profileToItem(c: ProfileModel): ItemsModel {
        const model: ItemsModel = new ItemsModel();
        model.label = c.name;
        model.value = c.profileId;
        return model;
    }

    userToItem(c: UserModel): ItemsModel {
        const model: ItemsModel = new ItemsModel();
        model.label = c.userName;
        model.value = c.userId + '';
        return model;
    }

    getItemsDomain(items: DomainModel[], nombreLista: string): ItemsModel[] {
        const list: ItemsModel[] = [];
        if (items === undefined) {
            return list;
        }

        const im: ItemsModel = new ItemsModel();

        if (nombreLista !== null) {
            list.push(new ItemsModel('- Seleccione ' + nombreLista + ' -'));
        }
        items.forEach(element => {
            list.push(im.domainToItem(element));
        });
        return list;
    }

    stringToItems(str: string, nombreLista?: string): ItemsModel[] {
        const items = str.split(',');
        const list: ItemsModel[] = [];
        if (items === undefined) {
            return list;
        }

        const im: ItemsModel = new ItemsModel();

        if (nombreLista != null) {
            list.push(new ItemsModel('- Seleccione ' + nombreLista + ' -'));
        }
        items.forEach(element => {
            const i = new ItemsModel();
            i.label = element;
            i.value = element;
            list.push(i);
        });
        return list;
    }
}
