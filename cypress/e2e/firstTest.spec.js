describe('Test with backend', () => {

  beforeEach('login to application', () => {
    cy.intercept('GET', '**/api/tags', { fixture: 'tags.json'}).as('getTags')
    cy.loginToApplication()
    cy.wait('@getTags')
  })

  it('Verify correct request and response', () => {
    cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticles')

    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is the title')
    cy.get('[formcontrolname="description"]').type('This is the description')
    cy.get('[formcontrolname="body"]').type('This is the body')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles').then( xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('This is the body')
      expect(xhr.response.body.article.description).to.equal('This is the description')
    })
  })

  it('Verify popular tags are displayed', () => {
    cy.get('.tag-list')
    .should('contain', 'Cypress')
    .and('contain', 'Api')
    .and('contain', 'GitHub')
  })

  it.only('Verify global feed likes count', () => {
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/*', { fixture: 'articles.json'}).as('updateArticles')
    cy.wait('@updateArticles')

    cy.contains('Global Feed').click()
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
})