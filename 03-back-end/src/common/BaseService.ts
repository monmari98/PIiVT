import IModel from "./IModel.interface";
import * as mysql2 from "mysql2/promise";
import IModelAdapterOptions from "./IModelAdapterOptions.interface";
import IErrorResponse from "./IErrorResponse.interface";
import IApplicationResources from "./IApplicationResources.interface";
import IServices from "./IServices.interface";

export default abstract class BaseService<ReturnModel extends IModel> {
    private resources: IApplicationResources;
    // private dbConnection: mysql2.Connection;
    // private allServices: IServices;

    constructor(resources: IApplicationResources) {
        this.resources = resources;
    }

    protected get db(): mysql2.Connection {
        return this.resources.databaseConnection;
    }

    protected get services(): IServices {
        return this.resources.services;
    }

    protected abstract adaptModel(row: any, options: Partial<IModelAdapterOptions>): Promise<ReturnModel>;

    protected async getAllFromTable<AdapterOptions extends IModelAdapterOptions>(
        tableName: string, 
        options: Partial<AdapterOptions> = {}
    ): Promise<ReturnModel[] | IErrorResponse> {
        return new Promise<ReturnModel[]|IErrorResponse>(async (resolve) => {
            const sql: string = `SELECT * FROM ${tableName};`
            this.db.execute(sql)
                .then(async ([rows, columns]) => {
                    const lista: ReturnModel[] = [];

                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            lista.push(await this.adaptModel(row, options))
                        }
                    }
                    resolve(lista);
                })
                .catch((error) => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });
            
            
        });
    }

    protected async getByIdFromTable<AdapterOptions extends IModelAdapterOptions>(
        tableName: string,
        id: number,
        options: Partial<AdapterOptions> = {}
    ): Promise<ReturnModel|null|IErrorResponse> {
        try {
            const sql: string = `SELECT * FROM ${tableName} WHERE ${tableName}_id = ?;`;
            const [rows, columns] = await this.db.execute(sql, [id])
            
            if (!Array.isArray(rows)) {
                return null;
            }

            if (rows.length === 0) {
                return null;
            }

            return await this.adaptModel(rows[0], options);
        } catch (error) {
            return {
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
            }
        }
    }

    protected async getAllByFieldName<AdapterOptions extends IModelAdapterOptions>(
        tableName: string, 
        fieldName: string, 
        fieldValue: any, 
        options: Partial<AdapterOptions> = {}
    ): Promise<ReturnModel[]|IErrorResponse> {
        return new Promise<ReturnModel[]|IErrorResponse>(async (resolve) => {
            let sql: string = `SELECT * FROM ${tableName} WHERE ${fieldName} = ?;`

            if (fieldValue === null) {
                sql = `SELECT * FROM ${tableName} WHERE ${fieldName} is NULL;`
            }
            
            this.db.execute(sql, [fieldValue])
                .then(async ([rows, columns]) => {
                    const lista: ReturnModel[] = [];

                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            lista.push(await this.adaptModel(row, options))
                        }
                    }
                    resolve(lista);
                })
                .catch((error) => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });
            
            
        });
    }
}