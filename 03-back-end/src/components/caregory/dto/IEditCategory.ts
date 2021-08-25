import Ajv from 'ajv';

interface IEditCategory {
    name: string;
    description: string;
}

const ajv = new Ajv();

const IEditCategoryValidator = ajv.compile({
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

export { IEditCategory };
export { IEditCategoryValidator };