const { makeExecutableSchema } = require("@graphql-tools/schema");
const NotFoundError = require("../../lib/not_found_error");
const readFileSync = require("../../lib/read_file_sync");
const typeDefs = readFileSync(__dirname, "schema.graphql");

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers: {
    InvestingAccount: {
      id: ({ id }) => id,
      investing: () => true,
    },
    Query: {
      investingAccount: (root, { id }) => {
        return { id };
      },
    },
  },
});
