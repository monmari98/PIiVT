import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import MedicalRecordController from './controller';

export default class MedicalRecordRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const medicalRecordController: MedicalRecordController = new MedicalRecordController(resources);

        application.get("/medicalRecord", medicalRecordController.getAll.bind(medicalRecordController));
        application.get("/medicalRecord/:id", medicalRecordController.getById.bind(medicalRecordController));
        
        application.post("/medicalRecord/", medicalRecordController.add.bind(medicalRecordController));
        application.put("/medicalRecord/:id", medicalRecordController.edit.bind(medicalRecordController));
        
        application.delete("/medicalRecord/:id", medicalRecordController.delete.bind(medicalRecordController));
    }
}