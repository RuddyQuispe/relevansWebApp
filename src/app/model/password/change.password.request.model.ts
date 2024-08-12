export class ChangePasswordRequestModel {
    public user: string;
    public password: string;
    public verificationCode: string;


    constructor(user?: string, password?: string, verificationCode?: string) {
        this.user = user;
        this.password = password;
        this.verificationCode = verificationCode;
    }

    public clone = (): ChangePasswordRequestModel =>
        new ChangePasswordRequestModel(this.user,
            this.password,
            this.verificationCode)
}
