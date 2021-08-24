import Ajv from 'ajv';

interface IEditAdministrator {
    username: string;
    password: string;
}

const ajv = new Ajv();

const IEditAdministratorValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 255,
        },
    },
    required: [
        
    ],
    additionalProperties: false
});

export { IEditAdministrator };
export { IEditAdministratorValidator };