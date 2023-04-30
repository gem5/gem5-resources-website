/// <reference types="cypress" />

describe('Cookie prompt', () => {
    beforeEach(() => {
        cy.intercept('GET', Cypress.env('SCHEMA_URL')).as('getSchema')
        cy.visit('localhost:3000')
        cy.wait('@getSchema')
        cy.clearCookies()
        cy.clearLocalStorage()
    })

    it('checks accept all cookies works', () => {
        cy.get('main').find('div').eq(0).find('button').eq(1).click()
        // check local storage
        cy.getAllLocalStorage().then((ls) => {
            expect(ls).to.deep.equal({
                "http://localhost:3000": {
                    "CookieConsent": "{\"userPreference\":\"all\"}"
                },
            })
        })
    })

    it('checks accept only necessary cookies works', () => {
        cy.get('main').find('div').eq(0).find('button').eq(0).click()
        cy.get('.modal-content').find('label').eq(0).click()
        // all inputs should be checked
        cy.get('.modal-content').find('input').each(($el) => {
            expect($el).to.be.checked
        })
        cy.get('.modal-content').find('label').eq(1).click()
        // second input should be unchecked
        cy.get('.modal-content').find('input').eq(1).should('not.be.checked')
        cy.get('.modal-content').find('button').eq(0).click()
        // check local storage
        cy.getAllLocalStorage().then((ls) => {
            expect(ls).to.deep.equal({
                "http://localhost:3000": {
                    "CookieConsent": "{\"userPreference\":\"statistics\"}"
                },
            })
        })
    })

    it('checks if reset cookies works', () => {
        cy.get('main').find('div').eq(0).find('button').eq(1).click()
        // check local storage
        cy.getAllLocalStorage().then((ls) => {
            expect(ls).to.deep.equal({
                "http://localhost:3000": {
                    "CookieConsent": "{\"userPreference\":\"all\"}"
                },
            })
        })
        // get link where text is "Reset Cookies"
        cy.get('a').contains('Reset Cookies').click()
        // check local storage
        cy.getAllLocalStorage().then((ls) => {
            expect(ls).to.deep.equal({})
        })
    })
})
