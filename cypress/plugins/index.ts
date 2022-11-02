import path from 'path';

import { User, Profile, Role, Prisma } from '@prisma/client';

import { resetDB, disconnect, setupDB } from '@/tests/helpers';
import * as Factories from '@/tests/factories';

type FactoryNames = keyof typeof Factories extends `${infer T}Factory` ? T : never;

if (process.env.CYPRESS_LOCAL) {
  console.log('--- WARNING --- RUNNING CYPRESS IN LOCAL MODE... database will not be cleaned');

  // make sure we source env.local
  const envPath = path.resolve(process.cwd(), '.env.local');
  require('dotenv').config({ path: envPath });
} else if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), '.env.test');
  require('dotenv').config({ path: envPath });
}

export const setupNodeEvents: Cypress.ConfigOptions['setupNodeEvents'] = (on, _config) => {
  on('before:run', async () => {
    await setupDB();
  });

  on('task', {
    resetDB: () => {
      if (process.env.CYPRESS_LOCAL) return false;

      return resetDB();
    },
    setupDB: () => {
      console.log('Setting up DB', process.env.DATABASE_URL);

      return setupDB();
    },
    disconnectDB: () => {
      return disconnect();
    },
    factory: ({ name, attrs }: { name: FactoryNames; attrs: any }) => {
      const Factory = Factories[`${name}Factory`];

      return Factory.create(attrs);
    },
    mockValidSession: ({ user }: { user: NextAuthSession['user'] }): NextAuthSession => {
      const isAdmin = user.roles.includes(Role.ADMIN);
      return {
        user,
        isAdmin,
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
        idToken: 'id_token',
        accessToken: 'accessToken',
      };
    },
    // login: (user: User & { profile?: Profile }) => {
    //   cy.task<NextAuthSession>('mockValidSession', { user }).then((session) => {
    //     cy.intercept('/api/auth/session', { body: session, statusCode: 200 }).as('session');

    //     cy.intercept('/api/auth/callback/credentials?', {
    //       fixture: 'credentials_success.json',
    //     }).as('credentials');

    //     cy.wait('@session');

    //     return session;
    //   });
    // },
    // createUserAndLogin: (args: Partial<Prisma.UserCreateInput> = {}) => {
    //   const attrs = {
    //     ...args,
    //     password: args?.password || 'abcd1234',
    //   };

    //   return cy
    //     .task<User & { profile?: Profile }>('factory', { name: 'User', attrs })
    //     .then((user) => cy.task('login', user))
    //     .then((session) => session);
    // },
  });
};
