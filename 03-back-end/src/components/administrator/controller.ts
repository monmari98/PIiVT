import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import AdministratorModel from "./model";
import IErrorResponse from "../../common/IErrorResponse.interface";

class AdministratorController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        const administrators = await this.services.administratorService.getAll();
        res.send(administrators);
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const administratorId: number = +id;

        if (administratorId <= 0) {
            res.sendStatus(400);
            return;
        }

        const data: AdministratorModel|null|IErrorResponse = await this.services.administratorService.getById(administratorId);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof AdministratorModel) {
            res.send(data);
            return;
        }

        res.status(500).send(data);
    }
}

export default AdministratorController