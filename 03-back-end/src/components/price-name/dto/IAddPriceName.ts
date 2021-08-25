import Ajv from 'ajv';

interface IAddPriceName {
    name: string;
    categoryId: number;
}

const ajv = new Ajv();

const IAddPriceNameValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        categoryId: {
            type: "number",
            minimum: 1,
        },
    },
    required: [
        "name",
        "categoryId",
    ],
    additionalProperties: false
});

export { IAddPriceName };
export { IAddPriceNameValidator };