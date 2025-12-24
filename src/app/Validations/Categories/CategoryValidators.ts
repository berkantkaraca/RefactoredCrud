import { Validators, ValidatorFn, } from "@angular/forms";

export const CategoryValidators = {
    name: () : ValidatorFn[] => [
        Validators.required,
        Validators.minLength(3),
    ],

    description: () : ValidatorFn[] => [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
    ],
};