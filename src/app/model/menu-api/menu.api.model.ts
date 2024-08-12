export class MenuApiModel {
    public menuId: number;
    public parentId: number;
    public name: string;
    public path: string;
    public icon: string;
    public enabled: boolean;
    public sequence: number;
    public lastUser: string;
    public lastTime: string;


    constructor(menuId?: number,
                parentId?: number,
                name?: string,
                path?: string,
                icon?: string,
                enabled?: boolean,
                sequence?: number,
                lastUser?: string,
                lastTime?: string) {
        this.menuId = menuId;
        this.parentId = parentId;
        this.name = name;
        this.path = path;
        this.icon = icon;
        this.enabled = enabled ?? false;
        this.sequence = sequence;
        this.lastUser = lastUser;
        this.lastTime = lastTime;
    }

    public static clone = (menuApiModel: MenuApiModel) =>
        new MenuApiModel(menuApiModel.menuId,
            menuApiModel.parentId,
            menuApiModel.name,
            menuApiModel.path,
            menuApiModel.icon,
            menuApiModel.enabled,
            menuApiModel.sequence,
            menuApiModel.lastUser,
            menuApiModel.lastTime)
}