describe('Api testing cypress', () => {
	it('passes', () => {
		cy.request('/users/2').then((response) => {
			cy.log(JSON.stringify(response.body.data.email))
			cy.log(JSON.stringify(response.headers))
		})
	})

	it('API test - Validate Headers', () => {
		cy.request('/users/2').as('user')
		cy.get('@user')
			.its('headers')
			.its('content-type')
			.should('include', 'application/json')
		cy.get('@user')
			.its('headers')
			.its('connection')
			.should('include', 'keep-alive')
		cy.get('@user').its('headers').its('server').should('include', 'cloudflare')
	})
})
