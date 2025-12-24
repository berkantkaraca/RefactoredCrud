import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { API_Config } from "../api.config";
import { CreateCategoryRequestModel } from "../../Models/Categories/CreateCategoryRequestModel";
import { UpdateCategoryRequestModel } from "../../Models/Categories/UpdateCategoryRequestModel";
import { CategoryResponseModel } from "../../Models/Categories/CategoryResponseModel";

@Injectable({
    providedIn: 'root'
})
export class CategoryApi {
    private http = inject(HttpClient);
    private readonly url = `${API_Config.baseUrl}/${API_Config.enpoints.category}`;

    //Get List
    async getAll(): Promise<CategoryResponseModel[]> {
        return await lastValueFrom(this.http.get<CategoryResponseModel[]>(this.url));
    }

    //Create
    async create(body: CreateCategoryRequestModel): Promise<string> {
        return await lastValueFrom(this.http.post(this.url, body, { responseType: 'text' }));
    }

    //Update
    async update(body: UpdateCategoryRequestModel): Promise<string> {
        return await lastValueFrom(this.http.put(this.url, body, { responseType: 'text' }));
    }

    //Delete
    async deleteById(id: number): Promise<string> {
        return await lastValueFrom(this.http.delete(this.url, {body: id, responseType: 'text' }));
    }
}






