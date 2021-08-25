import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import PriceNameController from './controller';

export default class PriceNameRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const priceNameController: PriceNameController = new PriceNameController(resources);

        application.get("/price-name", AuthMiddleware.getVerifier("administrator"), priceNameController.getAll.bind(priceNameController));
        application.get("/price-name/:id", AuthMiddleware.getVerifier("administrator"), priceNameController.getById.bind(priceNameController));
        
        application.post("/price-name/", AuthMiddleware.getVerifier("administrator"), priceNameController.add.bind(priceNameController));
        application.put("/price-name/:id", AuthMiddleware.getVerifier("administrator"), priceNameController.edit.bind(priceNameController));
        
        application.delete("/price-name/:id", AuthMiddleware.getVerifier("administrator"), priceNameController.delete.bind(priceNameController));
    }
}