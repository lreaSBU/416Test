/// <reference types="Cypress"/>

describe('App Component', () => {
    beforeEach(() => {
        cy.visit('https://finaltest1-front.onrender.com')
    })

    it('sanity check that the welcome screen text is as it should be', () => {
        cy.get('#splashD').should('have.text', 'Playlister is an online service for easily building, watching, and sharing your favorite songs and music videos')
    })
})