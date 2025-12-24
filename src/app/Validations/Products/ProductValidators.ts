import { Validators, ValidatorFn, } from "@angular/forms";

export const ProductValidators = {
    productName: () : ValidatorFn[] => [
        Validators.required,
        Validators.minLength(3),
    ],

    unitPrice: () : ValidatorFn[] => [
        Validators.required,
        Validators.min(0),
    ],

    categoryId: () : ValidatorFn[] => [
        Validators.required,
        Validators.min(1),
    ],
};
