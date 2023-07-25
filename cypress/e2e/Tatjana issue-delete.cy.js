//import IssueModal from "../pages/IssueModal";
//let createIssue = createIssueDetails
describe('Issue deleting', () => {
    
    const modalIssueDetails = '[data-testid="modal:issue-details"]';
    const modalConfirm = '[data-testid="modal:confirm"]';
    const backlogList = '[data-testid="board-list:backlog"]';
    const listIssue = '[data-testid="list-issue"]';
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
          cy.visit(url + '/board');
        });
        //Make sure that BACKLOG list has 4 issues
        cy.get(backlogList).should('be.visible').and('have.length', '1').within(() => {
            cy.get(listIssue).should('have.length', '4')
        });
        //Opening the first issue
        cy.get(listIssue).first().click()
        cy.get(modalIssueDetails).should('be.visible')
    });
  
    it('Should delete first issue successfully', () => {
        cy.get(modalIssueDetails).within(() => {
          cy.get('[data-testid="icon:trash"]').click();  
        });
        //Confirm deletion 
        cy.get(modalConfirm).within(() => {
            cy.contains('button', 'Delete issue').click()
        });
        //Assert the pop-window disappeared
        cy.get(modalConfirm).should('not.exist');
        //Assert the issue is deleted from the board
        cy.get(backlogList).should('be.visible').and('have.length', '1').within(() => {
            cy.get(listIssue).should('have.length', '3')
        });
    });

    it('Cancel deleting issue process', () => {
        cy.get(modalIssueDetails).within(() => {
          cy.get('[data-testid="icon:trash"]').click(); 
        });
        //cancel deletion
        cy.get(modalConfirm).within(() => {
        cy.contains('button', 'Cancel').click()
        });
        //Assert the pop-window disappeared
        cy.get(modalConfirm).should('not.exist');
        //close the issue to return back to the Jira board
        cy.get('[data-testid="icon:close"]').first().click()
        //Assert the issue is NOT deleted from the board
        cy.get(backlogList).should('be.visible').and('have.length', '1').within(() => {
            cy.get(listIssue).should('have.length', '4')
        });
    });
})
