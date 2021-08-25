import AdministratorSecvice from "../components/administrator/service";
import CategorySecvice from "../components/caregory/service";
import MedicalRecordSecvice from "../components/medical-record/service";
import PatientSecvice from "../components/patient/service";
import PriceAgeSecvice from "../components/price-age/service";
import PriceNameSecvice from "../components/price-name/service";
import ServiceSecvice from "../components/service/service";

export default interface IServices {
    administratorService: AdministratorSecvice;
    patientService: PatientSecvice;
    medicalRecordService: MedicalRecordSecvice;
    priceAgeService: PriceAgeSecvice;
    priceNameService: PriceNameSecvice;
    categoryService: CategorySecvice;
    serviceService: ServiceSecvice;
}