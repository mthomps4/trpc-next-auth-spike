/**
 * @jest-environment jsdom
 */

import { screen } from '@testing-library/dom';

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
    it.only('routes a user to the home page', async () => {
      const { getByLabelText, getAllByLabelText, getByText, findByText } = render(<SignUpForm />);
      screen.logTestingPlaygroundURL();
      const firstNameInput = getByText(/first name/i);
      userEvent.type(firstNameInput, 'Barry');

      const lastNameInput = getByLabelText(/last name/i);
      userEvent.type(lastNameInput, 'Allen');

      const emailInput = getByLabelText(/email/i);
      userEvent.type(emailInput, 'ballen@speedforce.net');

      // get by label picks up on both password fields
      const passwordInput = getAllByLabelText(/password/i)[0];
      userEvent.type(passwordInput, 'super_secret');

      const confirmPasswordInput = getByLabelText(/confirm password/i);
      userEvent.type(confirmPasswordInput, 'super_secret');

      const submitButton = getByText(/sign up/i);
      userEvent.click(submitButton);

      const welcome = await findByText('Welcome, Barry!');

      expect(welcome).toBeInTheDocument();
    });
  });
});
