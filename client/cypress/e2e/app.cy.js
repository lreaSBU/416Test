/// <reference types="Cypress"/>

describe('App Component', () => {
    beforeEach(() => {
        cy.visit('https://finaltest1-front.onrender.com')
    })

    
    it('sanity check that the welcome screen text is as it should be', () => {
        cy.get('#splashD').should('have.text', 'Welcome to Map Central: This is an online service for creating, editing, and sharing all your favorite maps')
    })

    it('sanity check that the splashscreen credits are as they should be', () => {
        cy.get('#splashC').should('have.text', 'Site created by Spring 2023 CSE 416 Green Team')
    })

    it('sanity check that the login button text is as it should be', () => {
        cy.get('#splashL').should('have.text', 'Get Started')
    })
})