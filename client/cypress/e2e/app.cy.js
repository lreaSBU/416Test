/// <reference types="Cypress"/>

describe('App Component', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })

    it('sanity check that the welcome screen text is as it should be', () => {
        cy.get('#splashD').should('have.text', 'Playlister is an online service for easily building, watching, and sharing your favorite songs and music videos')
    })
})