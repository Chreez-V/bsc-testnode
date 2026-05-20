const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// ─── Configuración de tokens ────────────────────────────────────────────────
const TOKENS = [
  {
    name: "Wrapped BNB",
    symbol: "wBNB",
    decimals: 18,
    // Supply inicial: 1,000,000 wBNB (ya expresado en wei)
    initialSupply: hre.ethers.parseUnits("1000000", 18),
  },
  {
    name: "Wrapped OMD",
    symbol: "wOMD",
    decimals: 18,
    // Supply inicial: 1,000,000,000 wOMD
    initialSupply: hre.ethers.parseUnits("1000000000", 18),
  },
  {
    name: "Wrapped USDT",
    symbol: "wUSDT",
    decimals: 6,
    // Supply inicial: 1,000,000,000 wUSDT (6 decimales, como USDT mainnet)
    initialSupply: hre.ethers.parseUnits("1000000000", 6),
  },
];
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("─────────────────────────────────────────────────────");
  console.log("  BSC Casino Testnet — Token Deployer");
  console.log("─────────────────────────────────────────────────────");
  console.log(`  Red:       ${hre.network.name}`);
  console.log(`  Deployer:  ${deployer.address}`);
  console.log(`  Saldo:     ${hre.ethers.formatEther(balance)} tBNB`);
  console.log("─────────────────────────────────────────────────────\n");

  const SimpleERC20 = await hre.ethers.getContractFactory("SimpleERC20");
  const deployed = {};

  for (const token of TOKENS) {
    process.stdout.write(`Desplegando ${token.symbol} (${token.name})... `);

    const contract = await SimpleERC20.deploy(
      token.name,
      token.symbol,
      token.decimals,
      token.initialSupply,
      deployer.address
    );
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    deployed[token.symbol] = {
      address,
      name: token.name,
      decimals: token.decimals,
      initialSupply: token.initialSupply.toString(),
    };

    console.log(`✓  ${address}`);
  }

  console.log("\n─────────────────────────────────────────────────────");
  console.log("  Resumen de contratos desplegados");
  console.log("─────────────────────────────────────────────────────");
  for (const [symbol, info] of Object.entries(deployed)) {
    console.log(`  ${symbol.padEnd(6)}  ${info.address}`);
  }

  // Guardar addresses en archivo JSON
  const outputPath = path.join(__dirname, "..", "deployed-tokens.json");
  fs.writeFileSync(outputPath, JSON.stringify(deployed, null, 2));
  console.log(`\n  Guardado en: deployed-tokens.json`);
  console.log("─────────────────────────────────────────────────────\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
