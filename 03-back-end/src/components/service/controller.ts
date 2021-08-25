import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import ServiceModel from "./model";
import { IAddService, IAddServiceValidator } from "./dto/IAddService";
import { IEditService, IEditServiceValidator } from "./dto/IEditService";

class ServiceController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.serviceService.getAll());
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const serviceId: number = +id;

        if (serviceId <= 0) {
            return res.sendStatus(400);
        }

        const data: ServiceModel|null|IErrorResponse = await this.services.serviceService.getById(serviceId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof ServiceModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddServiceValidator(data)) {            
            return res.status(400).send(IAddServiceValidator.errors);
        }

        res.send(await this.services.serviceService.add(data as IAddService));
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const serviceId: number = +id

        if (serviceId <= 0) {
            return res.status(400).send("Invalid ID number");
        }
        if (!IEditServiceValidator(data)) {            
            return res.status(400).send(IEditServiceValidator.errors);
        }

        const result =  await this.services.serviceService.edit(serviceId, data as IEditService);

        if (result === null) {            
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);    

        if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

        res.send(await this.services.serviceService.delete(id));
    }
}

export default ServiceController;