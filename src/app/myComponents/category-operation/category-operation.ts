import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CategoryApi } from '../../DataAccess/category-api';
import { CategoryResponseModel } from '../../../Models/Categories/CategoryResponseModel';
import { createCategoryForm, toCreateCategoryRequestModel } from '../../Validations/Categories/CreateCategoryFormFactory';
import { updateCategoryForm, toUpdateCategoryRequestModel } from '../../Validations/Categories/UpdateCategoryFormFactory';

//http yerine data access servisi inject edilecek

@Component({
  selector: 'app-category-operation',
  imports: [ReactiveFormsModule],
  templateUrl: './category-operation.html',
  styleUrl: './category-operation.css',
})
export class CategoryOperation {

}
