import Ajv from 'ajv';

interface IEditPriceAge {
    name: string;
    age: number;
    amount: number;
    priceNameId: number;
}

const ajv = new Ajv();

const IEditPriceAgeValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        age: {
            type: "integer"
        },
        amount: {
            type: "number",
            minimum: 0.01,
            multipleOf: 0.01,
        },
        priceNameId: {
            type: "number",
            minimum: 1,
        },
    },
    required: [
        "name",
        "age",
        "amount",
        "priceNameId",
    ],
    additionalProperties: false
});

export { IEditPriceAge };
export { IEditPriceAgeValidator };