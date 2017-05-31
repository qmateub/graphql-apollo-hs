import React from 'react'
import PropTypes from 'prop-types'
import { propType } from 'graphql-anywhere'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { compose } from 'recompose'
import Select from 'react-select'

/**
 * Wrapper component responsible for retrieving categories from the API through
 * GraphQL query and also in charge of parsing the results to the component in
 * its correct format
 */
export const createCardDereferencer = (Component) => {
  class CardDereferencer extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
      };
    }
    /**
     * We need to trigger this query manually to show the user what results
     * are retrieved from the API based on its input text
     */
    searchCards = searchText =>
      this.props.client.query({
        query: gql`
          query searchCard($name: String!) {
            cards: searchCard(name: $name) {
              cardId
              name
              img
            }
          }
        `,
        variables: { name: searchText },
      }).then(res => res.data.cards)

    mapItemToOption = (card) => {
      return {
        value: card.cardId,
        label: card.name,
        img: card.img,
      }
    }
    handleLoadItems = (value) => {
      this.setState({ isLoading: true })

      return Promise.resolve(this.searchCards(value))
        .then((items) => {
          this.setState({ isLoading: false })
          console.log(items)
          return ({ options: items.map(item => this.mapItemToOption(item)) })
        })
    }

    mapValueToItem = value =>
      this.props.client.readFragment({
        fragment: CardDereferencer.fragments.cardSearchFragment,
        id: value,
      })
    handleChange = (card) => {
      console.log(card)
    }
    renderItem = card =>
    (
      <div>
        <img
          src={card.img}
          alt={"HTML5 Icon"}
          style={{width: 40, height: 51.6}}
        />
        <strong>
          {card.label}
        </strong>
      </div>
    )
    render () {
      const value = this.props.data && !this.props.data.loading
        ? this.props.data.cards
        : this.props.value

      return (
        <Component
          multi={true}
          onChange={this.handleChange}
          loadOptions={this.handleLoadItems}
          isLoading={this.state.isLoading}
          arrowRenderer={() => null} // stop arrow from rendering
          // NOTE: this is kind of a workaround to allow umlauts.
          // react-select should support this by default.
          // https://github.com/JedWatson/react-select/pull/359
          ignoreAccents={false}
          optionRenderer={this.renderItem}
          valueRenderer={item => console.log(item)}
        />
      )
    }
  }

  // CardDereferencer.fragments = {}
  // CardDereferencer.fragments.cardSearchFragment = gql`
  //   fragment CardSearchFragment on CardSearch {
  //     cardId
  //     name
  //   }
  // `
  // CardDereferencer.fragments.searchResults = gql`
  //   fragment CardSearchResulsFragment on CardSearchResult {
  //     ...CardSearchFragment
  //   }
  //   ${CardDereferencer.fragments.cardSearchFragment}
  // `

  CardDereferencer.propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      // cards: propType(
      //   CardDereferencer.fragments.searchResults
      // ),
    }),
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
      readFragment: PropTypes.func.isRequired,
    }).isRequired,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
  }

  CardDereferencer.displayName =
    `CardDereferencer(${Component.displayName})`

  return CardDereferencer
}

export const cardDereferencer = (Component) => {
  const CardDereferencer = createCardDereferencer(Component)

  const FetchCardDereference = gql`
    query searchCard($name: String!) {
      cards: searchCard(name: $name) {
        cardId
        name
        img
      }
    }
  `
  return compose(
    withApollo,
    graphql(
      FetchCardDereference,
      {
        options: (ownProps) => {
          return {
            variables: {
              name: ownProps.value,
            },
          }
        },
        /**
         * This part prevents the component to trigger the search query if
         * has no category selected or has all the categories fetched and stored
         * in the cache from previous queries
         */
        skip: ownProps => !ownProps.value
      }
    )
  )(CardDereferencer)
}
