// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SimpleStorage", (m) => {
  const num = m.getParameter("number", 42);

  const ss = m.contract("SimpleStorage", [num]);

  return { ss };
});
