import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import AdministratorModel from "./model";

class AdministratorModelAdapterOptions implements IModelAdapterOptions {

}

class AdministratorSecvice extends BaseService<AdministratorModel> {
    protected async adaptModel(data: any, options: Partial<AdministratorModelAdapterOptions> = {}): Promise<AdministratorModel> {
        const item = new AdministratorModel();

        item.administratorId = data?.administrator_id;
        item.username = data?.username;
        item.passwordHash = data?.password_hash;

        return item;
    }

    public async getAll(): Promise<AdministratorModel[]|IErrorResponse> {
        return await this.getAllFromTable("administrator");
    }

    public async getById(administratorId: number): Promise<AdministratorModel|null|IErrorResponse> {
        return await this.getByIdFromTable("administrator", administratorId);
    }
}

export default AdministratorSecvice;