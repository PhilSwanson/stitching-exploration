const { makeExecutableSchema } = require("@graphql-tools/schema");
const NotFoundError = require("../../lib/not_found_error");
const readFileSync = require("../../lib/read_file_sync");
const typeDefs = readFileSync(__dirname, "schema.graphql");
const resolveTypeFromId = require("../resolve-type-from-id");

const AccountResolvers = {
  id: ({ id }) => id,
  funding: ({ id }) => ({ accountId: id }),
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Account: { __resolveType: (obj) => resolveTypeFromId(obj.id) },
    CashAccount: { ...AccountResolvers },
    InvestingAccount: { ...AccountResolvers },

    AccountFunding: {
      accountId: ({ accountId }) => accountId,
      pendingFundsTransfers: () => [],
    },

    Query: {
      account: (root, { id }) => {
        return { id };
      },
    },
  },
});
