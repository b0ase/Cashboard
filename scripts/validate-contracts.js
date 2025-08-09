#!/usr/bin/env node
/*
 Validates all contract example files in contracts/ against their schemas.
 - Matches files named *.example.json and tries to find corresponding *.schema.json
*/
const fs = require('fs')
const path = require('path')
const Ajv = require('ajv')

const contractsDir = path.resolve(__dirname, '..', 'contracts')

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function main() {
  if (!fs.existsSync(contractsDir)) {
    console.error(`Contracts directory not found: ${contractsDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(contractsDir)
  const exampleFiles = files.filter((f) => f.endsWith('.example.json'))

  if (exampleFiles.length === 0) {
    console.log('No example files found to validate.')
    process.exit(0)
  }

  const ajv = new Ajv({ allErrors: true, strict: false })
  let failures = 0

  for (const exampleFile of exampleFiles) {
    const schemaFile = exampleFile.replace('.example.json', '.schema.json')
    const schemaPath = path.join(contractsDir, schemaFile)
    const examplePath = path.join(contractsDir, exampleFile)

    if (!fs.existsSync(schemaPath)) {
      console.error(`Schema not found for ${exampleFile}: expected ${schemaFile}`)
      failures++
      continue
    }

    try {
      const schema = loadJson(schemaPath)
      const data = loadJson(examplePath)
      const validate = ajv.compile(schema)
      const valid = validate(data)
      if (valid) {
        console.log(`✔ ${exampleFile} is valid against ${schemaFile}`)
      } else {
        console.error(`✖ ${exampleFile} failed validation:`)
        console.error(validate.errors)
        failures++
      }
    } catch (err) {
      console.error(`Error validating ${exampleFile}:`, err.message)
      failures++
    }
  }

  if (failures > 0) {
    process.exit(1)
  } else {
    process.exit(0)
  }
}

main()


