import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import CategoryModel from "../caregory/model";
import MedicalRecordModel from "../medical-record/model";
import PatientModel from "../patient/model";
import ServiceModel from "../service/model";
import CartModel from "./model";

class CartModelAdapterOptions implements IModelAdapterOptions {
    loadMedicalRecord: boolean = false;
    loadServices: boolean = false;
    loadPatient: boolean = false;
    patientId: number;
}

class CartService extends BaseService<CartModel> {
    protected async adaptModel(data: any, options: Partial<CartModelAdapterOptions> = {}): Promise<CartModel> {
        const item = new CartModel();

        item.cartId = +(data?.cart_id);
        item.createdAt = new Date(data?.created_at);
        item.totalPrice = +(data?.total_price);

        if (options.loadPatient) {
            item.patient =  await this.services.patientService.getById(options.patientId) as PatientModel;
        }

        if (options.loadServices) {
            item.services = await this.getServicesByPatientId(options.patientId, true) as ServiceModel[];
        }
        if (options.loadServices) {
            item.medicalRecord = await this.services.medicalRecordService.getAllByPatientId(options.patientId) as MedicalRecordModel[];
        }

        return item;
    } 

    public async getAll(): Promise<CartModel[]|IErrorResponse> {
        return await this.getAllFromTable("cart", {});
    }

    public async getById(cartId: number, options: Partial<CartModelAdapterOptions> = {}): Promise<CartModel|IErrorResponse|null> {
        return await this.getByIdFromTable("cart", cartId, options);
    }

    private async getServicesByPatientId(patientId: number, cartExists: boolean, cartId = null): Promise<ServiceModel[]|IErrorResponse> {
        return new Promise<ServiceModel[]|IErrorResponse>(async resolve => {
            let sql: string = "";
            if (cartExists) {
                sql = `SELECT
                            service.*
                        FROM
                            service
                        INNER JOIN service_medical_record ON service_medical_record.service_id = service.service_id
                        INNER JOIN medical_record ON medical_record.medical_record_id = service_medical_record.medical_record_id
                        WHERE 
                            patient_id = ?
                            AND service_medical_record.cart_id = 0`
            } else {
                sql = `SELECT
                            service.*
                        FROM
                            service
                        INNER JOIN service_medical_record ON service_medical_record.service_id = service.service_id
                        INNER JOIN medical_record ON medical_record.medical_record_id = service_medical_record.medical_record_id
                        WHERE 
                            patient_id = ?
                            AND service_medical_record.cart_id > 0
                            AND service_medical_record.cart_id = ?`
            }
            this.db.execute(
                sql,
                [patientId, cartId]
            )
            .then(async ([rows]) => {
                const list: ServiceModel[] = [];

                if (Array.isArray(rows)) {
                    
            console.log(rows)
                    for (const row of rows) {
                        const data: any = row

                        list.push({
                            serviceId: +(data.service_id),
                            name: data.name,
                            description: data.description,
                            stockNumber: data.stock_number,
                            categoryId: +(data.category_id),
                            category: await this.services.serviceService.getCategory(+(data.category_id)) as CategoryModel,
                            isActive: data.is_active ==1,
                        })
                    }
                }
                resolve(list);
            })
        })
    }

