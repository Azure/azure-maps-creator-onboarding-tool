describe('create manifest scenario', () => {
  beforeEach(() => {
    cy.viewport(2048, 1536);
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

    cy.fixture('search-address-seattle').then((json) => {
      cy.intercept({
        method: 'GET',
        url: '**/search/address/json*'
      }, {
        statusCode: 200,
        body: json,
      }).as('searchAddress');
    });

    cy.writeFile('cypress/downloads/drawingpackage.zip', {});
    cy.visit(Cypress.env('baseUrl'));
  });

  it('create manifest scenario', () => {
    cy.get('[data-testid="subscription-key-field"]').type(Cypress.env('subscriptionKey'));
    cy.get('input[type=file]').selectFile('src/common/mocks/contoso.zip', {force: true});
    cy.get('button').contains('Process').click();

    // processing page
    cy.wait('@getManifest', {
      timeout: 15000,
    });

    // Building levels page
    cy.get('input[aria-label="Facility name"]').type('perfect circle');

    cy.get('input[aria-label="Level name of PUGET SOUND_113_01.dwg"]').type('Ground level');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_113_01.dwg"]').type('1');
    cy.get('input[aria-label="Vertical Extent of PUGET SOUND_113_01.dwg"]').type('1.5');

    cy.get('input[aria-label="Level name of PUGET SOUND_113_02.dwg"]').type('Next level');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_113_02.dwg"]').type('22');
    cy.get('input[aria-label="Vertical Extent of PUGET SOUND_113_02.dwg"]').type('2.5');

    cy.get('input[aria-label="Level name of PUGET SOUND_113_03.dwg"]').type('Nivel tres');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_113_03.dwg"]').type('3');
    cy.get('input[aria-label="Vertical Extent of PUGET SOUND_113_03.dwg"]').type('0.0001');

    cy.get('input[aria-label="Level name of PUGET SOUND_113_04.dwg"]').type('Niveau quatre');
    cy.get('input[aria-label="Ordinal of PUGET SOUND_113_04.dwg"]').type('4');
    cy.get('input[aria-label="Vertical Extent of PUGET SOUND_113_04.dwg"]').type('1');

    cy.get('button').contains('Next').click();
    cy.get('button').contains('Next').click();

    // DWG Layers page
    cy.get('input[placeholder="Enter Feature Class Name"]').type('my_class_1');
    cy.get('input[placeholder="Enter Property Name"]').type('my_prop_1');
    cy.get('button.fui-Dropdown__button').eq(1).click();
    cy.get('div[role="menuitemcheckbox"]').contains('A-EQPM-EXST').click();
    cy.get('div[role="menuitemcheckbox"]').contains('RM$TXT').click();
    cy.get('div[role="menuitemcheckbox"]').contains('S-GRID-IDEN-EXST').click();
    cy.get('button.fui-Dropdown__button').eq(1).click();

    // add new feature class
    cy.get('input[placeholder="Enter Feature Class Name"]').type('my_class_2');

    // go to previous page to alter some data
    cy.get('button').contains('Previous').click();
    cy.get('button').contains('Previous').click();
    cy.get('input[aria-label="Ordinal of PUGET SOUND_113_03.dwg"]').type('33');
    cy.get('button').contains('Next').click();
    cy.get('button').contains('Next').click();

    // back to DWG layers page
    // select layers of created feature class
    cy.get('button.fui-Dropdown__button').eq(3).click();
    cy.get('div[role="menuitemcheckbox"]').contains('A-GLAZ-EXST').click();
    cy.get('div[role="menuitemcheckbox"]').contains('A-WALL-CORE-EXST').click();
    cy.get('div[role="menuitemcheckbox"]').contains('A-EQPM-EXST').click();
    cy.get('button.fui-Dropdown__button').eq(3).click();

    // create and remove a feature class
    cy.get('input[placeholder="Enter Feature Class Name"]').type('this_feature_class_will_be_removed');
    cy.get('i[data-icon-name="StatusCircleErrorX"]').eq(3).click();

    // add new prop
    cy.get('input[placeholder="Enter Property Name"]').eq(0).type('new_prop_7');

    // select value for created prop
    cy.get('button.fui-Dropdown__button').eq(2).click();
    cy.get('div[role="menuitemcheckbox"]').contains('LMS_LOCATION').click();
    cy.get('div[role="menuitemcheckbox"]').contains('GROS$TXT').click();
    cy.get('div[role="menuitemcheckbox"]').contains('A-CASE-EXST').click();
    cy.get('button.fui-Dropdown__button').eq(2).click();

    // add another prop
    cy.get('input[placeholder="Enter Property Name"]').eq(0).type('new_prop_8');

    // select value for created prop
    cy.get('button.fui-Dropdown__button').eq(3).click();
    cy.get('div[role="menuitemcheckbox"]').contains('AK-ROOM-LABL').click();
    cy.get('div[role="menuitemcheckbox"]').contains('A-EQPM-EXST').click();
    cy.get('div[role="menuitemcheckbox"]').contains('A-FURN-FREE-EXST').click();
    cy.get('button.fui-Dropdown__button').eq(3).click();
    cy.get('button').contains('Previous').click();

    // Georeference page
    cy.get('button.fui-Dropdown__button').contains('Select Layers').click();
    cy.get('div[role="menuitemcheckbox"]').contains('AK-FLOR-EXTR').click();
    cy.get('div[role="menuitemcheckbox"]').contains('AK-WALL').click();
    cy.get('div').contains('AK-FLOR-EXTR, AK-WALL').click();
    cy.get('input[placeholder="Search Address"]').type('seattle{enter}');
    cy.wait('@searchAddress');
    cy.get('input[aria-label="Rotation in degrees"]').type('100');
    cy.get('button').contains('Next').click();
    cy.get('button').contains('Next').click();

    // Review manifest
    cy.get('button').contains('Create + Download').click();

    // should download correct file
    cy.fixture('manifest').then((expectedManifest) => {
      cy.readFile('cypress/downloads/drawingpackage.zip', 'base64').then((drawingPackage) => {
        cy.task('validateManifestFromZip', { drawingPackage, expectedManifest });
      });
    });
  });
});