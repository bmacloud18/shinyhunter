import React from 'react'
import ProfileHeader from './profileHeader'

describe('<ProfileHeader />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ProfileHeader user={null}/>)
  })
})