import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AdministratorController from './controller';

export default class AdministratorRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const administratorController: AdministratorController = new AdministratorController(resources);

        application.get("/administrator", administratorController.getAll.bind(administratorController));
        application.get("/administrator/:id", administratorController.getById.bind(administratorController));
    }
}