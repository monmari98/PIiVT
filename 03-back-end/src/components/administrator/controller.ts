import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import AdministratorModel from "./model";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddAdministrator, IAddAdministratorValidator } from "./dto/IAddAdministrator";
import { IEditAdministrator, IEditAdministratorValidator } from "./dto/IEditAdministrator";

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

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddAdministratorValidator(data)) {
            res.status(400).send(IAddAdministratorValidator.errors);
            return;
        }

        const result =  await this.services.administratorService.add(data as IAddAdministrator);

        res.send(result);
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const administratorId: number = +id

        if (administratorId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }
        if (!IEditAdministratorValidator(data)) {
            res.status(400).send(IEditAdministratorValidator.errors);
            return;
        }

        const result =  await this.services.administratorService.edit(administratorId, data as IEditAdministrator);

        if (result === null) {
            res.sendStatus(404);
            return;
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);    

        if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

        res.send(await this.services.administratorService.delete(id));
    }

    public async getAllLogs(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.administratorService.getAllLogs());
    }
    public async getLogsByAdministratorId(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.administratorService.getLogsByAdministratorId(+(req.params.aid)));
    }
}

export default AdministratorController