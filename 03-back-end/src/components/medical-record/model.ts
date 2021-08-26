import IModel from "../../common/IModel.interface";
import PatientModel from "../patient/model";

class Photo implements IModel {
    photoId: number;
    imagePath: string;
}

class MedicalRecordModel implements IModel {
    medicalRecordId: number;
    tooth: string;
    patientId: number;
    patient: PatientModel;
    photo: Photo[];
}

export default MedicalRecordModel;
export {Photo}