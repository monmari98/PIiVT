import Ajv from 'ajv';

interface IEditPatient {
    firstName: string;
    lastName: string;
    jmbg: string;
    email: string;
    age: number;
    isActive: boolean;
}

const ajv = new Ajv();

const IEditPAtientValidator = ajv.compile({
    type: "object",
    properties: {
        firstName: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        lastName: {
            type: "string",
            minLength: 2,
            maxLength: 128,
        },
        jmbg: {
            type: "string",
            minLength: 13,
            maxLength: 13,
        },
        email: {
            type: "string",
            maxLength: 128,
        },
        age: {
            type: "integer",
            minimum: 1,
        },
        isActive: {
            type: "boolean",
        }
    },
    required: [
        "firstName",
        "lastName",
        "jmbg",
        "email",
        "isActive",
    ],
    additionalProperties: false
});

export { IEditPatient };
export { IEditPAtientValidator };