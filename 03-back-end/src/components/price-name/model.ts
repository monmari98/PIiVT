import IModel from '../../common/IModel.interface';
import PriceAgeModel from '../price-age/model';

class PriceNameModel implements IModel {
    priceNameId: number;
    name: string;
    categoryId: number;
    priceAge: PriceAgeModel[];
}

export default PriceNameModel;