import AdministratorSecvice from "../components/administrator/service";
import PatientSecvice from "../components/patient/service";

export default interface IServices {
    administratorService: AdministratorSecvice;
    patientService: PatientSecvice;
}