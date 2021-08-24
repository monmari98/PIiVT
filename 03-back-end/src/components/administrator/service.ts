import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IAddAdministrator } from "./dto/IAddAdministrator";
import AdministratorModel, { LoginLogModel } from "./model";
import * as bcrypt from "bcrypt";
import { IEditAdministrator } from "./dto/IEditAdministrator";
import { resolve } from "path/posix";

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

    public setLog(fieldName: string, fieldValue: string, administratorId: number|null = null) {
        const logValue = "Unknown " + fieldName + ": " + fieldValue;
        this.db.execute(
            `
                INSERT 
                    login_log
                SET
                    log = ?,
                    administrator_id = ?
            `, 
            [logValue, administratorId]
        )
        
    }

    public async getAllLogs(): Promise<LoginLogModel[]|IErrorResponse> {
        return new Promise<LoginLogModel[]|IErrorResponse>(async resolve => {
            await this.db.execute(
                `
                    SELECT 
                        *
                    FROM
                        login_log;
                `, 
                []
            )
            .then(async ([rows, columns]) => {
                const list: LoginLogModel[] = [];
                if (Array.isArray(rows)) {
                    for (const row of rows) {
                        list.push(row as LoginLogModel)
                    }
                }
                resolve(list);
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        })
    }
    public async getLogsByAdministratorId(administratorId: number): Promise<LoginLogModel[]|IErrorResponse> {
        return new Promise<LoginLogModel[]|IErrorResponse>(async resolve => {
            await this.db.execute(
                `
                    SELECT 
                        *
                    FROM
                        login_log
                    WHERE
                        administrator_id = ?;
                `, 
                [administratorId]
            )
            .then(async ([rows, columns]) => {
                const list: LoginLogModel[] = [];
                if (Array.isArray(rows)) {
                    for (const row of rows) {
                        list.push(row as LoginLogModel)
                    }
                }
                resolve(list);
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        })
    }

    public async getByUsername(username: string): Promise<AdministratorModel|null> {
        const administrator =  await this.getAllByFieldName("administrator", "username", username);

        if (!Array.isArray(administrator) || administrator.length === 0) {
            await this.setLog("username", username);
            return null;
        }

        return administrator[0];
    }

    public async add(data: IAddAdministrator): Promise<AdministratorModel|IErrorResponse> {
        return new Promise<AdministratorModel|IErrorResponse>(async resolve => {
            const passwordHash = bcrypt.hashSync(data.password, 11)

            const sql: string = `
                                INSERT 
                                    administrator 
                                SET 
                                    username = ?, 
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