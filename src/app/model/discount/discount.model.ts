export class DiscountModel {
    public type: string;
    public value: string;
    public wayToApplyDiscount: string;


    constructor(type?: string, value?: string, wayToApplyDiscount?: string) {
        this.type = type || '';
        this.value = value || '';
        this.wayToApplyDiscount = wayToApplyDiscount || '';
    }

    public static clone = (discount: DiscountModel): DiscountModel =>
        new DiscountModel(discount.type, discount.value, discount.wayToApplyDiscount)
}