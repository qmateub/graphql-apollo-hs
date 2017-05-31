import React, { Component, PropTypes } from 'react';
import { gql, graphql, withApollo } from 'react-apollo'
import { compose, mapProps } from 'recompose'
import Select from 'react-select'
import { cardDereferencer } from './card-dropdown'

const CardDropdown = cardDereferencer(Select.Async)

class App extends Component {
 render() {
   return (
     <div className="App">
       <div className="App-header">
         <h2>Welcome to Apollo</h2>
       </div>
       <div>
         <CardDropdown/>
       </div>
     </div>
   );
 }
}
export default App
