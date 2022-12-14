import React from 'react';
import { screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import Routes from '../helpers/Routes';
import renderWithRouterAndProvider, { history } from './renderWithProviderAndRouter';

const fetchMock = require('../../cypress/mocks/fetch');

global.fetch = fetchMock;
const exploreFoodsPath = '/explore/foods';

describe('10 - Testa na tela de explorar se', () => {
  const { getComputedStyle } = window;
  window.getComputedStyle = (elt) => getComputedStyle(elt);
  it('10.1 - A tela carrega os elementos corretamente', async () => {
    await act(async () => {
      renderWithRouterAndProvider(<Routes />);
    });

    history.push('/explore/');
    const perfilBtn = await screen.findByRole('button', { name: /profile-icon/i });
    const drinkBtn = await screen.findByRole('button', { name: /drink-icon/i });
    const exploreFoodBtn = await screen.findByRole('button', { name: /explore foods/i });
    const exploreDrinkBtn = await screen.findByRole('button', { name: /explore foods/i });

    expect(perfilBtn).toBeInTheDocument();
    expect(drinkBtn).toBeInTheDocument();
    expect(exploreFoodBtn).toBeInTheDocument();
    expect(exploreDrinkBtn).toBeInTheDocument();
  });

  it('10.2 - A tela Explore Foods contém os elementos conforme esperado', async () => {
    await act(async () => {
      renderWithRouterAndProvider(<Routes />);
    });
    history.push('/explore/');

    const exploreFoodBtn = await screen.findByRole('button', { name: /explore foods/i });
    userEvent.click(exploreFoodBtn);

    expect(history.location.pathname).toBe(exploreFoodsPath);

    const perfilBtn = await screen.findByRole('button', { name: /profile-icon/i });
    const drinkBtn = await screen.findByRole('button', { name: /drink-icon/i });
    const ingredientBtn = await screen.findByRole('button', { name: /by ingredient/i });
    const nationalityBtn = await screen.findByRole('button', { name: /by nationality/i });
    const surpriseBtn = await screen.findByRole('button', { name: /surprise me!/i });

    expect(perfilBtn).toBeInTheDocument();
    expect(drinkBtn).toBeInTheDocument();
    expect(ingredientBtn).toBeInTheDocument();
    expect(nationalityBtn).toBeInTheDocument();
    expect(surpriseBtn).toBeInTheDocument();
  });

  it('10.3 - A tela Explore Foods by Ingredient contém os elementos'
      + ' conforme esperado', async () => {
    await act(async () => {
      renderWithRouterAndProvider(<Routes />);
    });
    history.push('/explore/foods');

    const ingredientBtn = await screen.findByRole('button', { name: /by ingredient/i });
    userEvent.click(ingredientBtn);

    const perfilBtn = await screen.findByRole('button', { name: /profile-icon/i });
    const drinkBtn = screen.getByRole('button', { name: /drink-icon/i });
    const firstIngredient = screen.getByTestId('0-ingredient-card');

    expect(firstIngredient).toBeInTheDocument();
    expect(perfilBtn).toBeInTheDocument();
    expect(drinkBtn).toBeInTheDocument();

    userEvent.click(firstIngredient);
  });

  it('10.4 - A tela Explore Foods by Nationality contém os elementos'
      + ' conforme esperado', async () => {
    await act(async () => {
      renderWithRouterAndProvider(<Routes />);
    });
    history.push(exploreFoodsPath);

    const nationalityBtn = await screen.findByRole('button', { name: /by nationality/i });
    userEvent.click(nationalityBtn);

    const perfilBtn = await screen.findByRole('button', { name: /profile-icon/i });
    // const nationalityFilter = screen.getByRole('combobox');
    const drinkBtn = screen.getByRole('button', { name: /drink-icon/i });
    const firstIngredient = screen.getByTestId('0-recipe-card');

    // userEvent.selectOptions(nationalityFilter, 2);
    // userEvent.selectOptions(nationalityFilter, 0);
    expect(firstIngredient).toBeInTheDocument();
    expect(perfilBtn).toBeInTheDocument();
    expect(drinkBtn).toBeInTheDocument();

    userEvent.click(firstIngredient);
  });

  it('10.5 - O botão Surprise Me funciona conforme esperado', async () => {
    await act(async () => {
      renderWithRouterAndProvider(<Routes />);
    });
    history.push(exploreFoodsPath);

    const surpriseBtn = await screen.findByRole('button', { name: /surprise me!/i });
    userEvent.click(surpriseBtn);
  });
});
