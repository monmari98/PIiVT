import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IAddAdministrator } from "./dto/IAddAdministrator";
import AdministratorModel from "./model";
import * as bcrypt from "bcrypt";
import { IEditAdministrator } from "./dto/IEditAdministrator";

class AdministratorModelAdapterOptions implements IModelAdapterOptions {

}

class AdministratorSecvice extends BaseService<AdministratorModel> {
    protected async adaptModel(data: any, options: Partial<AdministratorModelAdapterOptions> = {}): Promise<AdministratorModel> {
        const item = new AdministratorModel();

        item.administratorId = data?.administrator_id;
        item.username = data?.username;
        item.passwordHash = data?.password_hash;

        return item;
    }

    public async getAll(): Promise<AdministratorModel[]|IErrorResponse> {
        return await this.getAllFromTable("administrator");
    }

    public async getById(administratorId: number): Promise<AdministratorModel|null|IErrorResponse> {
        return await this.getByIdFromTable("administrator", administratorId);
    }

    public async add(data: IAddAdministrator): Promise<AdministratorModel|IErrorResponse> {
        return new Promise<AdministratorModel|IErrorResponse>(async resolve => {
            const passwordHash = bcrypt.hashSync(data.password, 11)

            const sql: string = `
                                INSERT 
                                    administrator 
                                SET username = ?, 
                                password_hash = ?;
                                `
            this.db.execute(sql, [data.username, passwordHash])
                .then(async res => {
                    const newAdministratorId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newAdministratorId));
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
            administratorId: number,
            data: IEditAdministrator
        ): Promise<AdministratorModel|null|IErrorResponse> {
        const result = await this.getById(administratorId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof AdministratorModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const passwordHash = bcrypt.hashSync(data.password, 11);

            const sql: string = `
                                UPDATE 
                                    administrator 
                                SET 
                                    username = ?,
                                    password_hash = ?
                                WHERE
                                    administrator_id = ?;
                                `
            this.db.execute(sql, [data.username, passwordHash, administratorId])
            .then(async result => {
                resolve(await this.getById(administratorId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(administratorId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `
                DELETE FROM 
                    administrator 
                WHERE 
                    administrator_id = ?;`,
                [
                    administratorId
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

export default AdministratorSecvice;