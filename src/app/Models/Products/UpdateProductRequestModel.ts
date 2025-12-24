import { BaseProductViewModel } from "./BaseProductViewModel";

export class UpdateProductRequestModel extends BaseProductViewModel {
    id: number;

    constructor(id: number, productName: string, unitPrice: number, categoryId: number) {
        super(productName, unitPrice, categoryId);
        this.id = id;
    }
}
