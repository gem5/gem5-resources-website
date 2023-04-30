/// <reference types="cypress" />

describe('gem5 resources home', () => {
  beforeEach(() => {
    cy.intercept('GET', Cypress.env('SCHEMA_URL')).as('getSchema')
    cy.visit('localhost:3000')
    cy.wait('@getSchema')
  })

  it('checks if 3 categories and getting started being displayed', () => {
    cy.get('.cardsContainer').eq(0).children().should('have.length', 3)
    cy.get('.cardsContainer').eq(1).children().should('have.length', 3)
  })

  it('checks if routing to getting started card works', () => {
    let id = ""
    cy.get('.cardsContainer').eq(0).children().eq(0).find('.card-body').find('div').eq(0).invoke('text').then(($id) => {
      cy.log($id)
      id = $id
    })
    cy.log(id)
    cy.get('.cardsContainer').eq(0).children().eq(0).find('a').click()
    // cy.url().should('include', '/resources')
    // cy.url().should('include', id)
  })

  it('checks if routing to get all resources works', () => {
    cy.get(':nth-child(5) > .mt-3').click()
    cy.url().should('include', '/resources')
    cy.url().should('include', '?q=')
  })

  it('checks if routing to get all categories works', () => {
    cy.get('.cardsBlockContainer.mb-5 > .mt-3').click()
    cy.url().should('include', '/category')
  })

  it('checks if search works by clicking search', () => {
    cy.get('input').type('x86')
    cy.get('#search-icon').click()
    cy.url().should('include', '/resources')
    cy.url().should('include', '?q=x86')
  })

  it('checks if search works by pressing enter', () => {
    cy.get('input').type('x86{enter}')
    cy.url().should('include', '/resources')
    cy.url().should('include', '?q=x86')
  })

  it('checks if searching longer terms works', () => {
    cy.get('input').type('category:binary test{enter}')
    cy.url().should('include', '/resources')
    cy.url().should('include', '?q=category%3Abinary+test')
  })
})
