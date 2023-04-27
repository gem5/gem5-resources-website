/// <reference types="cypress" />

describe('Search page', () => {
    beforeEach(() => {
        cy.interceptAll()
        cy.visit('/resources')
        cy.waitAuto()
        cy.waitAuto()
        window.localStorage.setItem('CookieConsent', "{\"userPreference\":\"all\"}")
    })

    it('checks if exact search works', () => {
        cy.get('.search-form').find('input').type('riscv-ubuntu-20.04-boot{enter}')
        cy.waitAuto()
        cy.url().should('include', '/resources')
        cy.url().should('include', '?q=riscv-ubuntu-20.04-boot')
        cy.get(':nth-child(1) > .search-result > a > .search-result__title > [aria-label="Resource ID"]').should('have.text', 'riscv-ubuntu-20.04-boot')
    })

    it('checks if category filter works', () => {
        cy.get(':nth-child(1) > .accordion-header > .accordion-button').click()
        cy.get('#diskimage').click()
        cy.waitAuto()
        // cy.wait(['@kiwi', '@resources', '@mongo'])
        // check if each search result has the category
        cy.get('.search-result').each(($el) => {
            cy.wrap($el).find('a > .gap-3 > :nth-child(2) > .text-capitalize').should('contain.text', 'diskimage')
        })
        cy.get('.search-form').find('input').should('have.value', 'category:diskimage ')
    })

    it('checks if filter query changes the checkbox', () => {
        cy.get('.search-form').find('input').type('architecture:RISCV{enter}')
        cy.waitAuto()
        // cy.wait(['@kiwi', '@resources', '@mongo'])
        cy.get(':nth-child(2) > .accordion-header > .accordion-button').click()
        cy.get('#RISCV').should('be.checked')
        cy.get('.search-result').each(($el) => {
            cy.wrap($el).find('a > .gap-3 > .align-items-center > p').should('contain.text', 'RISCV')
        })
    })

    it('checks if sorting by version works', () => {
        cy.get('.d-flex > .w-auto').select('version')
        cy.waitAuto()
        // cy.wait(['@kiwi', '@resources', '@mongo'])
        cy.url().should('include', 'sort=version')
    })

    it('checks if sorting by resource id works', () => {
        cy.get('.d-flex > .w-auto').select('id_asc')
        cy.waitAuto()
        // cy.wait(['@kiwi', '@resources', '@mongo'])
        cy.url().should('include', 'sort=id_asc')
        let ids = []
        cy.get('.search-result').each(($el) => {
            cy.wrap($el).find('a > .search-result__title > [aria-label="Resource ID"]').then(($el) => {
                ids.push($el.text())
            })
        }).then(() => {
            let sortedIds = [...ids].sort()
            expect(ids).to.deep.equal(sortedIds)
        })
        cy.get('.d-flex > .w-auto').select('id_desc')
        cy.waitAuto()
        // cy.wait(['@kiwi', '@resources', '@mongo'])
        cy.url().should('include', 'sort=id_desc')
        let idsDesc = []
        cy.get('.search-result').each(($el) => {
            cy.wrap($el).find('a > .search-result__title > [aria-label="Resource ID"]').then(($el) => {
                idsDesc.push($el.text())
            })
        }).then(() => {
            let sortedIds = [...idsDesc].sort().reverse()
            expect(idsDesc).to.deep.equal(sortedIds)
        })
        cy.log(idsDesc)
    })

    it('checks if clicking on resource routing works', () => {
        cy.get('.search-form').find('input').type('riscv-ubuntu-20.04-boot{enter}')
        cy.waitAuto()
        // cy.wait(['@kiwi', '@resources', '@mongo'])
        cy.get(':nth-child(1) > .search-result > a > .search-result__title > [aria-label="Resource ID"]').click()
        cy.url().should('include', '/resources/riscv-ubuntu-20.04-boot')
    })

    it('checks if filtering by tags works', () => {
        cy.get('.search-form').find('input').type('tags:asmtest{enter}')
        cy.waitAuto()
        // cy.wait(['@kiwi', '@resources', '@mongo'])
        cy.get('.search-result').each(($el) => {
            let tags = []
            cy.wrap($el).find('a > .gap-3 > [aria-label="Resource tags"] > div > .badge').each(($el) => {
                tags.push($el.text())
            }).then(() => {
                expect(tags).to.include('asmtest')
            })
        })
    })

    it('checks if changing page works', () => {
        // << < 1 2 3 > >>
        cy.get('.page-link').eq(3).click()
        cy.waitAuto()
        // cy.wait(['@kiwi', '@resources', '@mongo'])
        cy.url().should('include', 'page=2')
        cy.get('.page-link').eq(4).click()
        cy.waitAuto()
        // cy.wait(['@kiwi', '@resources', '@mongo'])
        cy.url().should('include', 'page=3')
    })

    it('checks if changing page size works', () => {
        cy.get('.results-sortBy-row').find('select').first().select('25')
        cy.waitAuto()
        // cy.wait(['@kiwi', '@resources', '@mongo'])
        cy.url().should('include', 'limit=25')
        cy.get('.search-result').should('have.length', 25)
    })
})