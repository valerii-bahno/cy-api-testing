describe('Test log out', () => {
    beforeEach('login to application', () => {
        cy.loginToApplication()
    })

    it('Verify user can log out', () => {
        cy.contains('Settings').click()
        cy.contains('Or click here to logout').click()
        cy.get('.navbar-nav').should('contain', 'Sign up')
    })
})