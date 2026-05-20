#!/bin/bash
# reset-chain.sh
# Reinicia la cadena desde cero con el genesis actual (necesario tras cambiar
# parámetros como el period de Parlia).
# ⚠️  DESTRUYE todos los bloques actuales. Los keystores se preservan.

set -euo pipefail

GETH="/home/omdadmin/bsc-testnode/build/bin/geth"
DATADIR="/home/omdadmin/bsc-testnode/node_data"
GENESIS="/home/omdadmin/bsc-testnode/config/genesis.json"

echo "══════════════════════════════════════════════════"
echo "  BSC Testnode — Reset de cadena"
echo "══════════════════════════════════════════════════"
echo ""
echo "  ⚠️  ADVERTENCIA: Esta operación es IRREVERSIBLE."
echo "  Se borrarán todos los bloques minados hasta ahora."
echo "  Los keystores en node_data/keystore/ se conservan."
echo ""
read -rp "  ¿Continuar? (escribe 'si' para confirmar): " confirm
echo ""

if [[ "$confirm" != "si" ]]; then
  echo "  Operación cancelada."
  exit 0
fi

echo "→ Parando bsc-node (PM2)..."
pm2 stop bsc-node 2>/dev/null || true

echo "→ Esperando que el proceso termine..."
sleep 2

echo "→ Borrando datos de la cadena (node_data/geth/)..."
rm -rf "$DATADIR/geth"

echo "→ Re-inicializando genesis..."
"$GETH" init --datadir "$DATADIR" "$GENESIS"

echo "→ Reiniciando bsc-node con PM2..."
pm2 start bsc-node

echo ""
echo "══════════════════════════════════════════════════"
echo "  ✓ Cadena reiniciada correctamente."
echo "  Period de bloque: 13 segundos"
echo ""
echo "  Próximo paso — desplegar los tokens ERC-20:"
echo "    cd /home/omdadmin/bsc-testnode/token-deployer"
echo "    npm install"
echo "    npm run deploy"
echo "══════════════════════════════════════════════════"
