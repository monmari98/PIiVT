import IModel from '../../common/IModel.interface';
import CategoryModel from '../caregory/model';

class ServiceModel implements IModel {
    serviceId: number;
    name: string;
    description: string;
    stockNumber: string;
    categoryId: number;
    category: CategoryModel;
    isActive: boolean;
}

export default ServiceModel;