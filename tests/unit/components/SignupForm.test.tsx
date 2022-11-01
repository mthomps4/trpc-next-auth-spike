/**
 * @jest-environment jsdom
 */

import { render, waitFor, userEvent } from '@/tests/utils';
import { SignUpForm } from '@/components/auth/SignUpForm';

describe('SignUpForm', () => {
  it('loads', async () => {
    expect(() => render(<SignUpForm />)).not.toThrowError();
  });

  describe('Validation', () => {
    it('shows errors when email invalid', async () => {
      const { getByLabelText, getByText } = render(<SignUpForm />);

      // update email
      const emailInput = getByLabelText(/email/i);
      userEvent.type(emailInput, 'notemail');

      // submit form
      const submitButton = getByText(/sign up/i);
      userEvent.click(submitButton);

      await waitFor(() => expect(emailInput).toHaveAttribute('aria-invalid', 'true'));

      userEvent.type(emailInput, 'asdf@wee.net');

      await waitFor(() => expect(emailInput).not.toHaveAttribute('aria-invalid', 'true'));
    });

    it('shows errors when password invalid', async () => {
      const { getAllByLabelText, getByText } = render(<SignUpForm />);

      // update password
      const passwordInput = getAllByLabelText(/password/i)[0];
      userEvent.type(passwordInput, 'pw');

      // submit form
      const submitButton = getByText(/sign up/i);
      userEvent.click(submitButton);

      await waitFor(() => expect(passwordInput).toHaveAttribute('aria-invalid', 'true'));

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, 'ihave8characters');

      await waitFor(() => expect(passwordInput).not.toHaveAttribute('aria-invalid', 'true'));
    });
  });

  describe('Successful Signup', () => {
    it('routes a user to the home page', async () => {
      const a = 2;
    });
  });
});
