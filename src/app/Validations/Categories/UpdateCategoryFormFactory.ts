import { FormGroup, FormControl, Validators } from "@angular/forms";
import { baseCategoryForm } from "./BaseCategoryFormFactory";
import { UpdateCategoryRequestModel } from "../../../Models/Categories/UpdateCategoryRequestModel";

export type UpdateCategoryForm = FormGroup<{
    id: FormControl<number>;
    name: FormControl<string>;
    description: FormControl<string>;
}>

export function updateCategoryForm() {
    const base = baseCategoryForm();

    /* 
        Creat'te maxLength yok. Update'de validation logic değişebilir. Ek validation eklenebilir.
        Bu behaivor composition ile sağlanabilir.
    */

    base.name.addValidators([Validators.maxLength(50)]);
    base.name.updateValueAndValidity({emitEvent: false}); 
    /*
        updateValueAndValidity({emitEvent: false}) => validators seti artık değişti. bunu angulara bildirir. emitEvent: false ile valueChanges event'inin tetiklenmesini engelleriz. Aksi halde form açıldığında gereksiz validation evenler'i olur
    */

    return new FormGroup({
        id: new FormControl<number>(0, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)],
        }),
        ...base,
    });
}

export function toUpdateCategoryRequestModel(form: UpdateCategoryForm): UpdateCategoryRequestModel {
    return {
        id: form.controls.id.value,
        categoryName: form.controls.name.value,
        description: form.controls.description.value
    };
}
