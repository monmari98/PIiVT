import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import ServiceController from './controller';

export default class ServiceRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const serviceController: ServiceController = new ServiceController(resources);

        application.get("/service", AuthMiddleware.getVerifier("administrator"), serviceController.getAll.bind(serviceController));
        application.get("/service/:id", AuthMiddleware.getVerifier("administrator"), serviceController.getById.bind(serviceController));
        
        application.post("/service/", AuthMiddleware.getVerifier("administrator"), serviceController.add.bind(serviceController));
        application.put("/service/:id", AuthMiddleware.getVerifier("administrator"), serviceController.edit.bind(serviceController));
        
        application.delete("/service/:id", AuthMiddleware.getVerifier("administrator"), serviceController.delete.bind(serviceController));
    }
}