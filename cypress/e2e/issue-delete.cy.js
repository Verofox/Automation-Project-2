
describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      // Access first available issue
      cy.get('[data-testid="board-list:backlog"]')
        .children()
        .first()
        .click();
      cy.get('[data-testid="modal:issue-details"]')
        .should('be.visible');
    });
  });

  let issueTitle = 'This is an issue of type: Task.'
  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

  it('Deleting first issue from backlog list and verifying successful removal ', () => {
    getIssueDetailsModal()
      .find('[data-testid="icon:trash"]')
      .click();
    cy.get('[data-testid="modal:confirm"]')
      .should('be.visible');
    cy.get('[data-testid="modal:confirm"]')
      .contains('button', 'Delete issue')
      .click()
      .should('not.exist');

    cy.reload();

    cy.get('[data-testid="board-list:backlog')
      .should('be.visible')
      .and('have.length', '1').within(() => {
        // Assert that the first issue from the list has been deleted
        cy.get('[data-testid="list-issue"]')
        .should('have.length', '3')
        .first()
        .contains(issueTitle)
        .should('not.exist');
      });
  });

  it('Initiating the process of deleting the issue, but canceling the action.', () => {
    getIssueDetailsModal()
      .find('[data-testid="icon:trash"]')
      .click();
    cy.get('[data-testid="modal:confirm"]')
      .should('be.visible');
    cy.get('[data-testid="modal:confirm"]')
      .contains('button', 'Cancel')
      .click()
      .should('not.exist');
    cy.get('[data-testid="icon:close"]')
      .first()
      .click();

    cy.reload();

    cy.get('[data-testid="board-list:backlog')
      .should('be.visible')
      .and('have.length', '1').within(() => {
        // Assert that the first issue from the list is visible
        cy.get('[data-testid="list-issue"]')
        .should('have.length', '4')
        .first()
        .contains(issueTitle)
        .should('be.visible');
      });
  });
});

