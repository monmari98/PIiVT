import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import PatientController from './controller';

export default class PatientRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const patientController: PatientController = new PatientController(resources);

        application.get("/patient", AuthMiddleware.getVerifier("administrator"), patientController.getAll.bind(patientController));
        application.get("/patient/:id", AuthMiddleware.getVerifier("administrator"), patientController.getById.bind(patientController));
        
        application.post("/patient/", AuthMiddleware.getVerifier("administrator"), patientController.add.bind(patientController));
        application.put("/patient/:id", AuthMiddleware.getVerifier("administrator"), patientController.edit.bind(patientController));
        
        application.delete("/patient/:id", AuthMiddleware.getVerifier("administrator"), patientController.delete.bind(patientController));
    }
}