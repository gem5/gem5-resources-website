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
    cy.intercept('POST', "https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/find", (req) => {
        if (req.body.filter.id === 'arm64-ubuntu-20.04-boot') {
            if (req.body.filter.resource_version) {
                if (req.body.filter.resource_version === '0.1.0') {
                    req.reply({
                        fixture: 'getResource2.json'
                    })
                } else {
                    req.reply({
                        documents: [],
                    })
                }
            } else {
                req.reply({
                    fixture: 'getResource.json'
                })
            }
        } else {
            req.reply({
                documents: [],
            })
        }
    }).as('find')
    cy.intercept('POST', 'https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/aggregate', (req) => {
        console.log(req.body.pipeline)
        if (req.body.pipeline.length === 5) {
            req.reply({
                documents: [],
            })
        }
        else if (req.body.pipeline.length === 2) {
            req.reply({
                fixture: 'filters.json'
            })
        }
        else if (req.body.pipeline.length === 9) {
            console.log(req.body.pipeline[8].$limit)
            if (req.body.pipeline[8].$limit === 25) {
                req.reply({
                    fixture: 'search25.json'
                })
            }
            else {
                req.reply({
                    fixture: 'searchExact.json'
                })
            }
        }
        else if (req.body.pipeline.length === 10) {
            console.log(req.body.pipeline[0].$match.$and[0])
            // check if key is "category" 
            if (req.body.pipeline[0].$match.$and[0].category) {
                req.reply({
                    fixture: 'searchDiskimage.json'
                })
            } else if (req.body.pipeline[0].$match.$and[0].architecture) {
                req.reply({
                    fixture: 'searchArchitecture.json'
                })
            }
        }
        else if (req.body.pipeline.length === 11) {
            req.reply({
                fixture: 'searchExact.json'
            })
        }
        else if (req.body.pipeline.length === 14) {
            req.reply({
                fixture: 'searchTags.json'
            })
        }
        else {
            req.reply({
                documents: [],
            })
        }
    }).as('mongo')
    cy.intercept('POST', "https://realm.mongodb.com/api/client/v2.0/app/data-ejhjf/auth/providers/api-key/login", {
        fixture: 'login.json'
    }).as('login')
})

Cypress.Commands.add('waitFirst', () => {
    const resource = Object.keys(Cypress.env('SOURCES'))[0]
    if (Cypress.env('SOURCES')[resource].isMongo) {
        cy.wait(['@mongo'])
    } else {
        cy.waitJSON(Cypress.env('SOURCES')[resource].url.includes('http'))
    }
    return cy.wrap(Cypress.env('SOURCES')[resource].isMongo)
})

Cypress.Commands.add('waitAll', value => {
    cy.wait(['@kiwi', '@resources', '@mongo'])
})

Cypress.Commands.add('waitMongo', () => {
    cy.wait(['@mongo'])
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
            cy.wait(['@mongo'])
        } else {
            cy.waitJSON(resources[i].url.includes('http'))
        }
    })
})
