import AdministratorSecvice from "../components/administrator/service";
import MedicalRecordSecvice from "../components/medical-record/service";
import PatientSecvice from "../components/patient/service";

export default interface IServices {
    administratorService: AdministratorSecvice;
    patientService: PatientSecvice;
    medicalRecordService: MedicalRecordSecvice;
}