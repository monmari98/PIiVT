import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import PriceAgeModel from "../price-age/model";
import { IAddPriceName } from "./dto/IAddPriceName";
import { IEditPriceName } from "./dto/IEditPriceName";
import PriceNameModel from "./model";


class PriceNameModelAdapterOptions implements IModelAdapterOptions {
    loadPriceAge: boolean = false;
}

class PriceNameSecvice extends BaseService<PriceNameModel> {
    protected async adaptModel(data: any, options: Partial<PriceNameModelAdapterOptions> = {}): Promise<PriceNameModel> {
        const item = new PriceNameModel();

        item.priceNameId = +(data?.price_name_id);
        item.name = data?.name;
        item.categoryId = +(data?.category_id);

        if (options.loadPriceAge) {
            item.priceAge = await this.getPriceAge(item.priceNameId) as PriceAgeModel[];
        }

        return item;
    }

    public async getPriceAge(priceNameId: number): Promise<PriceAgeModel[]|IErrorResponse> {
        
        const sql = `
                    SELECT 
                        * 
                    FROM
                        price_age 
                    WHERE
                        price_name_id = ?;
                    `;
        const [ rows ] = await this.db.execute(sql, [ priceNameId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        return rows.map(row => {
            return {
                priceAgeId: +(row?.price_age_id),
                name: row?.name,
                age: +(row?.age),
                amount: +(row?.amount),
                priceNameId: +(row?.price_name_id),
            }
        });
    }

    public async getAll(): Promise<PriceNameModel[]|IErrorResponse> {
        return await this.getAllFromTable("price_name", {loadPriceAge: true});
    }

    public async getById(
            priceNameId: number, 
            options: Partial<PriceNameModelAdapterOptions> = {loadPriceAge: true}
        ): Promise<PriceNameModel|null|IErrorResponse> {
        return await this.getByIdFromTable("price_name", priceNameId, options);
    }

    public async add(data: IAddPriceName): Promise<PriceNameModel|IErrorResponse> {
        return new Promise<PriceNameModel|IErrorResponse>(async resolve => {

            const sql: string = `
                                INSERT 
                                    price_name 
                                SET 
                                    name = ?, 
                                    category_id = ?
                                `
            this.db.execute(sql, [
                data.name,
                data.categoryId,
            ])
                .then(async res => {
                    const newPriceNameId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newPriceNameId,{loadPriceAge: true}));
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
            priceNameId: number,
            data: IEditPriceName
        ): Promise<PriceNameModel|null|IErrorResponse> {
        const result = await this.getById(priceNameId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof PriceNameModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const sql: string = `
                                UPDATE 
                                    price_name 
                                SET 
                                    name = ?, 
                                    category_id = ?
                                WHERE
                                    price_name_id = ?;
                                `
            this.db.execute(sql, [
                data.name,
                data.categoryId,
                priceNameId,
            ])
            .then(async result => {
                resolve(await this.getById(priceNameId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(priceNameId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `
                DELETE FROM 
                    price_name 
                WHERE 
                    price_name_id = ?;`,
                [
                    priceNameId
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

export default PriceNameSecvice;