export class AccessModel {

    public menuId?: number;
    public name?: string;
    public path?: string;
    public icon?: string;
    public parentId?: number;
    public list?: AccessModel[];

    clone(c: any): AccessModel {
        const model: AccessModel = new AccessModel();
        model.menuId = c.menuId;
        model.name = c.name;
        model.path = c.path;
        model.icon = c.icon;
        model.parentId = c.parentId;
        model.list = c.list;
        return model;
    }
}

