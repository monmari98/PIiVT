import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import MedicalRecordModel from "./model";
import { IAddMedicalRecord, IAddMedicalRecordValidator, IUploadPhoto } from "./dto/IAddMedicalRecord";
import { IEditMedicalRecord, IEditMedicalRecordValidator } from "./dto/IEditMedicalRecord";
import Config from "../../config/dev";
import { UploadedFile } from "express-fileupload";
import sizeOf from "image-size";
import * as path from "path";
import * as sharp from "sharp";
import {v4} from "uuid";

class MedicalRecordController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.medicalRecordService.getAll());
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const medicalRecordId: number = +id;

        if (medicalRecordId <= 0) {
            return res.sendStatus(400);
        }

        const data: MedicalRecordModel|null|IErrorResponse = await this.services.medicalRecordService.getById(medicalRecordId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof MedicalRecordModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    private isPhotoValid(file: UploadedFile): { isOk: boolean; message?: string; } {
        try {
            const size = sizeOf(file.tempFilePath);
            const limits = Config.fileUpload.photos.limits

            if (size.width < limits.minWidth) {
                return {
                    isOk: false,
                    message: "The image must have a width of at least " + limits.minWidth + "px",
                }
            }
            if (size.height < limits.minHeight) {
                return {
                    isOk: false,
                    message: "The image must have a height of at least " + limits.minHeight + "px",
                }
            }
            if (size.width > limits.maxWidth) {
                return {
                    isOk: false,
                    message: "The image must have a width of maximum " + limits.maxWidth + "px",
                }
            }
            if (size.height > limits.maxHeight) {
                return {
                    isOk: false,
                    message: "The image must have a height of maximum " + limits.maxHeight + "px",
                }
            }

            return {
                isOk:true
            }
        } catch (error) {
            return {
                isOk: false,
                message: "Bad file format",
            }
        }
    }

    private async resizeUploadedPhoto(imagePath: string) {
        const pathPaths = path.parse(imagePath);

        const directory = pathPaths.dir;
        const filename = pathPaths.name;
        const extensions = pathPaths.ext;

        for (const resizeSpecification of Config.fileUpload.photos.resizes) {
            const resizedImagePath = directory + "/" +
                                    filename + 
                                    resizeSpecification.sufix + 
                                    extensions;
            await sharp(imagePath).resize({
                width: resizeSpecification.width,
                height: resizeSpecification.height,
                fit: resizeSpecification.fit,
                background: {r: 255, g: 255, b: 255, alpha: 1.0,},
                withoutEnlargement: true,
            }).toFile(resizedImagePath)
        }
    }

    private async uploadFiles(req: Request, res: Response,): Promise<IUploadPhoto[]> {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send("You must upload at least 1 and maximum of " + Config.fileUpload.maxFiles + " photos")
            return [];
        }

        const fileKeys: string[] = Object.keys(req.files);

        const uploadedPhotos: IUploadPhoto[] = [];

        for (const fileKey of fileKeys) {
            const file = req.files[fileKey] as any;

            const result = this.isPhotoValid(file)
            if (result.isOk === false) {
                res.status(400).send(`error with image key ${fileKey}: ${result.message}`);
                return [];
            }

            const randomString = v4();
            const originalName = file?.name;
            const now = new Date();

            const imagePath = Config.fileUpload.uploadDestinationDirectory + 
                (Config.fileUpload.uploadDestinationDirectory.endsWith("/") ? "" : "/") +
                now.getFullYear() + "/" + 
                ((now.getMonth() + 1) + "").padEnd(2, "0") + "/" +
                randomString + originalName;

            await file.mv(imagePath);

            await this.resizeUploadedPhoto(imagePath);
            
            uploadedPhotos.push({
                imagePath: imagePath,
            });
        }

        return uploadedPhotos;
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const uploadedPhotos = await this.uploadFiles(req, res);

        if (uploadedPhotos.length === 0) {
            return;
        }

        try {
            const data = JSON.parse(req.body?.data);

            if (!IAddMedicalRecordValidator(data)) {
                res.status(400).send(IAddMedicalRecordValidator.errors);
                return;
            }

            const result =  await this.services.medicalRecordService.add(data as IAddMedicalRecord, uploadedPhotos);

            res.send(result);
        } catch (err) {
            res.status(400).send(err?.message)
        }
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const medicalRecordId: number = +id

        if (medicalRecordId <= 0) {
            return res.status(400).send("Invalid ID number");
        }
        if (!IEditMedicalRecordValidator(data)) {            
            return res.status(400).send(IEditMedicalRecordValidator.errors);
        }

        const result =  await this.services.medicalRecordService.edit(medicalRecordId, data as IEditMedicalRecord);

        if (result === null) {            
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);    

        if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

        res.send(await this.services.medicalRecordService.delete(id));
    }

    public async deleteMedicalRecordPhoto(req: Request, res: Response, next: NextFunction) {
        const medicalRecordId: number = +(req.params?.mid);
        const photoId: number = +(req.params?.pid);

        if (medicalRecordId <= 0 || photoId <= 0) {
            return res.sendStatus(400);
        }

        const result = await this.services.medicalRecordService.deleteMedicalRecordPhoto(medicalRecordId, photoId);

        if (result === null) {
            res.sendStatus(404);
            return;
        }

        res.send(result);
    }

    public async addMedicalRecordPhotos(req: Request, res: Response, next: NextFunction) {
        const medicalRecordId: number = +(req.params?.id);

        if (medicalRecordId <= 0) {
            return res.sendStatus(400);
        }

        const data = await this.services.medicalRecordService.getById(medicalRecordId);
        
        if (data === null) {
            res.sendStatus(404);
            return;
        }

        const uploadedPhotos = await this.uploadFiles(req, res);

        if (uploadedPhotos.length === 0) {
            return;
        }

        res.send(await this.services.medicalRecordService.addMedicalRecordPhoto(medicalRecordId, uploadedPhotos));

    }
}

export default MedicalRecordController