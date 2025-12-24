import { FormGroup } from "@angular/forms";
import { baseCategoryForm } from "./BaseCategoryFormFactory";
import { CreateCategoryRequestModel } from "../../../Models/Categories/CreateCategoryRequestModel";

export type CreateCategoryForm = FormGroup<ReturnType<typeof baseCategoryForm>>;

export function createCategoryForm(): CreateCategoryForm {
    return new FormGroup(baseCategoryForm());
}

export function toCreateCategoryRequestModel(form: CreateCategoryForm): CreateCategoryRequestModel {
    return {
        categoryName: form.controls.name.value,
        description: form.controls.description.value
    };
}
