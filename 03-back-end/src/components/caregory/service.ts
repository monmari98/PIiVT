import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import PriceAgeModel from "../price-age/model";
import PriceNameModel from "../price-name/model";
import { IAddCategory } from "./dto/IAddCategory";
import { IEditCategory } from "./dto/IEditCategory";
import CategoryModel from "./model";


class CategoryModelAdapterOptions implements IModelAdapterOptions {
    loadPriceName: boolean = false;
}

class CategorySecvice extends BaseService<CategoryModel> {
    protected async adaptModel(data: any, options: Partial<CategoryModelAdapterOptions> = {}): Promise<CategoryModel> {
        const item = new CategoryModel();

        item.categoryId = +(data?.category_id);
        item.name = data?.name;
        item.description = data?.description;

        if (options.loadPriceName) {
            item.priceName = await this.getPrice(item.categoryId) as PriceNameModel[];
        }

        return item;
    }

    public async getPrice(categoryId: number): Promise<PriceNameModel[]|IErrorResponse> {
        
        const sql = `
                    SELECT 
                        * 
                    FROM
                        price_name 
                    WHERE
                        category_id = ?;
                    `;
        const [ rows ] = await this.db.execute(sql, [ categoryId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }


        const items: PriceNameModel[] = [];

        for (const row of rows as any) {
            const priceAge = await this.services.priceNameService.getPriceAge(+(row?.price_name_id)) as PriceAgeModel[];
            items.push({
                priceNameId: +(row?.price_name_id),
                name: row?.name,
                categoryId: +(row.price_name_id),
                priceAge: priceAge,
            });
        }

        return items;
    }

    public async getAll(): Promise<CategoryModel[]|IErrorResponse> {
        return await this.getAllFromTable("category", {loadPriceName: true});
    }

    public async getById(
            categoryId: number, 
            options: Partial<CategoryModelAdapterOptions> = {loadPriceName: true}
        ): Promise<CategoryModel|null|IErrorResponse> {
        return await this.getByIdFromTable("category", categoryId, options);
    }

    public async add(data: IAddCategory): Promise<CategoryModel|IErrorResponse> {
        return new Promise<CategoryModel|IErrorResponse>(async resolve => {

            const sql: string = `
                                INSERT 
                                    category 
                                SET 
                                    name = ?, 
                                    description = ?
                                `
            this.db.execute(sql, [
                data.name,
                data.description,
            ])
                .then(async res => {
                    const newCategoryId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newCategoryId,{loadPriceName: true}));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });
        });
    }

    public async edit(
            categoryId: number,
            data: IEditCategory
        ): Promise<CategoryModel|null|IErrorResponse> {
        const result = await this.getById(categoryId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof CategoryModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const sql: string = `
                                UPDATE 
                                    category 
                                SET 
                                    name = ?, 
                                    description = ?
                                WHERE
                                    category_id = ?;
                                `
            this.db.execute(sql, [
                data.name,
                data.description,
                categoryId,
            ])
            .then(async result => {
                resolve(await this.getById(categoryId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(categoryId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `
                DELETE FROM 
                    category 
                WHERE 
                    category_id = ?;`,
                [
                    categoryId
                ]
            )
            .then(res => {
                resolve({
                    errorCode: 0,
                    errorMessage: `Deleted ${(res as any[])[0]?.affectedRows} records.`
                });
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        })
    }
}

export default CategorySecvice;