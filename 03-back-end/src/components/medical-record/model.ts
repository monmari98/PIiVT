import IModel from "../../common/IModel.interface";
import PatientModel from "../patient/model";

class MedicalRecordModel implements IModel {
    medicalRecordId: number;
    tooth: string;
    patientId: number;
    patient: PatientModel;
}

export default MedicalRecordModel;