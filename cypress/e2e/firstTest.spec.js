describe('Test with backend', () => {

  beforeEach('login to application', () => {
    cy.intercept({ method: 'Get', path: 'tags' }, { fixture: 'tags.json' }).as('getTags')
    cy.loginToApplication()
    cy.wait('@getTags')
  })

  after('Clean up', () => {
    cy.contains('Global Feed').click()
    cy.contains('This is the title').click()
    cy.get('.article-actions').contains('Delete Article').click()
  })

  it('Verify correct request and response', () => {
    cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticles')

    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is the title')
    cy.get('[formcontrolname="description"]').type('This is the description without intercepting')
    cy.get('[formcontrolname="body"]').type('This is the body')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles').then( xhr => {
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('This is the body')
      expect(xhr.response.body.article.description).to.equal('This is the description without intercepting')
    })
  })

  it('Verify popular tags are displayed', () => {
    cy.get('.tag-list')
    .should('contain', 'Cypress')
    .and('contain', 'Api')
    .and('contain', 'GitHub')
  })

  it('Verify global feed likes count', () => {
    cy.intercept('GET', '**/api/articles*', { fixture: 'articles.json'}).as('updateArticles')

    cy.contains('Global Feed').click()
    cy.wait('@updateArticles', { timeout: 5000 })
    cy.get('app-article-list button').then( heartList => {
      expect(heartList[0]).to.contain('10')
      expect(heartList[1]).to.contain('20')
    })

    cy.fixture('articles').then( file => {
      const articleLink = file.articles[1].slug
      file.articles[1].favoritesCount = 21

      cy.intercept('POST', `https://conduit-api.bondaracademy.com/api/articles/${articleLink}/favorite`, { statusCode: 200, body: file })
    })

    cy.get('app-article-list button').eq(1).click().should('contain', '21')
  })

  it('Delete a new article in a global feed', () => {
    const bodyRequest = {
      "article": {
        "tagList": [],
        "title": "Request from API",
        "description": "Description for API",
        "body": "Body for request",
      }
    }

    cy.get('@token').then( token => {
      cy.request({
        url: 'https://conduit-api.bondaracademy.com/api/articles/',
        headers: { 'Authorization': 'Token ' + token },
        method: 'POST',
        body: bodyRequest
      }).then( response => {
        expect(response.status).to.equal(201)
      })

      cy.contains('Global Feed').click()
      cy.get('.article-preview').should('contain', 'Request from API')
      cy.get('.article-preview').first().click()
      cy.get('.article-actions').contains('Delete Article').click()

      cy.request({
        url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
        headers: { 'Authorization': 'Token ' + token },
        method: 'GET'
      }).its('body').then( body => {
        expect(body.articles[0].title).not.to.equal('Request from API')
      })
    })
  })
})