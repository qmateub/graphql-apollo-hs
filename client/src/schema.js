export const typeDefs = `
	type Card {
		cardId: String
		name: String
    img: String
	}
  type Query {
    hello: String
		cards: [Card!]
		searchCard(name: String!): [Card!]
  }
`;
