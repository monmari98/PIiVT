import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IAddPatient } from "./dto/IAddPatient";
import { IEditPatient } from "./dto/IEditPatient";
import PatientModel from "./model";

class PatientModelAdapterOptions implements IModelAdapterOptions {

}

class PatientSecvice extends BaseService<PatientModel> {
    protected async adaptModel(data: any, options: Partial<PatientModelAdapterOptions> = {}): Promise<PatientModel> {
        const item = new PatientModel();

        item.patientId = +(data?.patient_id);
        item.firstName = data?.first_name;
        item.lastName = data?.last_name;
        item.jmbg = data?.jmbg;
        item.email = data?.email;
        item.age = +(data?.age);
        item.isActive = +(data?.is_active) === 1;

        return item;
    }

    public async getAll(): Promise<PatientModel[]|IErrorResponse> {
        return await this.getAllFromTable("patient");
    }

    public async getById(patientId: number): Promise<PatientModel|null|IErrorResponse> {
        return await this.getByIdFromTable("patient", patientId);
    }

    public async add(data: IAddPatient): Promise<PatientModel|IErrorResponse> {
        return new Promise<PatientModel|IErrorResponse>(async resolve => {

            const sql: string = `
                                INSERT 
                                    patient 
                                SET 
                                    first_name = ?, 
                                    last_name = ?,
                                    jmbg = ?,
                                    email = ?,
                                    age = ?;
                                `
            this.db.execute(sql, [
                data.firstName,
                data.lastName,
                data.jmbg,
                data.email,
                data.age,
            ])
                .then(async res => {
                    const newPatientId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newPatientId));
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
            patientId: number,
            data: IEditPatient
        ): Promise<PatientModel|null|IErrorResponse> {
        const result = await this.getById(patientId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof PatientModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const sql: string = `
                                UPDATE 
                                    patient 
                                SET 
                                    first_name = ?, 
                                    last_name = ?,
                                    jmbg = ?,
                                    email = ?,
                                    age = ?,
                                    is_active = ? 
                                WHERE
                                    patient_id = ?;
                                `
            this.db.execute(sql, [
                data.firstName,
                data.lastName,
                data.jmbg,
                data.email,
                data.age,
                data.isActive,
                patientId,
            ])
            .then(async result => {
                resolve(await this.getById(patientId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(patientId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `
                DELETE FROM 
                    patient 
                WHERE 
                    patient_id = ?;`,
                [
                    patientId
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

export default PatientSecvice;