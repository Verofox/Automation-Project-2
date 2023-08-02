describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project`)
      .then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
      });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should(
        'contain',
        'Lord Gaben'
      );

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        'have.text',
        'Pickle Rick'
      );

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow').click().should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save').click().should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should(
        'have.text',
        title
      );
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  // BONUS Task 1
  it('Should check priority dropdown lenght', () => {
    const getPriorityDropdown = () => cy.get('[data-testid="select:priority"]');
    const getSelectDropdownOption = () =>
      cy.get('[data-testid*="select-option"]');

    const expectedLenght = 5;
    let priorityOptions = [];

    getIssueDetailsModal().within(() => {
      getPriorityDropdown()
        .find('i')
        .next()
        .invoke('text')
        .then((initiallySelectedPriority) => {
          priorityOptions.push(initiallySelectedPriority.trim());
          cy.log(
            `Added value: ${initiallySelectedPriority.trim()}, Array length: ${
              priorityOptions.length
            }`
          );
        });
      getPriorityDropdown().click();
      getSelectDropdownOption()
        .each(($option) => {
          priorityOptions.push($option.text().trim());
          cy.log(
            `Added value: ${$option.text().trim()}, Array length: ${
              priorityOptions.length
            }`
          );
        })
        .then(() => {
          // Assert the array length
          expect(priorityOptions.length).to.equal(expectedLenght);
        });
    });
  });

  // BONUS Task 2
  it('Should check that reporter name has only characters in it ', () => {
    const getAvatarText = () => cy.get('[data-testid="avatar:Baby Yoda"]');
    const pattern = /^[A-Za-z\s]*$/;

    getIssueDetailsModal().within(() => {
      getAvatarText().next().invoke('text').should('match', pattern);
    });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
});
