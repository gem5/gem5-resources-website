// each category is a definition in the schema
// each category has a list of required fields
// category can inherit from other categories provided by $ref in allOf
// create a recursive function to get all required fields
function getRequiredFields(schema, category) {
    let requiredFields = [];
    let optionalFields = [];
    if (schema.definitions[category]) {
        const categorySchema = schema.definitions[category];
        if (categorySchema.allOf) {
            for (let ref of categorySchema.allOf) {
                if (ref.$ref) {
                    const refCategory = ref.$ref.replace("#/definitions/", "");
                    let fields = getRequiredFields(schema, refCategory);
                    requiredFields = requiredFields.concat(fields[0]);
                    optionalFields = optionalFields.concat(fields[1]);
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
                if (field === "category") continue;
                if (!categorySchema.required || !categorySchema.required.includes(field)) {
                    optionalFields.push({
                        name: field,
                        schema: categorySchema.properties[field],
                    });
                }
            }
        }
    }
    return [requiredFields, optionalFields];
}

export default async function getTabs(res) {
    // create copy of resource
    let resource = JSON.parse(JSON.stringify(res));
    const category = resource.category;
    // schema is at https://raw.githubusercontent.com/Gem5Vision/json-to-mongodb/simentic-version/schema/test.json
    const schema = await fetch(process.env.SCHEMA_URL).then(res => res.json());
    // delete _id
    delete resource._id;
    delete resource.architecture;
    delete resource.source;
    delete resource.database;
    delete resource.workloads;
    for (let field in resource) {
        if (schema.properties[field]) {
            delete resource[field];
        }
    }
    let fields = getRequiredFields(schema, category);
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
        if (resource[field.name]) {
            field.content = resource[field.name];
        }
    }
    for (let field of fields[1]) {
        if (resource[field.name]) {
            field.content = resource[field.name];
        }
    }
    return {
        required: fields[0],
        optional: fields[1],
    }
}