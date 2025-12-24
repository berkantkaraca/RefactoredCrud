import { FormControl } from "@angular/forms";
import { CategoryValidators } from "./CategoryValidators";

export type BaseCategoryForm = {
    name: FormControl<string>;
    description: FormControl<string>;
}

export function baseCategoryForm(): BaseCategoryForm {
    return {
        name: new FormControl<string>('', {
            nonNullable: true,
            validators: CategoryValidators.name(),
        }),
        description: new FormControl<string>('', {
            nonNullable: true,
            validators: CategoryValidators.description(),
        }),
    };
}
