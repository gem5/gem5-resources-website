import gem5Schema from "@/public/gem5-resources-schema.json"

// each category is a definition in the schema
// each category has a list of required fields
// category can inherit from other categories provided by $ref in allOf
// create a recursive function to get all required fields
function getFields(schema, category) {
    let requiredFields = [];
    let additionalInfoFields = [];
    if (schema.definitions[category]) {
        const categorySchema = schema.definitions[category];
        if (categorySchema.allOf) {
            for (let ref of categorySchema.allOf) {
                if (ref.$ref) {
                    const refCategory = ref.$ref.replace("#/definitions/", "");
                    let fields = getFields(schema, refCategory);
                    requiredFields = requiredFields.concat(fields[0]);
                    additionalInfoFields = additionalInfoFields.concat(fields[1]);
                }
            }
        }
        if (categorySchema.required) {
            // requiredFields = requiredFields.concat(categorySchema.required);
            for (let field of categorySchema.required) {
                if ("$ref" in categorySchema.properties[field])
                    continue;
                requiredFields.push({
                    name: field,
                    schema: categorySchema.properties[field],
                });
            }
        }
        if (categorySchema.properties) {
            for (let field in categorySchema.properties) {
                // if (field === "category") continue;
                if (!categorySchema.required || !categorySchema.required.includes(field)) {
                    additionalInfoFields.push({
                        name: field,
                        schema: categorySchema.properties[field],
                    });
                }
            }
        }
    }
    return [requiredFields, additionalInfoFields];
}

export default async function getTabs(res) {
    const tabs = process.env.TABS;
    let resource = JSON.parse(JSON.stringify(res));
    const category = resource.category;
    let fields = getFields(gem5Schema, category);
    for (let field in gem5Schema.properties) {
        if (gem5Schema.properties[field].required) {
            fields[0].push({
                name: field,
                schema: gem5Schema.properties[field],
            });
        } else {
            fields[1].push({
                name: field,
                schema: gem5Schema.properties[field],
            });
        }
    }
    // remove duplicate fields
    fields[0] = fields[0].filter((field, index, self) =>
        index === self.findIndex((t) => (
            t.name === field.name
        ))
    );
    fields[1] = fields[1].filter((field, index, self) =>
        index === self.findIndex((t) => (
            t.name === field.name
        ))
    );
    // remove fields that are not in resource
    fields[0] = fields[0].filter((field) => (
        field.name in resource
    ));
    fields[1] = fields[1].filter((field) => (
        field.name in resource
    ));
    for (let field of fields[0]) {
        if (field.name in resource) {
            field.content = resource[field.name];
        }
    }
    for (let field of fields[1]) {
        if (field.name in resource) {
            field.content = resource[field.name];
        }
    }
    if (resource.additional_params) {
        Object.keys(resource.additional_params).forEach((key) => {
            let type = "string";
            switch (typeof resource.additional_params[key]) {
                case "number":
                    type = "integer";
                    break;
                case "boolean":
                    type = "boolean";
                    break;
                case "object":
                    type = "object";
                    break;
                case "array":
                    type = "array";
                    break;
                default:
                    type = "string";
                    break;
            }
            fields[1].push({
                name: key,
                schema: {
                    type: "string",
                },
                content: resource.additional_params[key],
            });
        });
    }
    if (tabs[category]) {
        let allFields = [...fields[0], ...fields[1]];
        let requiredFields = [];
        let additionalInfoFields = [];
        let metaFields = [];
        for (let f of allFields) {
            if (Object.keys(tabs[category]["tab"]).includes(f.name)) {
                let field = JSON.parse(JSON.stringify(f));
                Object.assign(field, tabs[category]["tab"][field.name]);
                requiredFields.push(field);
            }
            if (Object.keys(tabs[category]["additionalInfo"]).includes(f.name)) {
                let field = JSON.parse(JSON.stringify(f));
                Object.assign(field, tabs[category]["additionalInfo"][field.name]);
                additionalInfoFields.push(field);
            }
            if (Object.keys(tabs[category]["metadata"]).includes(f.name)) {
                let field = JSON.parse(JSON.stringify(f));
                Object.assign(field, tabs[category]["metadata"][field.name]);
                metaFields.push(field);
            }
        }
        return {
            required: requiredFields,
            additionalInfo: additionalInfoFields,
            meta: metaFields,
        }
    }
    for (let f in gem5Schema.properties) {
        // delete them from required and additionalInfo
        fields[0] = fields[0].filter((field) => (
            field.name !== f
        ));
        fields[1] = fields[1].filter((field) => (
            field.name !== f
        ));
    }
    return {
        required: fields[0],
        additionalInfo: fields[1],
        meta: [],
    }
}