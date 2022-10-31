/**
 * @jest-environment jsdom
 */

import { render, waitFor, userEvent } from '@/tests/utils';
import { SignUpForm } from '@/components/auth/SignUpForm';
import '@/tests/matchMedia.mock';

// https://github.com/nextauthjs/next-auth/discussions/4185
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');

  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: 'admin' },
  };

  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: 'authenticated' }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

describe('SignUpForm', () => {
  it.only('loads', async () => {
    expect(render(<SignUpForm />)).not.toThrowError();
  });

  describe('email validation', () => {
    it('shows errors when invalid', async () => {
      const { getByLabelText, getByText } = render(<SignUpForm />);

      // update email
      const emailInput = getByLabelText(/email/i);
      userEvent.type(emailInput, 'notemail');

      // submit form
      const submitButton = getByText(/signup/i);
      userEvent.click(submitButton);

      await waitFor(() => expect(emailInput).toHaveAttribute('aria-invalid', 'true'));

      userEvent.type(emailInput, 'asdf@wee.net');

      await waitFor(() => expect(emailInput).not.toHaveAttribute('aria-invalid', 'true'));
    });
  });

  describe('password validation', () => {
    it('shows errors when invalid', async () => {
      const { getByLabelText, getByText } = render(<SignUpForm />);

      // update password
      const passwordInput = getByLabelText(/password/i);
      userEvent.type(passwordInput, 'pw');

      // submit form
      const submitButton = getByText(/signup/i);
      userEvent.click(submitButton);

      await waitFor(() => expect(passwordInput).toHaveAttribute('aria-invalid', 'true'));

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, 'ihave8characters');

      await waitFor(() => expect(passwordInput).not.toHaveAttribute('aria-invalid', 'true'));
    });
  });
});
