import IModel from "../../common/IModel.interface";

class PatientModel implements IModel {
    patientId: number;
    firstName: string;
    lastName: string;
    jmbg: string;
    email: string;
    age: number;
    isActive: boolean;
}

export default PatientModel;