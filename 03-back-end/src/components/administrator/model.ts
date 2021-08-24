import IModel from "../../common/IModel.interface";

class AdministratorModel implements IModel {
    administratorId: number;
    username: string;
    passwordHash: string;
}

export default AdministratorModel;