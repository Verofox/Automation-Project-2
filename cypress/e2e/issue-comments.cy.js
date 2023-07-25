describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    const getTextareaComment = () => cy.get('textarea[placeholder="Add a comment..."]');
    const getCreatedComments = () => cy.get('[data-testid="issue-comment"]');
    const getModalDeleteConfirm = () => cy.get('[data-testid="modal:confirm"]');

    const createdComment = 'TEST_COMMENT';
    const editedComment = 'TEST_COMMENT_EDITED';

    it('Should validate successful comment operations (create, edit, delete)', () => {
        getIssueDetailsModal().within(() => {
            //Create comment
            cy.contains('Add a comment...')
                .should('exist').click();
            getTextareaComment()
                .click().type(createdComment);
            cy.contains('button', 'Save')
                .click().should('not.exist');
            getCreatedComments()
                .should('have.length', '2')
                .first().should('contain', createdComment)
                //Edit comment
                .contains('Edit').click()
            getTextareaComment()
                .click().clear().type(editedComment);
            cy.contains('button', 'Save')
                .click().should('not.exist');
            getCreatedComments()
                .first().should('contain', editedComment)
                //Delete comment
                .contains('Delete').click();
        });
        getModalDeleteConfirm()
            .contains('button', 'Delete comment')
            .click().should('not.exist');
        getCreatedComments()
            .should('not.contain', editedComment);
    });
});
