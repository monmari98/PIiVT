import Ajv from 'ajv';

interface IEditMedicalRecord {
    tooth: string;
    patientId: number;
}

const ajv = new Ajv();

const IEditMedicalRecordValidator = ajv.compile({
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

export { IEditMedicalRecord };
export { IEditMedicalRecordValidator };