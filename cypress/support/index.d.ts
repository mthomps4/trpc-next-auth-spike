/// <reference types="cypress" />

import { User } from '@prisma/client';
import { NextAuthSession } from '../plugins';

declare namespace Cypress {
  interface Chainable {
    login(user: User): Chainable<Element>;
    factory(attrs: any): Chainable<Element>;
  }
}
