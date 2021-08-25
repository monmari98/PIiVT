import IModel from '../../common/IModel.interface';

class PriceAgeModel implements IModel {
    priceAgeId: number;
    name: string;
    age: number;
    amount: number;
    priceNameId: number;
}

export default PriceAgeModel;