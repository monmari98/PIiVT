import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import CategoryModel from "../caregory/model";
import PriceAgeModel from "../price-age/model";
import PriceNameModel from "../price-name/model";
import { IAddService } from "./dto/IAddService";
import { IEditService } from "./dto/IEditService";
import ServiceModel from "./model";


class ServiceModelAdapterOptions implements IModelAdapterOptions {
    loadCategory: boolean = false;
}

class ServiceSecvice extends BaseService<ServiceModel> {
    protected async adaptModel(data: any, options: Partial<ServiceModelAdapterOptions> = {}): Promise<ServiceModel> {
        const item = new ServiceModel();

        item.serviceId = +(data?.service_id);
        item.name = data?.name;
        item.description = data?.description;
        item.stockNumber = data?.stock_number;
        item.categoryId = data?.category_id;
        item.isActive = data?.is_active;

        if (options.loadCategory) {
            item.category = await this.getCategory(item.categoryId) as CategoryModel;
        }

        return item;
    }

    public async getCategory(ServiceId: number): Promise<CategoryModel|IErrorResponse|null> {
        const sql = `
                    SELECT 
                        * 
                    FROM
                        category 
                    WHERE
                        category_id = ?;
                    `;
        const  [rows]  = await this.db.execute(sql, [ ServiceId ]) as any;

        if (!Array.isArray(rows) || rows.length === 0) {
            return null;
        }

        let items = new CategoryModel();
        const priceName = await this.services.categoryService.getPrice(+(rows[0]?.category_id)) as PriceNameModel[];

        items.categoryId = +(rows[0]?.category_id);
        items.name = rows[0]?.name;
        items.description = rows[0]?.description
        items.priceName = priceName;

        return items;
    }

    public async getAll(): Promise<ServiceModel[]|IErrorResponse> {
        return await this.getAllFromTable("service", {loadCategory: true});
    }

    public async getById(
            serviceId: number, 
            options: Partial<ServiceModelAdapterOptions> = {loadCategory: true}
        ): Promise<ServiceModel|null|IErrorResponse> {
        return await this.getByIdFromTable("service", serviceId, options);
    }

    public async add(data: IAddService): Promise<ServiceModel|IErrorResponse> {
        return new Promise<ServiceModel|IErrorResponse>(async resolve => {

            const sql: string = `
                                INSERT 
                                    service 
                                SET 
                                    name = ?, 
                                    description = ?,
                                    stock_number = ?,
                                    category_id = ?;
                                `
            this.db.execute(sql, [
                data.name,
                data.description,
                data.stockNumber,
                data.categoryId,
            ])
                .then(async res => {
                    const newServiceId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newServiceId,{loadCategory: true}));
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
            serviceId: number,
            data: IEditService
        ): Promise<ServiceModel|null|IErrorResponse> {
        const result = await this.getById(serviceId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof ServiceModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const sql: string = `
                                UPDATE 
                                    service 
                                SET 
                                    name = ?, 
                                    description = ?,
                                    stock_number = ?,
                                    category_id = ?,
                                    is_active = ?
                                WHERE
                                    service_id = ?;
                                `
            this.db.execute(sql, [
                data.name,
                data.description,
                data.stockNumber,
                data.categoryId,
                data.isActive,
                serviceId,
            ])
            .then(async result => {
                resolve(await this.getById(serviceId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(serviceId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `
                DELETE FROM 
                    service 
                WHERE 
                    service_id = ?;`,
                [
                    serviceId
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

export default ServiceSecvice;