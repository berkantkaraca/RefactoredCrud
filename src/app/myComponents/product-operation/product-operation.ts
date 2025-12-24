import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ProductApi } from '../../DataAccess/product-api';
import { CategoryApi } from '../../DataAccess/category-api';
import { ProductResponseModel } from '../../Models/Products/ProductResponseModel';
import { CategoryResponseModel } from '../../Models/Categories/CategoryResponseModel';
import { createProductForm, toCreateProductRequestModel } from '../../Validations/Products/CreateProductFormFactory';
import { updateProductForm, toUpdateProductRequestModel } from '../../Validations/Products/UpdateProductFormFactory';

@Component({
  selector: 'app-product-operation',
  imports: [ReactiveFormsModule],
  templateUrl: './product-operation.html',
  styleUrl: './product-operation.css',
})
export class ProductOperation implements OnInit {

  private productApi = inject(ProductApi);
  private categoryApi = inject(CategoryApi);

  protected products = signal<ProductResponseModel[]>([]);
  protected categories = signal<CategoryResponseModel[]>([]);
  protected selectedProduct = signal<ProductResponseModel | null>(null);

  //UI State formları
  protected createForm = createProductForm();
  protected updateForm = updateProductForm();

  private async refreshProducts(): Promise<void> {
    try {
      const productList = await this.productApi.getAll();
      this.products.set(productList);
    } catch (error) {
      console.error('Ürün listesi alınamadı:', error);
    }
  }

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
    await this.refreshProducts();
  }

  protected getCategoryName(categoryId: number): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category ? category.categoryName : 'Bilinmiyor';
  }

  //Create 
  async onCreate(): Promise<void> {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const req = toCreateProductRequestModel(this.createForm);
    await this.productApi.create(req);
    this.createForm.reset();
    await this.refreshProducts();
  }

  //Update
  startUpdate(product: ProductResponseModel) {
    this.selectedProduct.set(product);

    this.updateForm.patchValue(
      {
        id: product.id,
        productName: product.productName,
        unitPrice: product.unitPrice,
        categoryId: product.categoryId
      },
      { emitEvent: false }
    );
  }

  cancelUpdate() {
    this.selectedProduct.set(null);
    this.updateForm.reset({ id: 0, productName: '', unitPrice: 0, categoryId: 0 });
  }

  async onUpdate(): Promise<void> {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const req = toUpdateProductRequestModel(this.updateForm);
    await this.productApi.update(req);
    this.cancelUpdate();
    await this.refreshProducts();
  }

  //Delete
  async onDelete(id: number): Promise<void> {
    const confirmDelete = confirm(`Id'si ${id} olan ürün silinecek. Onaylıyor musunuz?`);

    if (!confirmDelete) {
      return;
    }

    try {
      const message = await this.productApi.deleteById(id);
      console.log(message);

      this.products.update(x => x.filter(p => p.id !== id));

      const selected = this.selectedProduct();
      if (selected && selected.id === id) {
        this.selectedProduct.set(null);
      }


    } catch (error) {
      console.error('Ürün silme işlemi başarısız oldu:', error);
    }
  }

  protected labels: Record<string, string> = {
    productName: 'Ürün Adı',
    unitPrice: 'Birim Fiyatı',
    categoryId: 'Kategori Id',
    id: 'Id'
  };

  protected getErrorMessage(control: AbstractControl | null, label = 'Bu alan'): string | null {
    if (!control || (!control.touched && !control.dirty) || !control.invalid ) 
      return null;
    else if(control.hasError('required'))
      return `${label} zorunludur.`;
    else if(control.hasError('minlength')){
      const e = control.getError('minlength');
      return `${label} en az ${e.requiredLength} karakter olmalıdır. (Şu an ${e.actualLength})`;
    }
    else if(control.hasError('maxlength')){
      const e = control.getError('maxlength');
      return `${label} en fazla ${e.requiredLength} karakter olmalıdır. (Şu an ${e.actualLength})`;
    }
    else if(control.hasError('min')){
      const e = control.getError('min');
      return `${label} en az ${e.min} olmalıdır.`;
    }
    else if(control.hasError('max')){
      const e = control.getError('max');
      return `${label} en fazla ${e.max} olmalıdır.`;
    }

    return `${label} geçersizdir.`;
  }

  protected getErrorMessageByName(form: {controls: Record<string, AbstractControl>}, controlName: string): string | null {
    const control = form.controls[controlName];
    const label = this.labels[controlName] ?? 'Bu alan';
    
    return this.getErrorMessage(control, label);
  }
}
