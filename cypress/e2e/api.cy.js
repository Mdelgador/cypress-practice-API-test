describe('REST API testing', () => {
	it('passes', () => {
		cy.request('/users/2').then((response) => {
			cy.log(JSON.stringify(response.body))
			cy.log(JSON.stringify(response.body.data.email))
		})
	})
})

describe('Api testing cypress headers', () => {
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
	it('API tests- Status Codes', () => {
		cy.request('/users/2').as('existingUser')
		cy.get('@existingUser').its('status').should('equal', 200)

		cy.request({ url: '/users/non-exist', failOnStatusCode: false }).as(
			'nonExistingUser'
		)
		cy.get('@nonExistingUser').its('status').should('equal', 404)
	})
	it('API tests - GET request', () => {
		cy.request({ url: '/users/2', method: 'GET' }).as('users')
		cy.get('@users').then((res) => {
			cy.log(JSON.stringify(res.body))
			expect(res.body.data.id).equal(2)
			expect(res.body.data.email).contain('janet.weaver@reqres.in')
			expect(res.body.data.last_name).not.to.contain('SomeRareName')

			const userID = res.body.data.id
			expect(userID).to.equal(2) //using the response in a variable
		})
	})
    it('API tests - POST request', () => {
      cy.request({
          method: 'POST',
          url: '/login',
          body: {
            email: 'eve.holt@reqres.in',
            password: 'cityslicka'
          },
        }).as('loginRequest')

        cy.get('@loginRequest').its('status').should('equal', 200)
        cy.get('@loginRequest').then((res) => {
            expect(res.body.token).to.equal('QpwL5tke4Pnpja7X4')
        })

    
    });
    it('API tests - POST request - error', () => {
        cy.request({
            method: 'POST',
            url: '/login',
            failOnStatusCode: false,
            body: {
              email: 'eve.holt@reqres.in',
            },
          }).as('loginRequest')
          cy.get('@loginRequest').its('status').should('equal', 400)
          cy.get('@loginRequest').then((res)=>{
            expect(res.body.error).to.equal('Missing password')
          })
    });
    it('API tests - DELETE request', () => {
       cy.request({
           method: 'DELETE',
           url: '/users/2',
         }).as('deleteUser')
        cy.get('@deleteUser').its('status').should('equal', 204)
    });
    it('API tests - PUT request', () => {
       cy.request({
           method: 'PUT',
           url: '/users/2',
           body: {
             name: "morpheus",
             job: "zion capitan"
           },
         }).as('updateUser')
        cy.get('@updateUser').its('status').should('equal', 200)
        cy.get('@updateUser').then((res)=>{
            expect(res.body.name).to.equal('morpheus')
            expect(res.body.job).to.equal('zion capitan')
        })
    });

})
