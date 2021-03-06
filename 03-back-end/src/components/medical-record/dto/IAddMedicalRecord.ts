import Ajv from 'ajv';

interface IAddMedicalRecord {
    tooth: string;
    patientId: number;
}

interface IUploadPhoto {
    imagePath: string;  
}

const ajv = new Ajv();

const IAddMedicalRecordValidator = ajv.compile({
    type: "object",
    properties: {
        tooth: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        patientId: {
            type: "integer",
            minimum: 1,
        }
    },
    required: [
        "tooth",
        "patientId",
    ],
    additionalProperties: false
});

export { IAddMedicalRecord };
export { IAddMedicalRecordValidator };
export {IUploadPhoto}