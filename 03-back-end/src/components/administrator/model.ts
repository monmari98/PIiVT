import IModel from "../../common/IModel.interface";

class LoginLogModel implements IModel {
    loginLogId: number;
    log: string;
    admnistratorId: string | null;
    createdAt: Date
}

class AdministratorModel implements IModel {
    administratorId: number;
    username: string;
    passwordHash: string;
}

export default AdministratorModel;
export {LoginLogModel};