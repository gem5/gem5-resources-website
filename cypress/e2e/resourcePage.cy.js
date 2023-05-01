/// <reference types="cypress" />
import config from "../../gem5.config.json"

describe('resource Page', () => {
    let resource = {
        "_id": "60f6f1a3b3c9a5c6a0f3e7a6",
        "category": "workload",
        "id": "arm64-ubuntu-20.04-boot",
        "description": "A full boot of Ubuntu 20.04 with Linux 5.4.49 for ARM64. It runs an `m5 exit` command when the boot is completed unless the readfile is specified. If specified the readfile will be executed after booting.",
        "function": "set_kernel_disk_workload",
        "resources": {
            "kernel": "arm64-linux-kernel-5.4.49",
            "disk_image": "arm64-ubuntu-20.04-img",
            "bootloader": "arm64-bootloader-foundation"
        },
        "architecture": "ARM",
        "size": 0,
        "tags": [],
        "code_examples": [
            {
                "example": "https://github.com/gem5/gem5/tree/develop/configs/example/gem5_library/arm-ubuntu-run.py",
                "tested": true
            }
        ],
        "license": "",
        "author": [],
        "source_url": "",
        "resource_version": "1.0.0",
        "gem5_versions": [
            "23.0"
        ],
        "example_usage": "Workload(\"arm64-ubuntu-20.04-boot\")",
        "database": "public"
    }
    beforeEach(() => {
        resource.database = Object.keys(Cypress.env('PRIVATE_RESOURCES'))[0]
        cy.interceptAll()
        cy.visit('/resources/arm64-ubuntu-20.04-boot')
        // find by id+version, aggregate depended by, get schema, find by all versions by id 
        cy.waitFirst().then(isMongo => {
            if (isMongo) {
                cy.wait(['@find', '@getSchema', '@find'])
            } else {
                cy.wait(['@jsonLink', '@getSchema', '@jsonLink'])
            }
        })
        // cy.wait(['@find', '@mongo', '@getSchema', '@find'])
        window.localStorage.setItem('CookieConsent', "{\"userPreference\":\"all\"}")
    })

    it('checks if resource header details are correct', () => {
        cy.get('[style="font-size: 0px;"] > .primary').should('have.text', resource.category.charAt(0).toUpperCase() + resource.category.slice(1))
        cy.get(':nth-child(2) > .text-black').should('have.text', resource.resource_version)
        cy.get('.mt-0 > .text-black').should('have.text', resource.architecture)
        cy.get('[style="position: relative; width: auto;"] > .text-muted').should('have.text', resource.id)
        cy.get(':nth-child(1) > .main-text-title-bold').should('have.text', resource.database + ' /')
        let tags = []
        cy.get('.gap-4 > div.align-items-center span').each(($el) => {
            tags.push($el.text())
        })
        cy.wrap(tags).should('deep.equal', resource.tags)
    })

    it('checks if resource metadata is correct', () => {
        cy.get('.metadata_info__8irfG > :nth-child(3) > :nth-child(2)').should('have.text', resource.description)
        cy.get('.metadata_info__8irfG > :nth-child(4) > :nth-child(2)').should('have.text', resource.license === "" ? "Unknown" : resource.license)
    })

    it.only('checks if tabs are correct', () => {
        cy.log(JSON.stringify(config.ui.tabs[resource.category]))
        cy.get('ul[role=tablist] li').should('have.length', 6 + config.ui.tabs[resource.category].tab.length + (config.ui.tabs[resource.category].additionalInfo.length > 0 ? 1 : 0))
        cy.get('ul[role=tablist] li').last().should('have.text', 'Raw')
        cy.get('ul[role=tablist] li').last().click()
        cy.url().should('include', '/raw')
        cy.get('.tab-pane.active.show span>.copy-button>svg').eq(1).click()
        resource = JSON.parse(JSON.stringify(resource))
        delete resource._id
        delete resource.database
        let resourceString = JSON.stringify(resource, null, 4)
        // resourceString = resourceString.replace(/\n/g, "\r\n")
        cy.assertValueCopiedToClipboard(resourceString)
        cy.get('ul[role=tablist] li').first().should('have.text', 'Readme')
        cy.get('ul[role=tablist] li').first().click()
        cy.url().should('not.include', '/readme')
    })

    it('checks if changing version works', () => {
        cy.get('ul[role=tablist] li').each(($el, index) => {
            if ($el.text() === "Versions") {
                cy.wrap($el).click()
            }
        })
        cy.url().should('include', '/versions')
        cy.get('.table tr').last().within(() => {
            cy.get('td a').first().click()
        })
        cy.url().should('include', 'version=1.0.0')
        // cy.wait(['@find', '@mongo', '@getSchema', '@find'])
        cy.waitFirst().then(isMongo => {
            if (isMongo) {
                cy.wait(['@find', '@getSchema', '@find'])
            } else {
                cy.wait(['@jsonLink', '@getSchema', '@jsonLink'])
            }
        })
        cy.get(':nth-child(2) > .text-black').should('have.text', '1.0.0')
        cy.get('.metadata_info__8irfG > :nth-child(3) > :nth-child(2)').should('not.have.text', resource.description)
    })
})