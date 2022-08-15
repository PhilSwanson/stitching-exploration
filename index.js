const waitOn = require("wait-on");
const { stitchSchemas } = require("@graphql-tools/stitch");
const { introspectSchema } = require("@graphql-tools/wrap");
const makeServer = require("./lib/make_server");
const makeRemoteExecutor = require("./lib/make_remote_executor");

async function makeGatewaySchema() {
  const accountExec = makeRemoteExecutor("http://localhost:4001/graphql");
  const fundingExec = makeRemoteExecutor("http://localhost:4002/graphql");
  const cashExec = makeRemoteExecutor("http://localhost:4003/graphql");
  const cryptoExec = makeRemoteExecutor("http://localhost:4004/graphql");
  const investingExec = makeRemoteExecutor("http://localhost:4005/graphql");

  return stitchSchemas({
    subschemas: [
      {
        schema: await introspectSchema(accountExec),
        executor: accountExec,
        merge: {
          Account: {
            selectionSet: "{ id }",
            fieldName: "account",
            args: ({ id }) => ({ id }),
            canonical: true,
          },
          Query: {
            fields: {
              account: { canonical: true },
              accounts: { canonical: true },
            },
          },
        },
      },
      {
        schema: await introspectSchema(fundingExec),
        executor: fundingExec,
        merge: {
          CashAccount: {
            selectionSet: "{ id }",
            fieldName: "account",
            args: ({ id }) => ({ id }),
          },
          CryptoAccount: {
            selectionSet: "{ id }",
            fieldName: "account",
            args: ({ id }) => ({ id }),
          },
          InvestingAccount: {
            selectionSet: "{ id }",
            fieldName: "account",
            args: ({ id }) => ({ id }),
          },
        },
      },
      {
        schema: await introspectSchema(cashExec),
        executor: cashExec,
        merge: {
          CashAccount: {
            selectionSet: "{ id }",
            fieldName: "cashAccount",
            args: ({ id }) => ({ id }),
          },
        },
      },
      {
        schema: await introspectSchema(cryptoExec),
        executor: cryptoExec,
        merge: {
          CryptoAccount: {
            selectionSet: "{ id }",
            fieldName: "cryptoAccount",
            args: ({ id }) => ({ id }),
          },
        },
      },
      {
        schema: await introspectSchema(investingExec),
        executor: investingExec,
        merge: {
          InvestingAccount: {
            selectionSet: "{ id }",
            fieldName: "investingAccount",
            args: ({ id }) => ({ id }),
          },
        },
      },
    ],
  });
}

waitOn(
  {
    resources: ["tcp:4001", "tcp:4002", "tcp:4003", "tcp:4004", "tcp:4005"],
  },
  async () => {
    makeServer(await makeGatewaySchema(), "gateway", 4000);
  }
);
