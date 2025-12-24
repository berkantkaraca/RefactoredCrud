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
export class CategoryOperation implements OnInit {

  private categoryApi = inject(CategoryApi);

  protected categories = signal<CategoryResponseModel[]>([]);
  protected selectedCategory = signal<CategoryResponseModel | null>(null);

  //UI State formları
  protected createForm = createCategoryForm();
  protected updateForm = updateCategoryForm();

  private async refreshCategories(): Promise<void> {
    try {
      const categoryList = await this.categoryApi.getAll();
      this.categories.set(categoryList);
    } catch (error) {
      console.error('Kategori listesi alınamadı:', error);
    }
  }

  async ngOnInit(): Promise<void> {
    await this.refreshCategories();
  }

  //Create 
  async onCreate(): Promise<void> {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const req = toCreateCategoryRequestModel(this.createForm);
    await this.categoryApi.create(req);
    this.createForm.reset();
    await this.refreshCategories();
  }

  //Update
  startUpdate(cat: CategoryResponseModel) {
    this.selectedCategory.set(cat);

    this.updateForm.patchValue(
      {
        id: cat.id,
        name: cat.categoryName,
        description: cat.description
      },
      { emitEvent: false }
    );
  }

  cancelUpdate() {
    this.selectedCategory.set(null);
    this.updateForm.reset({ id: 0, name: '', description: '' });
  }

  async onUpdate(): Promise<void> {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const req = toUpdateCategoryRequestModel(this.updateForm);
    await this.categoryApi.update(req);
    this.cancelUpdate();
    await this.refreshCategories();
  }

  //Delete
  async onDelete(id: number): Promise<void> {
    const confirmDelete = confirm(`Id'si ${id} olan kategori silinecek. Onaylıyor musunuz?`);

    if (!confirmDelete) {
      return;
    }

    try {
      const message = await this.categoryApi.deleteById(id);
      console.log(message);

      this.categories.update(x => x.filter(c => c.id !== id));

      const selected = this.selectedCategory();
      if (selected && selected.id === id) {
        this.selectedCategory.set(null);
      }


    } catch (error) {
      console.error('Kategori silme işlemi başarısız oldu:', error);
    }
  }

  protected labels: Record<string, string> = {
    name: 'Kategori Adı',
    description: 'Açıklama',
    id: 'Id'
  };

  protected getErrorMessage(control: AbstractControl | null, label = 'Bu alan'): string | null {
    if (!control || (!control.touched && !control.dirty) || !control.invalid ) 
      return null;
    else if(control.hasError('required'))
      return `${label} zorunludur.`;
    else if(control.hasError('minlength')){
      const e = control.getError('minlength'); //requiredLength, actualLength sağlar
      return `${label} en az ${e.requiredLength} karakter olmalıdır. (Şu an ${e.actualLength})`;
    }
    else if(control.hasError('maxlength')){
      const e = control.getError('maxlength');
      return `${label} en fazla ${e.requiredLength} karakter olmalıdır. (Şu an ${e.actualLength})`;
    }

    return `${label} geçersizdir.`;
  }

  protected getErrorMessageByName(form: {controls: Record<string, AbstractControl>}, controlName: string): string | null {
    const control = form.controls[controlName];
    const label = this.labels[controlName] ?? 'Bu alan';
    
    return this.getErrorMessage(control, label);
  }
}