export class UserModel {
    public userId: number;
    public userLogin: string;
    public userPwd?: string;
    public pwdSeed?: string;
    public userName: string;
    public userEmail: string;
    public phoneNumber?: string;
    public accessType?: string;
    public lastLoginDate?: Date;
    public profileId?: number;
    public socialCode?: string;
    public webAccess?: boolean;
    public movilAccess?: boolean;
    public wsAccess?: boolean;
    public ldapAccess?: boolean;
    public localAccess?: number;
    public inactive: boolean;
    public lastUser: string;
    public lastTime: Date;
    public companyId: number;

    public profile: string;
    public sortField: string;
    public sortSense: string;
    public first: number;
    public pageSize: number;
    public totalRows: number;

    public static COLUMN_MAIN_USER_ID: string = 'user_id';


    constructor(companyId?: number,
                userId?: number,
                userName?: string,
                userLogin?: string,
                userPwd?: string,
                pwdSeed?: string,
                userEmail?: string,
                phoneNumber?: string,
                accessType?: string,
                lastLoginDate?: Date,
                profileId?: number,
                socialCode?: string,
                webAccess?: boolean,
                movilAccess?: boolean,
                wsAccess?: boolean,
                ldapAccess?: boolean,
                localAccess?: number,
                inactive?: boolean,
                lastUser?: string,
                lastTime?: Date,
                profile?: string,
                sortField?: string,
                sortSense?: string,
                first?: number,
                pageSize?: number,
                totalRows?: number) {
        this.userId = userId;
        this.userLogin = userLogin;
        this.userPwd = userPwd;
        this.pwdSeed = pwdSeed;
        this.userName = userName;
        this.userEmail = userEmail;
        this.phoneNumber = phoneNumber;
        this.accessType = accessType;
        this.lastLoginDate = lastLoginDate;
        this.profileId = profileId;
        this.socialCode = socialCode;
        this.webAccess = webAccess;
        this.movilAccess = movilAccess;
        this.wsAccess = wsAccess;
        this.ldapAccess = ldapAccess;
        this.localAccess = localAccess;
        this.inactive = inactive;
        this.lastUser = lastUser;
        this.lastTime = lastTime;
        this.companyId = companyId;
        this.profile = profile;
        this.sortField = sortField;
        this.sortSense = sortSense;
        this.first = first;
        this.pageSize = pageSize;
        this.totalRows = totalRows;
    }

    clone(c: UserModel): UserModel {
        const model: UserModel = new UserModel();
        model.userId = c.userId;
        model.userLogin = c.userLogin;
        model.userPwd = c.userPwd;
        model.pwdSeed = c.pwdSeed;
        model.userName = c.userName;
        model.userEmail = c.userEmail;
        model.phoneNumber = c.phoneNumber;
        model.accessType = c.accessType;
        model.lastLoginDate = c.lastLoginDate;
        model.profileId = c.profileId;
        model.socialCode = c.socialCode;
        model.webAccess = c.webAccess;
        model.movilAccess = c.movilAccess;
        model.wsAccess = c.wsAccess;
        model.ldapAccess = c.ldapAccess;
        model.localAccess = c.localAccess;
        model.inactive = c.inactive;
        model.lastUser = c.lastUser;
        model.lastTime = c.lastTime;
        model.companyId = c.companyId;
        return model;
    }
}
