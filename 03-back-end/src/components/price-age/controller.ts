import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import PriceAgeModel from "./model";
import { IAddPriceAge, IAddPriceAgeValidator } from "./dto/IAddPriceAge";
import { IEditPriceAge, IEditPriceAgeValidator } from "./dto/IEditPriceAge";

class PriceAgeController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.priceAgeService.getAll());
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const priceAgeId: number = +id;

        if (priceAgeId <= 0) {
            return res.sendStatus(400);
        }

        const data: PriceAgeModel|null|IErrorResponse = await this.services.priceAgeService.getById(priceAgeId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof PriceAgeModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddPriceAgeValidator(data)) {            
            return res.status(400).send(IAddPriceAgeValidator.errors);
        }

        res.send(await this.services.priceAgeService.add(data as IAddPriceAge));
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const priceAgeId: number = +id

        if (priceAgeId <= 0) {
            return res.status(400).send("Invalid ID number");
        }
        if (!IEditPriceAgeValidator(data)) {            
            return res.status(400).send(IEditPriceAgeValidator.errors);
        }

        const result =  await this.services.priceAgeService.edit(priceAgeId, data as IEditPriceAge);

        if (result === null) {            
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);    

        if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

        res.send(await this.services.priceAgeService.delete(id));
    }
}

export default PriceAgeController;