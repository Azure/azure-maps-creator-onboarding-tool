describe('create manifest scenario', () => {
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

    cy.fixture('advanta').then((json) => {
      cy.intercept({
        method: 'GET',
        url: '**/very-secret-operation-location*'
      }, {
        statusCode: 200,
        body: json,
      }).as('getStatus');
    });

    cy.fixture('search-address-seattle').then((json) => {
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

  it('create manifest scenario', () => {
    // home page
    // move to the next page
    cy.get('button').contains('Create').click();

    // create manifest page
    cy.get('[data-testid="subscription-key-field"]').type(Cypress.env('subscriptionKey'));
    cy.get('input[type=file]').selectFile('src/common/mocks/contoso.zip', {force: true});
    cy.get('button').contains('Process').click();

    // processing page
    cy.wait('@getStatus', {
      timeout: 11000,
    });

    // Building levels page
    cy.get('input[aria-label="Level name of PUGET SOUND_ADVANTA-A_01.dwg"]').type('Ground level');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_ADVANTA-A_01.dwg"]').type('1');

    cy.get('input[aria-label="Level name of PUGET SOUND_ADVANTA-A_02.dwg"]').type('Next level');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_ADVANTA-A_02.dwg"]').type('22');

    cy.get('input[aria-label="Level name of PUGET SOUND_ADVANTA-A_03.dwg"]').type('Nivel tres');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_ADVANTA-A_03.dwg"]').type('3');

    cy.get('input[aria-label="Level name of PUGET SOUND_ADVANTA-A_04.dwg"]').type('Niveau quatre');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_ADVANTA-A_04.dwg"]').type('4');

    cy.get('input[aria-label="Level name of PUGET SOUND_ADVANTA-A_05.dwg"]').type('第五級');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_ADVANTA-A_05.dwg"]').type('5');

    cy.get('input[aria-label="Level name of PUGET SOUND_ADVANTA-A_06.dwg"]').type('Уровень шесть');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_ADVANTA-A_06.dwg"]').type('6');

    cy.get('input[aria-label="Level name of PUGET SOUND_ADVANTA-A_07.dwg"]').type('المستوى السابع');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_ADVANTA-A_07.dwg"]').type('7');

    cy.get('button').contains('Next').click();

    // DWG Layers page
    // select exterior layers
    cy.get('span.ms-Dropdown-title').eq(0).click();
    cy.get('span').contains('A-BOMA').click();
    cy.get('span').contains('A-FURN-FREE-EXST').click();
    cy.get('span').contains('A-BOMA, A-FURN-FREE-EXST').click();

    // add new feature class
    cy.get('input[placeholder="Enter Feature Class Name"]').type('new_feature_class_12b');

    // go to previous page to alter some data
    cy.get('button').contains('Previous').click();
    cy.get('input[aria-label="Ordinal of PUGET SOUND_ADVANTA-A_03.dwg"]').type('33');
    cy.get('button').contains('Next').click();

    // back to DWG layers page
    // select layers of created feature class
    cy.get('span.ms-Dropdown-title').eq(2).click();
    cy.get('span').contains('A-GLAZ-EXST').click();
    cy.get('span').contains('A-WALL-CORE-EXST').click();
    cy.get('span').contains('A-GLAZ-EXST, A-WALL-CORE-EXST').click();

    // create and remove a feature class
    cy.get('input[placeholder="Enter Feature Class Name"]').type('this_feature_class_will_be_removed');
    cy.get('i[data-icon-name="StatusCircleErrorX"]').eq(1).click();

    // add new prop
    cy.get('input[placeholder="Enter Property Name"]').eq(0).type('new_prop_7');

    // select value for created prop
    cy.get('span.ms-Dropdown-title').eq(1).click();
    cy.get('span').contains('RM$TXT').click();
    cy.get('span').contains('GROS$TXT').click();
    cy.get('span').contains('RM$TXT, GROS$TXT').click();

    // add another prop
    cy.get('input[placeholder="Enter Property Name"]').eq(1).type('new_prop_8');

    // select value for created prop
    cy.get('span.ms-Dropdown-title').eq(4).click();
    cy.get('span').contains('AK-ROOM-LABL').click();
    cy.get('span').contains('A-EQPM-EXST').click();
    cy.get('span').contains('AK-ROOM-LABL, A-EQPM-EXST').click();
    cy.get('button').contains('Next').click();

    // Georeference page
    cy.get('input[placeholder="Search Address"]').type('seattle{enter}');
    cy.wait('@searchAddress');
    cy.get('input[aria-label="Rotation in degrees"]').type('100');

    // Review manifest
    cy.get('button').contains('Review + Download').click();
    cy.get('button[data-test-id="download-manifest-button"]').contains('Download').click();

    // should download correct file
    cy.fixture('manifest').then((expectedManifestJSon) => {
      cy.readFile('cypress/downloads/manifest.json').should('deep.eq', expectedManifestJSon);
    });
  });
});