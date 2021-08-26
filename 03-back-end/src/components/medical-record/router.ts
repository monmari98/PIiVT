import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import MedicalRecordController from './controller';

export default class MedicalRecordRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const medicalRecordController: MedicalRecordController = new MedicalRecordController(resources);

        application.get("/medical-record", AuthMiddleware.getVerifier("administrator"), medicalRecordController.getAll.bind(medicalRecordController));
        application.get("/medical-record/:id", AuthMiddleware.getVerifier("administrator"), medicalRecordController.getById.bind(medicalRecordController));
        
        application.post("/medical-record/", AuthMiddleware.getVerifier("administrator"), medicalRecordController.add.bind(medicalRecordController));
        application.put("/medical-record/:id", AuthMiddleware.getVerifier("administrator"), medicalRecordController.edit.bind(medicalRecordController));
        
        application.delete("/medical-record/:id", AuthMiddleware.getVerifier("administrator"), medicalRecordController.delete.bind(medicalRecordController));
        application.delete("/medical-record/:mid/photo/:pid", AuthMiddleware.getVerifier("administrator"), medicalRecordController.deleteMedicalRecordPhoto.bind(medicalRecordController));
        application.post("/medical-record/:id/photo", AuthMiddleware.getVerifier("administrator"), medicalRecordController.addMedicalRecordPhotos.bind(medicalRecordController));
    }
}