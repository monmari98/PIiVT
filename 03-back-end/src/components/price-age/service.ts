import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IAddPriceAge } from "./dto/IAddPriceAge";
import { IEditPriceAge } from "./dto/IEditPriceAge";
import PriceAgeModel from "./model";


class PriceAgeModelAdapterOptions implements IModelAdapterOptions {
    loadPriceName: boolean = false;
}

class PriceAgeSecvice extends BaseService<PriceAgeModel> {
    protected async adaptModel(data: any, options: Partial<PriceAgeModelAdapterOptions> = {}): Promise<PriceAgeModel> {
        const item = new PriceAgeModel();

        item.priceAgeId = +(data?.price_age_id);
        item.name = data?.name;
        item.age = +(data?.age);
        item.amount = +(data?.amount);
        item.priceNameId = +(data?.price_name_id);

        if (options.loadPriceName) {

        }

        return item;
    }

    public async getAll(): Promise<PriceAgeModel[]|IErrorResponse> {
        return await this.getAllFromTable("price_age", {loadPriceName: true});
    }

    public async getById(
            priceAgeId: number, 
            options: Partial<PriceAgeModelAdapterOptions> = {loadPriceName: true}
        ): Promise<PriceAgeModel|null|IErrorResponse> {
        return await this.getByIdFromTable("price_age", priceAgeId, options);
    }

    public async add(data: IAddPriceAge): Promise<PriceAgeModel|IErrorResponse> {
        return new Promise<PriceAgeModel|IErrorResponse>(async resolve => {

            const sql: string = `
                                INSERT 
                                    price_age 
                                SET 
                                    name = ?, 
                                    age = ?,
                                    amount = ?,
                                    price_name_id = ?
                                `
            this.db.execute(sql, [
                data.name,
                data.age,
                data.amount,
                data.priceNameId,
            ])
                .then(async res => {
                    const newPriceAgeId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newPriceAgeId,{loadPriceName: true}));
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
            priceAgeId: number,
            data: IEditPriceAge
        ): Promise<PriceAgeModel|null|IErrorResponse> {
        const result = await this.getById(priceAgeId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof PriceAgeModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const sql: string = `
                                UPDATE 
                                    price_age 
                                SET 
                                    name = ?, 
                                    age = ?,
                                    amount = ?,
                                    price_name_id = ?
                                WHERE
                                    price_age_id = ?;
                                `
            this.db.execute(sql, [
                data.name,
                data.age,
                data.amount,
                data.priceNameId,
                priceAgeId,
            ])
            .then(async result => {
                resolve(await this.getById(priceAgeId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(priceAgeId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `
                DELETE FROM 
                    price_age 
                WHERE 
                    price_age_id = ?;`,
                [
                    priceAgeId
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

export default PriceAgeSecvice;