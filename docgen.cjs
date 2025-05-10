const fs = require('fs');
const path = require('path');
// const parser = require('react-docgen-typescript').withDefaultConfig()
const parser = require('react-docgen-typescript')
const docs = parser.parse('src/index.tsx', {
    skipChildrenPropWithoutDoc: true,
    savePropValueAsString: true,
    /*   componentNameResolver:(exp,s) => {
           console.log(exp,s)
       }*/

});
const result = {};

docs.forEach((component) => {
    const props = component.props || {};

    // console.log(component.displayName)

    const filteredProps = Object.entries(props)
        .filter(([_, prop]) => {
            // Exclude HTML native props
            if (prop.parent) {
                if (prop.parent.fileName && prop.parent.fileName.includes('ui/src')) {
                    return true;
                }

                  /*if(prop.name === 'ovh'){
                      debugger
                  }*/
                /* prop.name === 'selectValue' && prop.declarations.some(d => {
                     if(d.name === 'ovh'){
                         debugger
                     }
                 })

                 if (prop.name === 'selectValue') {
                     return prop.declarations.some(d => d.name === 'TypeLiteral')
                 }*/

                return false
            }

            // console.log(prop.name)

            return prop.name !== 'ref';


        })
        .reduce((acc, [name, prop]) => {
            let defaultValue = prop.defaultValue?.value || ''
            /*if(name ==='ovh'){
                debugger
            }*/
            acc[name] = {
                type: prop.type.name,
                required: prop.required,
                defaultValue,
                description: prop.description || ''
            };
            return acc;
        }, {});

    result[component.displayName] = {
        tags: component.tags || {},
        props: filteredProps
    };
});

fs.mkdirSync('docs/json', {recursive: true});
fs.writeFileSync('docs/json/output.json', JSON.stringify(result, null, 2), 'utf-8');
console.log('✅ Output written to docs/json/output.json');