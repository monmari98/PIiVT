import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import PriceAgeController from './controller';

export default class PriceAgeRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const priceAgeController: PriceAgeController = new PriceAgeController(resources);

        application.get("/price-age", AuthMiddleware.getVerifier("administrator"), priceAgeController.getAll.bind(priceAgeController));
        application.get("/price-age/:id", AuthMiddleware.getVerifier("administrator"), priceAgeController.getById.bind(priceAgeController));
        
        application.post("/price-age/", AuthMiddleware.getVerifier("administrator"), priceAgeController.add.bind(priceAgeController));
        application.put("/price-age/:id", AuthMiddleware.getVerifier("administrator"), priceAgeController.edit.bind(priceAgeController));
        
        application.delete("/price-age/:id", AuthMiddleware.getVerifier("administrator"), priceAgeController.delete.bind(priceAgeController));
    }
}