    public async getPatientCurrentCart(patientId: number): Promise<CartModel|IErrorResponse> {
        return new Promise<CartModel|IErrorResponse>(async resolve => {
            let totalPrice: number = 0;

            const patient = await this.services.patientService.getById(patientId) as PatientModel;
            const patientAge: number = patient.age;

            
            const patientServices = await this.getServicesByPatientId(patient.patientId, true) as ServiceModel[];

            for (const patientService of patientServices) {
                for (const priceName of patientService.category.priceName) {
                    for (const priceAgeData of priceName.priceAge) {
                        if (priceAgeData.name === "pružanje usluge za decu") {
                            if(patientAge <= priceAgeData.age) {
                                totalPrice += priceAgeData.amount;
                            }
                        } else if (priceAgeData.name === "pružanje usluge za penzionere") {
                            if(patientAge >= priceAgeData.age) {
                                totalPrice += priceAgeData.amount;
                            }
                        } else {
                            totalPrice += priceAgeData.amount;
                        }
                    }
                }
            }

            this.db.execute(
                `
                INSERT 
                    cart
                SET 
                    total_price = ?;

                `,
                [totalPrice]
            )
            .then(async res => {
                const newCartId: number = +((res[0] as any)?.insertId);
                const result = await this.getById(newCartId, {
                    patientId: patient.patientId, 
                    loadPatient: true, 
                    loadServices: true,
                    loadMedicalRecord: true,
                }) as CartModel;


                this.db.execute(
                    `
                    SELECT 
                        service_medical_record.*
                    FROM 
                        service_medical_record
                    INNER JOIN medical_record ON medical_record.medical_record_id = service_medical_record.medical_record_id
                    INNER JOIN patient ON patient.patient_id = medical_record.patient_id
                    WHERE
                        patient.patient_id = ?
                        AND service_medical_record.cart_id = 0
                    `,
                    [result.patient.patientId]
                )
                .then(async ([rows]) => {
                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            const data: any = row;  
                            await this.db.execute(
                                `
                                UPDATE 
                                    service_medical_record
                                SET 
                                    cart_id = ?
                                WHERE
                                    service_medical_record_id = ?
                                `,
                                [result.cartId, data.service_medical_record_id]
                            )
                        }
                    }
                    resolve(result);
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                })

                
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            })
        })
    }

    public async setPatientCurrentCart(patientId: number, cartId: number): Promise<CartModel|IErrorResponse> {
        return new Promise<CartModel|IErrorResponse>(async resolve => {
            let totalPrice: number = 0;

            const patient = await this.services.patientService.getById(patientId) as PatientModel;
            const patientAge: number = patient.age;
            const cart = await this.getById(cartId);

            if (cart === null) {
                return null;
            }

            const patientServices = await this.getServicesByPatientId(patient.patientId, false, cartId) as ServiceModel[];

            for (const patientService of patientServices) {
                for (const priceName of patientService.category.priceName) {
                    for (const priceAgeData of priceName.priceAge) {
                        if (priceAgeData.name === "pružanje usluge za decu") {
                            if(patientAge <= priceAgeData.age) {
                                totalPrice += priceAgeData.amount;
                            }
                        } else if (priceAgeData.name === "pružanje usluge za penzionere") {
                            if(patientAge >= priceAgeData.age) {
                                totalPrice += priceAgeData.amount;
                            }
                        } else {
                            totalPrice += priceAgeData.amount;
                        }
                    }
                }
            }

            await this.db.execute(
                `
                UPDATE 
                    cart
                SET 
                    total_price = ?
                WHERE
                    cart_id = ?;
                `,
                [totalPrice, cartId]
            )
            .then(async res => {
                const result = await this.getById(cartId, {
                    patientId: patient.patientId, 
                    loadPatient: true, 
                    loadServices: true,
                    loadMedicalRecord: true,
                }) as CartModel;
              
                this.db.execute(
                    `
                    SELECT 
                        service_medical_record.*
                    FROM 
                        service_medical_record
                    INNER JOIN medical_record ON medical_record.medical_record_id = service_medical_record.medical_record_id
                    INNER JOIN patient ON patient.patient_id = medical_record.patient_id
                    WHERE
                        patient.patient_id = ?
                        AND
                        (service_medical_record.cart_id = ?
                        OR service_medical_record.cart_id = 0)
                    `,
                    [result.patient.patientId, cartId]
                )
                .then(async ([rows]) => {
                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            const data: any = row;  
                            await this.db.execute(
                                `
                                UPDATE 
                                    service_medical_record
                                SET 
                                    cart_id = ?
                                WHERE
                                    service_medical_record_id = ?
                                `,
                                [result.cartId, data.service_medical_record_id]
                            )
                        }
                    }
                    
                resolve(result);  
                })
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            })
        })
    }
}

export default CartService