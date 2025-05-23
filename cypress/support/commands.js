// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('assertValueCopiedToClipboard', value => {
    cy.window().then(win => {
        win.navigator.clipboard.readText().then(text => {
            expect(text).to.eq(value)
        })
    })
})

Cypress.Commands.add('interceptAll', () => {
    cy.intercept('GET', /https.*json$/).as('jsonLink')
    cy.intercept('GET', /^\/\w*\.json$/).as('jsonLocal')
    cy.intercept('GET', '**/api/resources/find-resources-in-batch*', (req) => {
        const url = new URL(req.url);
        const ids = url.searchParams.getAll('id');
        const versions = url.searchParams.getAll('resource_version');
        
        // Check for specific resource requests
        if (ids.includes('arm64-ubuntu-20.04-boot')) {
            const versionIndex = ids.indexOf('arm64-ubuntu-20.04-boot');
            const requestedVersion = versions[versionIndex];
            
            if (requestedVersion === '0.1.0') {
                req.reply({
                    fixture: 'getResource2.json'
                })
            } else if (requestedVersion === 'None') {
                req.reply({
                    fixture: 'getResource.json'
                })
            } else {
                req.reply({
                    documents: [],
                })
            }
        } else {
            req.reply({
                documents: [],
            })
        }
    }).as('find')
     cy.intercept('GET', '**/api/resources/search*', (req) => {
        const url = new URL(req.url);
        const containsStr = url.searchParams.get('contains-str');
        const mustInclude = url.searchParams.get('must-include');
        const pageSize = parseInt(url.searchParams.get('page-size')) || 10;
        const page = parseInt(url.searchParams.get('page')) || 1;
        
        console.log('Search params:', { containsStr, mustInclude, pageSize, page });
        
        // Handle different search scenarios based on your old pipeline logic
        if (!containsStr && !mustInclude) {
            // Empty search - equivalent to pipeline length 5
            req.reply({
                documents: [],
                totalCount: 0
            })
        } else if (mustInclude) {
            // Parse must-include filters
            const filters = mustInclude.split(';').reduce((acc, filter) => {
                const [field, ...values] = filter.split(',');
                acc[field] = values;
                return acc;
            }, {});
            
            if (filters.category) {
                req.reply({
                    fixture: 'searchDiskimage.json'
                })
            } else if (filters.architecture) {
                req.reply({
                    fixture: 'searchArchitecture.json'
                })
            } else {
                req.reply({
                    fixture: 'searchExact.json'
                })
            }
        } else if (containsStr) {
            // Basic search with different page sizes
            if (pageSize === 25) {
                req.reply({
                    fixture: 'search25.json'
                })
            } else {
                req.reply({
                    fixture: 'searchExact.json'
                })
            }
        } else {
            req.reply({
                documents: [],
                totalCount: 0
            })
        }
    }).as('search')
    
    // Intercept filters request (replaces old MongoDB aggregate for filters)
    cy.intercept('GET', '**/api/resources/filters*', {
        fixture: 'filters.json'
    }).as('filters')
})

Cypress.Commands.add('waitFirst', () => {
    const resource = Object.keys(Cypress.env('SOURCES'))[0]
    if (Cypress.env('SOURCES')[resource].isMongo) {
        cy.wait(['@search'])
    } else {
        cy.waitJSON(Cypress.env('SOURCES')[resource].url.includes('http'))
    }
    return cy.wrap(Cypress.env('SOURCES')[resource].isMongo)
})

Cypress.Commands.add('waitAll', value => {
    cy.wait(['@kiwi', '@resources', '@search', '@filters'])
})

Cypress.Commands.add('waitMongo', () => {
    cy.wait(['@search', '@filters'])
})

Cypress.Commands.add('waitJSON', (isUrl) => {
    if (isUrl) {
        cy.wait(['@jsonLink'])
    } else {
        cy.wait(['@jsonLocal'])
    }
})

Cypress.Commands.add('waitAuto', () => {
    const resources = Cypress.env('SOURCES')
    Object.keys(resources).forEach((i) => {
        if (resources[i].isMongo) {
            cy.wait(['@search'])
        } else {
            cy.waitJSON(resources[i].url.includes('http'))
        }
    })
})
