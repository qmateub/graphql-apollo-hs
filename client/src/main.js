import React from 'react'
import { render } from 'react-dom'
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo'
import App from './App'

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000/graphql',
})
const client = new ApolloClient({ networkInterface })

render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('app')
)
