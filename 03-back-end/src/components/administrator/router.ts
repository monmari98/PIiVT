import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import AdministratorController from './controller';

export default class AdministratorRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const administratorController: AdministratorController = new AdministratorController(resources);

        application.get("/administrator", AuthMiddleware.getVerifier("administrator"), administratorController.getAll.bind(administratorController));
        application.get("/administrator/:id", AuthMiddleware.getVerifier("administrator"), administratorController.getById.bind(administratorController));
        
        application.post("/administrator/", AuthMiddleware.getVerifier("administrator"), administratorController.add.bind(administratorController));
        application.put("/administrator/:id", AuthMiddleware.getVerifier("administrator"), administratorController.edit.bind(administratorController));
        
        application.delete("/administrator/:id", AuthMiddleware.getVerifier("administrator"), administratorController.delete.bind(administratorController));

        //Login routes
        application.get("/login-log", AuthMiddleware.getVerifier("administrator"), administratorController.getAllLogs.bind(administratorController));
        application.get("/login-log/:aid", AuthMiddleware.getVerifier("administrator"), administratorController.getLogsByAdministratorId.bind(administratorController));
    }
}