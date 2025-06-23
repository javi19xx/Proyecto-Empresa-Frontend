import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import VueApollo from 'vue-apollo';

/* const httpLink = createHttpLink({
  uri: 'http://localhost:1Version337/graphql', 
});
 */
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});
