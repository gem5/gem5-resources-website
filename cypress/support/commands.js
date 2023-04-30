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
    cy.intercept('GET', Cypress.env('SCHEMA_URL')).as('getSchema')
    cy.intercept('GET', /https.*json$/).as('jsonLink')
    cy.intercept('GET', /^\/\w*\.json$/).as('jsonLocal')
    cy.intercept('POST', "https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/find").as('find')
    cy.intercept('POST', 'https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/aggregate').as('mongo')
    cy.intercept('POST', "https://realm.mongodb.com/api/client/v2.0/app/data-ejhjf/auth/providers/api-key/login").as('login')
})

Cypress.Commands.add('waitFirst', () => {
    const resource = Object.keys(Cypress.env('PRIVATE_RESOURCES'))[0]
    if (Cypress.env('PRIVATE_RESOURCES')[resource].isMongo) {
        cy.wait(['@mongo'])
    } else {
        cy.waitJSON(Cypress.env('PRIVATE_RESOURCES')[resource].url.includes('http'))
    }
    return cy.wrap(Cypress.env('PRIVATE_RESOURCES')[resource].isMongo)
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
    const resources = Cypress.env('PRIVATE_RESOURCES')
    Object.keys(resources).forEach((i) => {
        if (resources[i].isMongo) {
            cy.wait(['@mongo'])
        } else {
            cy.waitJSON(resources[i].url.includes('http'))
        }
    })
})
