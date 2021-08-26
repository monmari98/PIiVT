import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import PatientModel from "../patient/model";
import { IAddMedicalRecord, IUploadPhoto } from "./dto/IAddMedicalRecord";
import { IEditMedicalRecord } from "./dto/IEditMedicalRecord";
import MedicalRecordModel, { Photo } from "./model";
import * as fs from "fs";
import * as path from "path";
import Config from "../../config/dev";

class MedicalRecordModelAdapterOptions implements IModelAdapterOptions {
    loadMedicalRecord: boolean = false;
    loadPhoto: boolean = true;
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
        if (options.loadPhoto) {
            item.photo = await this.getPhotoByPhotoId(item.medicalRecordId) as Photo[];
        }

        return item;
    }

    private async getPhotoByPhotoId(medicalRecirdId: number): Promise<Photo[]> {
        const sql = `SELECT * FROM photo WHERE medical_record_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ medicalRecirdId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        return rows.map(data => {
            return {
                photoId: +(data?.photo_id),
                imagePath: data?.image_path,
            }
        });

    }

    public async getAll(): Promise<MedicalRecordModel[]|IErrorResponse> {
        return await this.getAllFromTable("medical_record", {
            loadMedicalRecord: true,
            loadPhoto: true,
        });
    }

    public async getById(
            medicalRecordId: number, 
            options: Partial<MedicalRecordModelAdapterOptions> = {
                loadMedicalRecord: true,
                loadPhoto: true,
            }
        ): Promise<MedicalRecordModel|null|IErrorResponse> {
        return await this.getByIdFromTable("medical_record", medicalRecordId, options);
    }
    public async getAllByPatientId(
            patientId: number, 
            options: Partial<MedicalRecordModelAdapterOptions> = {
                loadMedicalRecord: true,
                loadPhoto: true,
            }
        ): Promise<MedicalRecordModel[]|null|IErrorResponse> {
        return await this.getAllByFieldName("medical_record", "patient_id", patientId, options);
    }

    public async add(data: IAddMedicalRecord, uploadPhotos: IUploadPhoto[]): Promise<MedicalRecordModel|IErrorResponse> {
        return new Promise<MedicalRecordModel|IErrorResponse>(async resolve => {
                this.db.beginTransaction()
                .then(() => {
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
                    ]).then(async (res: any) => {
                        const newMedicalRecordId: number = +((res[0] as any)?.insertId);

                        const promises = [];

                        for (const uploadPhoto of uploadPhotos) {
                            promises.push(
                                this.db.execute(
                                    `INSERT photo SET medical_record_id = ?, image_path = ?;`,
                                    [newMedicalRecordId, uploadPhoto.imagePath,]
                                ),
                            );
                        }



                        Promise.all(promises)
                            .then(async () => {
                                await this.db.commit();
                                resolve(await this.getById(newMedicalRecordId, {
                                    loadMedicalRecord: true,
                                    loadPhoto: true,
                                }))
                            })
                            .catch(async error => {
                                await this.db.rollback();
                                resolve({
                                    errorCode: error?.errno,
                                    errorMessage: error?.sqlMessage
                                })
                            })
                    });
                })
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
            const currentMedicalRecord = await this.getById(medicalRecordId,{
                loadPhoto: true,
            });

            if (currentMedicalRecord === null) {
                resolve(null);
                return;
            }

            this.db.beginTransaction()
                .then(async () => {
                    if (await this.deleteMedicalRecordCart(medicalRecordId)) {
                        return;
                    }

                    throw {
                        errno: -1002,
                        sqlMessage: "Could not delete medical record cart records",
                    }
                })
                .then(async () => {
                    const filesToDelete = await this.deletePhotosRecord(medicalRecordId)
                    if (filesToDelete.length !== 0) {
                        return filesToDelete;
                    }

                    throw {
                        errno: -1003,
                        sqlMessage: "Could not delete medical record photo record",
                    }
                })
                .then(async (filesToDelete) => {
                    if (await this.deleteMedicalRecords(medicalRecordId)) return filesToDelete;
                    throw {
                        errno: -1004,
                        sqlMessage: "Could not delete medical record",
                    }
                })
                .then(async (filesToDelete) => {
                    await this.db.commit();
                    return filesToDelete;
                })
                .then(async (filesToDelete) => {
                    this.deleteMedicalRecordPhotosAndResizedVersions(filesToDelete);
                })
                .then(() => {
                    resolve({
                        errorCode: 0,
                        errorMessage: "Medical record deleted"
                    })
                })
                .catch(async error => {
                    await this.db.rollback();
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                })
        })
    }

    
    private async deleteMedicalRecordCart(medicalRecordId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM service_medical_record WHERE medical_record_id = ?;`,
                [medicalRecordId]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false))
        })
    }

    private async deletePhotosRecord(medicalRecirdId: number): Promise<string[]> {
        return new Promise<string[]>(async resolve => {
            const [rows] = await this.db.execute(
                `SELECT image_path FROM photo WHERE medical_record_id = ?`,
                [medicalRecirdId]
            );

            if (!Array.isArray(rows) || rows.length === 0) {
                console.log(rows)
                return resolve([]);
            }

            const filesToDelete = rows.map(row => row?.image_path);

            this.db.execute(
                `DELETE FROM photo WHERE medical_record_id = ?`,
                [medicalRecirdId]
            )
            .then(() => resolve(filesToDelete))
            .catch(() => resolve([]))

            resolve(filesToDelete)
        })
    }

    private async deleteMedicalRecords(medicalRecirdId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM medical_record where medical_record_id = ?;`,
                [medicalRecirdId]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false))
        })
    }

    private deleteMedicalRecordPhotosAndResizedVersions(filesToDelete: string[]) {
        try {
            for (const file of filesToDelete) {
                fs.unlinkSync(file);
                const pathPaths = path.parse(file);

                const directory = pathPaths.dir;
                const filename = pathPaths.name;
                const extensions = pathPaths.ext;

                for (const resizeSpecification of Config.fileUpload.photos.resizes) {
                    const resizedImagePath = directory + "/" +
                                            filename + 
                                            resizeSpecification.sufix + 
                                            extensions;
                    
                    fs.unlinkSync(resizedImagePath);
                }
            }
        } catch (e) {
            
        }
    }

    public async deleteMedicalRecordPhoto(medicalRecordId: number, photoId: number): Promise<IErrorResponse|null> {
        return new Promise<IErrorResponse|null>(async resolve => {
            const medicalRecord = await this.getById(medicalRecordId,{loadPhoto: true});
            if (medicalRecord === null) {
                resolve(null);
                return;
            }

            const filteredPhotos = (medicalRecord as MedicalRecordModel).photo.filter(p => p.photoId === photoId)

            if (filteredPhotos.length === 0){
                resolve(null);
                return;
            } 

            const photo = filteredPhotos[0];

            this.db.execute(
                `DELETE FROM photo WHERE photo_id = ?`,
                [photo.photoId]
            )
            .then(() => {
                this.deleteMedicalRecordPhotosAndResizedVersions([
                    // photo.imagePath
                ])

                resolve({
                    errorCode: 0,
                    errorMessage: "Photo deleted"
                })
            })
            .catch((error) => resolve({
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
            }))

        })
    }

    public async addMedicalRecordPhoto(medicalRecordId: number, uploadPhotos: IUploadPhoto[]): Promise<MedicalRecordModel|IErrorResponse|null> {
        return new Promise<MedicalRecordModel|IErrorResponse|null>(async resolve => {
            const medicalRecord = await this.getById(medicalRecordId,{loadPhoto: true});

            if (medicalRecord === null) {
                resolve(null);
                return;
            }

            this.db.beginTransaction()
                .then(() => {
                    const promises = [];

                    for (const uploadPhoto of uploadPhotos) {
                        promises.push(
                            this.db.execute(
                                `INSERT photo SET medical_record_id = ?, image_path = ?;`,
                                [medicalRecordId, uploadPhoto.imagePath,]
                            ),
                        );
                    }

                    Promise.all(promises)
                        .then(async () => {
                            await this.db.commit();
                            resolve(await this.getById(medicalRecordId, {loadMedicalRecord:true, loadPhoto: true}))
                        })
                        .catch(async error => {
                            await this.db.rollback();
                            resolve({
                                errorCode: error?.errno,
                                errorMessage: error?.sqlMessage
                            })
                        })
                });
                resolve(await this.getById(medicalRecordId, {}))  
            })
    }
}

export default MedicalRecordSecvice;