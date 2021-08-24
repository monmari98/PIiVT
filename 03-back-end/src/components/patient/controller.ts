import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import PatientModel from "./model";
import { IAddPatient, IAddPatientValidator } from "./dto/IAddPatient";
import { IEditPatient, IEditPAtientValidator } from "./dto/IEditPatient";

class PatientController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.patientService.getAll());
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const patientId: number = +id;

        if (patientId <= 0) {
            return res.sendStatus(400);
        }

        const data: PatientModel|null|IErrorResponse = await this.services.patientService.getById(patientId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof PatientModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddPatientValidator(data)) {            
            return res.status(400).send(IAddPatientValidator.errors);
        }

        res.send(await this.services.patientService.add(data as IAddPatient));
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const patientId: number = +id

        if (patientId <= 0) {
            return res.status(400).send("Invalid ID number");
        }
        if (!IEditPAtientValidator(data)) {            
            return res.status(400).send(IEditPAtientValidator.errors);
        }

        const result =  await this.services.patientService.edit(patientId, data as IEditPatient);

        if (result === null) {            
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);    

        if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

        res.send(await this.services.patientService.delete(id));
    }
}

export default PatientController