# dev-cli.ps1
param (
  [string]$Command = "next",
  [string[]]$Flags
)

Write-Host "Ensuring dev dependencies are installed..."
npm install -D ts-node ts-node-esm typescript @types/node > $null

Write-Host "Running ctgen CLI in dev mode using ts-node-esm..."
node --loader ts-node/esm bin/ctgen.ts $Command $Flags
