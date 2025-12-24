import { BaseProductViewModel } from "./BaseProductViewModel";

export class ProductResponseModel extends BaseProductViewModel {
    id: number;

    constructor(id: number, productName: string, unitPrice: number, categoryId: number) {
        super(productName, unitPrice, categoryId);
        this.id = id;
    }
}
