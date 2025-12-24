import { FormGroup, FormControl, Validators } from "@angular/forms";
import { baseProductForm } from "./BaseProductFormFactory";
import { UpdateProductRequestModel } from "../../Models/Products/UpdateProductRequestModel";

export type UpdateProductForm = FormGroup<{
    id: FormControl<number>;
    productName: FormControl<string>;
    unitPrice: FormControl<number>;
    categoryId: FormControl<number>;
}>

export function updateProductForm() {
    const base = baseProductForm();

    /* 
        Create'te maxLength yok. Update'de validation logic değişebilir. Ek validation eklenebilir.
        Bu behaivor composition ile sağlanabilir.
    */

    base.productName.addValidators([Validators.maxLength(100)]);
    base.productName.updateValueAndValidity({emitEvent: false}); 
    /*
        updateValueAndValidity({emitEvent: false}) => validators seti artık değişti. bunu angulara bildirir. emitEvent: false ile valueChanges event'inin tetiklenmesini engelleriz. Aksi halde form açıldığında gereksiz validation evenler'i olur
    */

    base.unitPrice.addValidators([Validators.max(999999)]);
    base.unitPrice.updateValueAndValidity({emitEvent: false});

    return new FormGroup({
        id: new FormControl<number>(0, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)],
        }),
        ...base,
    });
}

export function toUpdateProductRequestModel(form: UpdateProductForm): UpdateProductRequestModel {
    return {
        id: form.controls.id.value,
        productName: form.controls.productName.value,
        unitPrice: form.controls.unitPrice.value,
        categoryId: form.controls.categoryId.value,
    };
}
