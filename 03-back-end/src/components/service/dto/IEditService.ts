import Ajv from 'ajv';

interface IEditService {
    name: string;
    description: string;
    stockNumber: string;
    categoryId: number;
    isActive: boolean;
}

const ajv = new Ajv();

const IEditServiceValidator = ajv.compile({
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
        isActive: {
            type: "boolean",
        },
    },
    required: [
        "name",
        "description",
        "stockNumber",
        "categoryId",
        "isActive",
    ],
    additionalProperties: false
});

export { IEditService };
export { IEditServiceValidator };