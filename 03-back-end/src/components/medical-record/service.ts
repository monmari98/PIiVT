import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import PatientModel from "../patient/model";
import { IAddMedicalRecord } from "./dto/IAddMedicalRecord";
import { IEditMedicalRecord } from "./dto/IEditMedicalRecord";
import MedicalRecordModel from "./model";


class MedicalRecordModelAdapterOptions implements IModelAdapterOptions {
    loadMedicalRecord: boolean = false;
}

class MedicalRecordSecvice extends BaseService<MedicalRecordModel> {
    protected async adaptModel(data: any, options: Partial<MedicalRecordModelAdapterOptions> = {}): Promise<MedicalRecordModel> {
        const item = new MedicalRecordModel();

        item.medicalRecordId = +(data?.medical_record_id);
        item.tooth = data?.tooth;
        item.patientId = data?.patient_id;

        if (options.loadMedicalRecord) {
            item.patient = await this.services.patientService.getById(item.patientId) as PatientModel;
        }

        return item;
    }

    public async getAll(): Promise<MedicalRecordModel[]|IErrorResponse> {
        return await this.getAllFromTable("medical_record", {loadMedicalRecord: true});
    }

    public async getById(
            medicalRecordId: number, 
            options: Partial<MedicalRecordModelAdapterOptions> = {loadMedicalRecord: true}
        ): Promise<MedicalRecordModel|null|IErrorResponse> {
        return await this.getByIdFromTable("medical_record", medicalRecordId, options);
    }
    public async getAllByPatientId(
            patientId: number, 
            options: Partial<MedicalRecordModelAdapterOptions> = {loadMedicalRecord: true}
        ): Promise<MedicalRecordModel[]|null|IErrorResponse> {
        return await this.getAllByFieldName("medical_record", "patient_id", patientId, options);
    }

    public async add(data: IAddMedicalRecord): Promise<MedicalRecordModel|IErrorResponse> {
        return new Promise<MedicalRecordModel|IErrorResponse>(async resolve => {

            const sql: string = `
                                INSERT 
                                    medical_record 
                                SET 
                                    tooth = ?, 
                                    patient_id = ?;
                                `
            this.db.execute(sql, [
                data.tooth,
                data.patientId,
            ])
                .then(async res => {
                    const newMedicalRecordId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newMedicalRecordId,{loadMedicalRecord: true}));
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
            medicalRecordId: number,
            data: IEditMedicalRecord
        ): Promise<MedicalRecordModel|null|IErrorResponse> {
        const result = await this.getById(medicalRecordId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof MedicalRecordModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const sql: string = `
                                UPDATE 
                                    medical_record 
                                SET 
                                    tooth = ?, 
                                    patient_id = ?
                                WHERE
                                    medical_record_id = ?;
                                `
            this.db.execute(sql, [
                data.tooth,
                data.patientId,
                medicalRecordId
            ])
            .then(async result => {
                resolve(await this.getById(medicalRecordId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(medicalRecordId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `
                DELETE FROM 
                    medical_record 
                WHERE 
                    medical_record_id = ?;`,
                [
                    medicalRecordId
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

export default MedicalRecordSecvice;