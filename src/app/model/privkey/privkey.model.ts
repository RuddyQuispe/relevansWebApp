export class PrivkeyModel {
    privKeyId: number;
    companyId: number;
    clearinghouseId: number;
    keyname: string;
    initDate: Date;
    endDate: Date;
    certificate: string;
    pkey: string;
    passwd: string;
    enabled?: boolean;
    typeKey: string;

    clone(c: PrivkeyModel): PrivkeyModel {
        const model: PrivkeyModel = new PrivkeyModel();
        model.privKeyId = c.privKeyId;
        model.companyId = c.companyId;
        model.clearinghouseId = c.clearinghouseId;
        model.keyname = c.keyname;
        model.initDate = c.initDate;
        model.endDate = c.endDate;
        model.certificate = c.certificate;
        model.pkey = c.pkey;
        model.passwd = c.passwd;
        model.enabled = c.enabled;
        model.typeKey = c.typeKey;
        return model;
    }
}
