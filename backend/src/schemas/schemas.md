# review.schema.ts / kanban.schema.ts / note.schema.ts

## O que este arquivo faz?
Esses arquivos usam a biblioteca `zod` para construir os contêineres e validadores sintáticos (e de tipos abstratos) utilizados pela API no momento da entrada (req.body, req.query, req.params).

## Por que foi criado?
Prevenir falhas em cascata de dados inválidos rumo à ORM (Prisma/Banco). Zod converte JSONs caóticos em DTO (Data Transfer Objects) tipados de runtime.

## Como funciona?
Obedecem uma gramática fluida `.object().shape()`. Mapeiam, injetam enums estritos e estipulam exigências e opcionais. Também inferem os tipos com `z.infer`.

## Exemplos de uso
```ts
// Em um roteador ou middleware
const validData = noteSchema.parse(request.body)
```
