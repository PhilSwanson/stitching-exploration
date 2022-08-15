module.exports = async (id) => {
  if (id?.includes("crypto")) {
    return "CryptoAccount";
  }

  if (id?.includes("cash")) {
    return "CashAccount";
  }

  if (id?.includes("investing")) {
    return "InvestingAccount";
  }

  return null;
};
