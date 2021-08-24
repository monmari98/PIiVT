import Ajv from 'ajv';

interface IAddPatient {
    firstName: string;
    lastName: string;
    jmbg: string;
    email: string;
    age: number;
}

const ajv = new Ajv();

const IAddPatientValidator = ajv.compile({
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
        }
    },
    required: [
        "firstName",
        "lastName",
        "jmbg",
        "email",
    ],
    additionalProperties: false
});

export { IAddPatient };
export { IAddPatientValidator };