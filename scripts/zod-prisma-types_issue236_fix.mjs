// This is a temporary fix to https://github.com/chrishoermann/zod-prisma-types/issues/236
import { readFileSync, writeFileSync } from 'node:fs'

const GENERATED_FILE_PATH = 'src/generated/prisma/zod/index.ts'

const regexes = [
  /(export const [^:]+): (z\.ZodType<Prisma\.[^>]+>)( [^;]+);/gm,
  /(export const [^:]+): (z\.ZodType<Omit<Prisma\.[^>]+>>)( [^;]+);/gm,
]
const subst = `$1$3 satisfies $2;`

function FixPrismaTypes() {
  try {
    const content = readFileSync(GENERATED_FILE_PATH, 'utf8')
    const updatedContent = content.replace(regexes[0], subst).replace(regexes[1], subst)
    writeFileSync(GENERATED_FILE_PATH, updatedContent)
    console.log('\u001b[92m✔\u001b[0m Prisma postprocess complete')
  } catch (error) {
    console.error(
      '\u001b[91m✘\u001b[0m Prisma postpD:\Projects\tw.edu.ndhu.ai\nest-project\src\generated\prisma\zod\index.tsrocess failed:',
      error,
    )
    process.exit(1)
  }
}

FixPrismaTypes()
