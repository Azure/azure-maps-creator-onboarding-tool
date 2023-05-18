describe('edit manifest scenario', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'POST',
    }, {
      statusCode: 202,
      headers: {
        'Operation-Location': 'very-secret-operation-location',
      },
      delayMs: 500,
    });

    cy.intercept({
      method: 'GET',
      url: '**/very-secret-operation-location*'
    }, {
      statusCode: 200,
      headers: {
        'Resource-Location': 'fetch-manifest-url',
      },
      body: {
        status: 'Succeeded',
      },
    });

    cy.fixture('layer_preview').then((json) => {
      cy.intercept({
        method: 'GET',
        url: '**/fetch-manifest-url*'
      }, {
        statusCode: 200,
        body: json,
      }).as('getManifest');
    });

    cy.fixture('search-address-casablanca').then((json) => {
      cy.intercept({
        method: 'GET',
        url: '**/search/address/json*'
      }, {
        statusCode: 200,
        body: json,
      }).as('searchAddress');
    });

    cy.writeFile('cypress/downloads/manifest.json', {});
    cy.visit(Cypress.env('baseUrl'));
  });

  it('edit manifest scenario', () => {
    // home page
    // move to the next page
    cy.get('button').contains('Edit').click();

    // create manifest page
    cy.get('[data-testid="subscription-key-field"]').type(Cypress.env('subscriptionKey'));
    cy.get('input[type=file]').eq(0).selectFile('src/common/mocks/contoso.zip', {force: true});
    cy.get('input[type=file]').eq(1).selectFile('cypress/fixtures/manifest.json', {force: true});
    cy.get('button').contains('Process').click();

    // processing page
    cy.wait('@getManifest', {
      timeout: 11000,
    });

    // Building levels page
    cy.get('input[aria-label="Level name of PUGET SOUND_ADVANTA-A_04.dwg"]').clear().type('La France remportera la coupe du monde ce dimanche');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_ADVANTA-A_07.dwg"]').type('73');

    cy.get('button').contains('Next').click();

    // DWG Layers page
    cy.get('button[aria-label="Delete layer my_class_1"]').click();

    cy.get('button').contains('Next').click();

    // Georeference page
    cy.get('input[placeholder="Search Address"]').type('casablanca{enter}');
    cy.wait('@searchAddress');
    cy.get('input[aria-label="Rotation in degrees"]').clear().type('###15asc5al!!@#sh5634dlkjh');

    // Review manifest
    cy.get('button').contains('Review + Download').click();
    cy.get('button[data-test-id="download-manifest-button"]').contains('Download').click();

    // should download correct file
    cy.fixture('edited-manifest').then((expectedManifestJSon) => {
      cy.readFile('cypress/downloads/manifest.json').should('deep.eq', expectedManifestJSon);
    });
  });
});