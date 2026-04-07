import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

describe('Tailwind CSS v4 Configuration', () => {
  const frontendRoot = resolve(__dirname, '../..')
  const indexCssPath = resolve(frontendRoot, 'src/index.css')
  const tailwindConfigPath = resolve(frontendRoot, 'tailwind.config.ts')
  const tailwindConfigJsPath = resolve(frontendRoot, 'tailwind.config.js')

  describe('index.css @theme block', () => {
    it('deve existir o arquivo index.css', () => {
      expect(existsSync(indexCssPath)).toBe(true)
    })

    it('deve importar o tailwindcss corretamente', () => {
      const content = readFileSync(indexCssPath, 'utf-8')
      expect(content).toContain('@import "tailwindcss"')
    })

    it('deve ter um bloco @theme definido', () => {
      const content = readFileSync(indexCssPath, 'utf-8')
      expect(content).toMatch(/@theme\s*\{/)
    })

    it('deve definir cores primary no @theme', () => {
      const content = readFileSync(indexCssPath, 'utf-8')
      expect(content).toContain('--color-primary-500')
    })

    it('deve definir cores secondary no @theme', () => {
      const content = readFileSync(indexCssPath, 'utf-8')
      expect(content).toContain('--color-secondary-500')
    })

    it('deve definir font-family sans no @theme', () => {
      const content = readFileSync(indexCssPath, 'utf-8')
      expect(content).toContain('--font-family-sans')
    })
  })

  describe('compatibilidade v4', () => {
    it('NÃO deve ter tailwind.config.ts (obsoleto no v4)', () => {
      expect(existsSync(tailwindConfigPath)).toBe(false)
    })

    it('NÃO deve ter tailwind.config.js (obsoleto no v4)', () => {
      expect(existsSync(tailwindConfigJsPath)).toBe(false)
    })
  })

  describe('classes utilitárias customizadas nos componentes', () => {
    it('Input.tsx deve usar focus:ring-primary-500 (classe válida no v4)', () => {
      const inputPath = resolve(frontendRoot, 'src/components/ui/Input.tsx')
      if (!existsSync(inputPath)) return
      const content = readFileSync(inputPath, 'utf-8')
      expect(content).toContain('focus:ring-primary-500')
    })

    it('Button.tsx deve usar focus:ring-primary-500 (classe válida no v4)', () => {
      const buttonPath = resolve(frontendRoot, 'src/components/ui/Button.tsx')
      if (!existsSync(buttonPath)) return
      const content = readFileSync(buttonPath, 'utf-8')
      expect(content).toContain('focus:ring-primary-500')
    })
  })
})
