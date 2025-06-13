/// <reference types="cypress" />




describe('login test', () => {
  const username = 'aboutbean';
  const pass = 'piepiepie27';
  it('logs in user', () => {
    cy.visit('http://ec2-3-16-129-81.us-east-2.compute.amazonaws.com/shinyhunter/signin');

    cy.url().should('eq', 'http://ec2-3-16-129-81.us-east-2.compute.amazonaws.com/shinyhunter/signin')

    cy.get(".border-green")
      .parent()
      .find('input[type=text]')
      .type(`${username}`)
    cy.get(".border-green")
      .parent()
      .find('input[type=password]')
      .type(`${pass}`)

    cy.get('.border-green').contains('Sign In').click()

    cy.contains('Active')
      .parent()
      .find('a')
      .children('.flex')
      .should('include.text', 'za legend')
  })
})