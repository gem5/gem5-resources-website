/// <reference types="cypress" />

describe('404 page routing', () => {
    beforeEach(() => {
        cy.intercept('GET', 'https://raw.githubusercontent.com/Gem5Vision/json-to-mongodb/simentic-version/schema/test.json').as('getSchema')
        cy.intercept('GET', 'https://raw.githubusercontent.com/Gem5Vision/json-to-mongodb/simentic-version/kiwi.json').as('kiwi')
        cy.intercept('GET', '/resources.json').as('resources')
        cy.intercept('POST', 'https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/aggregate').as('mongo')
        cy.intercept('POST', "https://realm.mongodb.com/api/client/v2.0/app/data-ejhjf/auth/providers/api-key/login").as('login')
        cy.intercept('POST', "https://data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/find").as('find')
        window.localStorage.setItem('CookieConsent', "{\"userPreference\":\"all\"}")
    })

    it('checks invalid resource page routing', () => {
        cy.visit('/resources/invalid-resource')
        cy.wait('@find')
        cy.url().should('include', '/404')
    })

    it('checks invalid database page routing', () => {
        cy.visit('/resources/arm64-ubuntu-20.04-boot?database=invalid-database')
        cy.url().should('include', '/404')
    })

    it('checks invalid version page routing', () => {
        cy.visit('/resources/arm64-ubuntu-20.04-boot?version=invalid-version')
        cy.wait('@find')
        cy.url().should('include', '/404')
    })

    it('checks correct version but invalid database page routing', () => {
        cy.visit('/resources/arm64-ubuntu-20.04-boot?database=invalid-database&version=1.0.0')
        cy.url().should('include', '/404')
    })

    it('checks correct database but invalid version page routing', () => {
        cy.visit('/resources/arm64-ubuntu-20.04-boot?database=gem5-resources&version=invalid-version')
        cy.wait('@find')
        cy.url().should('include', '/404')
    })

    it('checks incorrect page routing', () => {
        cy.visit('/invalid-page', { failOnStatusCode: false })
        cy.url().should('include', '/404')
        cy.visit('/category/addasda', { failOnStatusCode: false })
        cy.url().should('include', '/404')
        cy.visit('/category#asdasdasd', { failOnStatusCode: false })
    })
})