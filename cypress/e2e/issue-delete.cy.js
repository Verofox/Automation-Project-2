
describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      // Access first available issue
      getBacklogList()
        .children()
        .first()
        .find('p')
        .contains(issueTitle)
        .click();
      getIssueDetailsModal()
        .should('be.visible');
    });
  });

  const issueTitle = 'This is an issue of type: Task.'
  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  const getBacklogList = () => cy.get('[data-testid="board-list:backlog"]');
  const getConfirmationPopup = () => cy.get('[data-testid="modal:confirm"]');

  it('Deleting first issue from backlog list and verifying successful removal ', () => {
    getIssueDetailsModal()
      .find('[data-testid="icon:trash"]')
      .click();
    getConfirmationPopup()
      .should('be.visible')
      .contains('button', 'Delete issue')
      .click()
      .should('not.exist');

    cy.reload();

    getBacklogList()
      .should('be.visible')
      .and('have.length', '1')
    // Assert that the first issue from the list has been deleted
      .children()
      .should('have.length', '3')
      .first()
      .should('not.contain', issueTitle);
  });

  it('Initiating the process of deleting the issue, but canceling the action.', () => {
    getIssueDetailsModal()
      .find('[data-testid="icon:trash"]')
      .click();
    getConfirmationPopup()
      .should('be.visible')
      .contains('button', 'Cancel')
      .click()
      .should('not.exist');
    cy.get('[data-testid="icon:close"]')
      .first()
      .click();

    cy.reload();

    getBacklogList()
      .should('be.visible')
      .and('have.length', '1')
    // Assert the presence of the issue in the list
      .children()
      .should('have.length', '4')
      .first()
      .contains(issueTitle);
  });
});

