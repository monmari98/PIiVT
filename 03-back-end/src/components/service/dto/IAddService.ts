import Ajv from 'ajv';

interface IAddService {
    name: string;
    description: string;
    stockNumber: string;
    categoryId: number;
}

const ajv = new Ajv();

const IAddServiceValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        description: {
            type: "string",
            maxLength: 255,
        },
        stockNumber: {
            type: "string",
            minLength: 6,
            maxLength: 64,
        },
        categoryId: {
            type: "number",
            minimum: 1,
        },
    },
    required: [
        "name",
        "description",
        "stockNumber",
        "categoryId",
    ],
    additionalProperties: false
});

export { IAddService };
export { IAddServiceValidator };