#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

async function main() {
  const [, , inputPath, outputPath, sizeArg, scaleArg] = process.argv
  if (!inputPath || !outputPath) {
    console.error('Usage: node scripts/make-avatar.js <input> <output> [size] [circleScale 0.4-1.0]')
    process.exit(1)
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}`)
    process.exit(1)
  }

  const img = sharp(inputPath)
  const meta = await img.metadata()

  const intrinsicSize = Math.min(meta.width || 0, meta.height || 0)
  if (!intrinsicSize) {
    console.error('Could not read image dimensions')
    process.exit(1)
  }

  const targetSize = Math.max(64, Math.min(Number(sizeArg) || 512, intrinsicSize))
  const rawScale = Number(scaleArg)
  const circleScale = Number.isFinite(rawScale) ? Math.min(1, Math.max(0.4, rawScale)) : 1

  // Center-crop to square at target size
  const squareBuf = await img
    .resize(targetSize, targetSize, { fit: 'cover', position: 'center' })
    .toBuffer()

  // Build a circular mask as SVG
  const radius = (targetSize * circleScale) / 2
  const svgMask = Buffer.from(
    `<svg width="${targetSize}" height="${targetSize}" xmlns="http://www.w3.org/2000/svg">\n` +
      `<circle cx="${radius}" cy="${radius}" r="${radius}" fill="#fff"/>\n` +
    `</svg>`
  )

  // Apply mask and write PNG with alpha
  const circled = await sharp(squareBuf)
    .ensureAlpha()
    .composite([{ input: svgMask, blend: 'dest-in' }])
    .png()
    .toBuffer()

  const outDir = path.dirname(outputPath)
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  await sharp(circled).toFile(outputPath)

  console.log(`Wrote circular avatar: ${outputPath} (${targetSize}x${targetSize})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


