import { FormGroup } from "@angular/forms";
import { baseProductForm } from "./BaseProductFormFactory";
import { CreateProductRequestModel } from "../../Models/Products/CreateProductRequestModel";

export type CreateProductForm = FormGroup<ReturnType<typeof baseProductForm>>;

export function createProductForm(): CreateProductForm {
    return new FormGroup(baseProductForm());
}

export function toCreateProductRequestModel(form: CreateProductForm): CreateProductRequestModel {
    return {
        productName: form.controls.productName.value,
        unitPrice: form.controls.unitPrice.value,
        categoryId: form.controls.categoryId.value,
    };
}
