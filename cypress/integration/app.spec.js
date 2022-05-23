/* eslint-disable no-undef */
/// <reference types="Cypress" />

describe('Show text along the pages', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=navbar-login]').click();
    cy.get('[data-cy=email]').type(Cypress.env('email'));
    cy.get('[data-cy=password]').type(Cypress.env('password'));
    cy.get('[data-cy=login-button]').click();
    cy.contains('Login successful');
    cy.get('[data-cy=intercept-button]').click();
  });

  afterEach(() => {
    cy.get('[data-cy=navbar-logout]').click();
    cy.get('[data-cy=intercept-button]').click();
  });

  it('should show text on the home page', () => {
    cy.contains('Quickstart');
    cy.contains('How to create tournaments?');
    cy.contains('How to join a tournament?');
    cy.contains('How to track a tournament?');
    cy.contains('About the developer!');
  });

  it('should show menu options', () => {
    cy.get('[data-cy=collapsable-button]').click();
    cy.contains('Home');
    cy.contains('Tournaments');
    cy.contains('Profile');
    cy.contains('Invitations');
    cy.contains('Creator');
  });

  it('should show profile information', () => {
    cy.get('[data-cy=collapsable-button]').click();
    cy.contains('Profile').click();
    cy.contains(Cypress.env('email'));
    cy.get('[data-cy=username]').invoke('attr', 'placeholder').should('contain', Cypress.env('username'));
    cy.contains('Created');
    cy.contains('Participating');
    cy.contains('Finished');
  });

  it('should show tournaments information', () => {
    cy.get('[data-cy=collapsable-button]').click();
    cy.contains('Tournaments').click();
    cy.contains('Create a Tournament!');
    cy.contains('Join a tournament!');
    cy.contains('Watch tournament results');
  });

  it('should show invitations information', () => {
    cy.get('[data-cy=collapsable-button]').click();
    cy.contains('Invitations').click();
    cy.contains('Tournament Invitations');
  });
});

describe('Actionable', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=navbar-login]').click();
    cy.get('[data-cy=email]').type(Cypress.env('email'));
    cy.get('[data-cy=password]').type(Cypress.env('password'));
    cy.get('[data-cy=login-button]').click();
    cy.contains('Login successful');
    cy.get('[data-cy=intercept-button]').click();
  });

  afterEach(() => {
    cy.get('[data-cy=navbar-logout]').click();
    cy.get('[data-cy=intercept-button]').click();
  });

  it('should update profile', () => {
    cy.get('[data-cy=collapsable-button]').click();
    cy.contains('Profile').click();
    cy.get('[data-cy=username]').type(Cypress.env('newUsername'));
    cy.get('[data-cy=update-button]').click();
    cy.wait(5000);
    cy.get('[data-cy=username]').invoke('attr', 'placeholder').should('contain', Cypress.env('newUsername'));
    cy.get('[data-cy=username]').type(Cypress.env('username'));
    cy.get('[data-cy=update-button]').click();
    cy.wait(5000);
    cy.get('[data-cy=username]').invoke('attr', 'placeholder').should('contain', Cypress.env('username'));
  });

  it('should create an open tournament', () => {
    cy.get('[data-cy=collapsable-button]').click();
    cy.contains('Tournaments').click();
    cy.get('[data-cy=create-button]').click();
    cy.get('[data-cy=new-tournament-title]').type(Cypress.env('openTournament'));
    cy.get('[data-cy=new-tournament-game]').type('New Test Game');
    cy.get('[data-cy=new-tournament-type]').select('Free For All');
    cy.get('[data-cy=new-tournament-public]').check();
    cy.get('[data-cy=new-tournament-scale]').select('Win/Loss');
    cy.get('[data-cy=new-tournament-max]').type(5);
    cy.get('[data-cy=new-tournament-create]').click();
    cy.get('[data-cy=intercept-button]').click();
  });

  it('should join an open tournament', () => {
    cy.get('[data-cy=collapsable-button]').click();
    cy.contains('Tournaments').click();
    cy.get(`[data-cy=${Cypress.env('openTournament')}-join]`).click();
    cy.get('[data-cy=join-tournament-button]').click();
    cy.get('[data-cy=validationIntercept-button]').click();
  });

  it('should delete an open tournament', () => {
    cy.get('[data-cy=collapsable-button]').click();
    cy.contains('Profile').click();
    cy.get(`[data-cy=${Cypress.env('openTournament')}-dashboard]`).click();
    cy.get('[data-cy=delete-button]').click();
    cy.get('[data-cy=validationIntercept-button]').click();
  });

  it('should create a private tournament', () => {
    cy.get('[data-cy=collapsable-button]').click();
    cy.contains('Tournaments').click();
    cy.get('[data-cy=create-button]').click();
    cy.get('[data-cy=new-tournament-title]').type(Cypress.env('privateTournament'));
    cy.get('[data-cy=new-tournament-game]').type('New Test Game');
    cy.get('[data-cy=new-tournament-type]').select('Free For All');
    cy.get('[data-cy=new-tournament-scale]').select('Win/Loss');
    cy.get('[data-cy=new-tournament-players]').type(Cypress.env('username'));
    cy.get('[data-cy=new-tournament-add-player]').click();
    cy.get('[data-cy=new-tournament-players]').type(Cypress.env('friendUsername'));
    cy.get('[data-cy=new-tournament-add-player]').click();
    cy.get('[data-cy=new-tournament-create]').click();
    cy.get('[data-cy=intercept-button]').click();
  });

  it('should join a private tournament', () => {
    cy.get('[data-cy=collapsable-button]').click();
    cy.contains('Invitations').click();
    cy.get(`[data-cy=${Cypress.env('privateTournament')}-accept]`).click();
    cy.get('[data-cy=intercept-button]').click();
  });

  it('should delete a private tournament', () => {
    cy.get('[data-cy=collapsable-button]').click();
    cy.contains('Profile').click();
    cy.get(`[data-cy=${Cypress.env('privateTournament')}-dashboard]`).click();
    cy.get('[data-cy=delete-button]').click();
    cy.get('[data-cy=validationIntercept-button]').click();
  });
});
