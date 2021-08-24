import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import MedicalRecordController from './controller';

export default class MedicalRecordRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const medicalRecordController: MedicalRecordController = new MedicalRecordController(resources);

        application.get("/medicalRecord", AuthMiddleware.getVerifier("administrator"), medicalRecordController.getAll.bind(medicalRecordController));
        application.get("/medicalRecord/:id", AuthMiddleware.getVerifier("administrator"), medicalRecordController.getById.bind(medicalRecordController));
        
        application.post("/medicalRecord/", AuthMiddleware.getVerifier("administrator"), medicalRecordController.add.bind(medicalRecordController));
        application.put("/medicalRecord/:id", AuthMiddleware.getVerifier("administrator"), medicalRecordController.edit.bind(medicalRecordController));
        
        application.delete("/medicalRecord/:id", AuthMiddleware.getVerifier("administrator"), medicalRecordController.delete.bind(medicalRecordController));
    }
}