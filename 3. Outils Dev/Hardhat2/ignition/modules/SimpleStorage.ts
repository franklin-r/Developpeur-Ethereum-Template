// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const SimpleStorage = buildModule("SimpleStorage", (m) => {
  const number = 42;
  const favoriteNumber = m.getParameter("favoriteNumber", number);

  const ss = m.contract("SimpleStorage", [favoriteNumber]);

  return { ss };
});

export default SimpleStorage;
