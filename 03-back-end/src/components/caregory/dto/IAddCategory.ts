import Ajv from 'ajv';

interface IAddCategory {
    name: string;
    description: string;
}

const ajv = new Ajv();

const IAddCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        description: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
    },
    required: [
        "name",
        "description",
    ],
    additionalProperties: false
});

export { IAddCategory };
export { IAddCategoryValidator };