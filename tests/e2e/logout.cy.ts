describe('Logout', () => {
  it('properly logs out a user', () => {
    cy.createUserAndLogin().then(({ session }) => {
      console.log({ session });
      const welcomeMsg = `Welcome, ${session.user.profile?.firstName}!`;
      cy.visit('/');
      // Verify signed in as User
      cy.contains(welcomeMsg);

      cy.wait('@session').then(() => {
        // No way to intercept once -- to logout, kill the previous session from login
        cy.intercept('/api/auth/session', { fixture: 'session_error.json', statusCode: 401 }).as(
          'session'
        );

        cy.findByText(/logout/i).click();
        const guestMsg = 'Welcome, Guest!';
        cy.contains(guestMsg);
        cy.contains(/login/i);
      });
    });
  });
});
