import IModel from '../../common/IModel.interface';
import MedicalRecordModel from '../medical-record/model';
import PatientModel from '../patient/model';
import ServiceModel from '../service/model';

class CartModel implements IModel {
    cartId: number;
    createdAt: Date;
    totalPrice: number;
    patient: PatientModel;
    medicalRecord: MedicalRecordModel[]=[];
    services: ServiceModel[] = [];
}

export default CartModel;