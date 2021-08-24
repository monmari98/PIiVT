import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import MedicalRecordModel from "./model";
import { IAddMedicalRecord, IAddMedicalRecordValidator } from "./dto/IAddMedicalRecord";
import { IEditMedicalRecord, IEditMedicalRecordValidator } from "./dto/IEditMedicalRecord";

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

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddMedicalRecordValidator(data)) {            
            return res.status(400).send(IAddMedicalRecordValidator.errors);
        }

        res.send(await this.services.medicalRecordService.add(data as IAddMedicalRecord));
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
}

export default MedicalRecordController