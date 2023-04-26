/// <reference types="cypress" />

describe('404 page routing', () => {
    function waitFind() {
        let resources = Object.keys(Cypress.env('PRIVATE_RESOURCES'))[0]
        if (Cypress.env('PRIVATE_RESOURCES')[resources].isMongo) {
            cy.wait(['@find'])
        } else {
            cy.waitJSON(Cypress.env('PRIVATE_RESOURCES')[resources].url.includes('http'))
        }
    }
    beforeEach(() => {
        cy.interceptAll()
        window.localStorage.setItem('CookieConsent', "{\"userPreference\":\"all\"}")
    })

    it('checks invalid resource page routing', () => {
        cy.visit('/resources/invalid-resource')
        waitFind()
        cy.url().should('include', '/404')
    })

    it('checks invalid database page routing', () => {
        cy.visit('/resources/arm64-ubuntu-20.04-boot?database=invalid-database')
        cy.url().should('include', '/404')
    })

    it('checks invalid version page routing', () => {
        cy.visit('/resources/arm64-ubuntu-20.04-boot?version=invalid-version')
        waitFind()
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