import { ethers } from "hardhat";

async function main() {
  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  
  // Aguarda o deploy ser concluído (ethers v5)
  await counter.deployed();
  
  console.log("Counter deployado em:", counter.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});