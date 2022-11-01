/// <reference types="cypress" />
// ***********************************************
// For comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands';

import { Prisma, User } from '@prisma/client';
import { NextAuthSession } from '@/cypress/plugins';

declare global {
  namespace Cypress {
    interface Chainable {
      login: typeof login;
      createUserAndLogin: typeof createUserAndLogin;
    }
  }
}

/**
 *  Handles logging a user in via email and password.
 *  This should be used to login in future e2e tests instead of the login form.
 */

function login(user: NextAuthSession['user']) {
  return cy.task<NextAuthSession>('mockValidSession', { user }).then((session) => {
    cy.intercept('/api/auth/session', { body: session, statusCode: 200 }).as('session');

    cy.intercept('/api/auth/callback/credentials?', {
      fixture: 'credentials_success.json',
    }).as('credentials');

    cy.wait('@session');

    return session;
  });
}

/**
 *  Handles creating and logging in a user with a set of attributes
 *  This should be used to login in future e2e tests instead of the login form.
 */
function createUserAndLogin(args: Partial<Prisma.UserCreateInput> = {}) {
  const attrs = {
    ...args,
    password: args?.password || 'abcd1234',
  };

  return cy.task<NextAuthSession['user']>('factory', { name: 'User', attrs }).then((user) =>
    cy.login(user).then((session) => ({
      session,
      user,
    }))
  );
}

Cypress.Commands.add('login', login);
Cypress.Commands.add('createUserAndLogin', createUserAndLogin);
