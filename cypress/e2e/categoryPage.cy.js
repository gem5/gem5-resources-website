/// <reference types="cypress" />

describe('Category Page', () => {
    let schema = {}
    beforeEach(() => {
        cy.intercept('GET', Cypress.env('SCHEMA_URL')).as('getSchema')
        cy.visit('/category')
        cy.wait('@getSchema')
        window.localStorage.setItem('CookieConsent', "{\"userPreference\":\"all\"}")
        // load schema from __tests__/schema.json
        cy.fixture('schema.json').then((data) => {
            schema = data
        })
    })

    it('checks if category page works', () => {
        cy.get('.card-body').should('have.length', schema.properties.category.enum.length)
        cy.get('.card-body').each(($el, index) => {
            let category = schema.properties.category.enum[index]
            cy.wrap($el).find('.h5').should('have.text', category[0].toUpperCase() + category.slice(1))
            let description = schema.definitions[category].description
            cy.wrap($el).find('.card-text').should('have.text', description)
        })
        cy.get(':nth-child(1) > .card-body > .btn').click()
        let category = schema.properties.category.enum[0]
        cy.get('.active').should('have.text', category[0].toUpperCase() + category.slice(1))
        cy.url().should('include', '#' + category)
        cy.get('.container a[role="button"]').should('have.text', 'View All ' + category[0].toUpperCase() + category.slice(1) + 's')
        cy.get('.container a[role="button"]').click()
        cy.url().should('include', '/resources?q=category:' + category)
    })
})