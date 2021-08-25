import IModel from '../../common/IModel.interface';
import PriceNameModel from '../price-name/model';

class CategoryModel implements IModel {
    categoryId: number;
    name: string;
    description: string;
    priceName: PriceNameModel[];
}

export default CategoryModel;