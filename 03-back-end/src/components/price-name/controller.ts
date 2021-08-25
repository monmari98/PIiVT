import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import PriceNameModel from "./model";
import { IAddPriceName, IAddPriceNameValidator } from "./dto/IAddPriceName";
import { IEditPriceName, IEditPriceNameValidator } from "./dto/IEditPriceName";

class PriceNameController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.priceNameService.getAll());
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const priceNameId: number = +id;

        if (priceNameId <= 0) {
            return res.sendStatus(400);
        }

        const data: PriceNameModel|null|IErrorResponse = await this.services.priceNameService.getById(priceNameId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof PriceNameModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddPriceNameValidator(data)) {            
            return res.status(400).send(IAddPriceNameValidator.errors);
        }

        res.send(await this.services.priceNameService.add(data as IAddPriceName));
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const priceNameId: number = +id

        if (priceNameId <= 0) {
            return res.status(400).send("Invalid ID number");
        }
        if (!IEditPriceNameValidator(data)) {            
            return res.status(400).send(IEditPriceNameValidator.errors);
        }

        const result =  await this.services.priceNameService.edit(priceNameId, data as IEditPriceName);

        if (result === null) {            
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);    

        if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

        res.send(await this.services.priceNameService.delete(id));
    }
}

export default PriceNameController;