/// <reference types="Cypress"/>

describe('App Component', () => {
    beforeEach(() => {
        cy.visit('https://finaltest1-front.onrender.com')
    })

    it('sanity check that the welcome screen text is as it should be', () => {
        cy.get('#splashD').should('have.text', 'Welcome to Map Central: an online service for creating, editing, and sharing all your favorite maps')
    })
})