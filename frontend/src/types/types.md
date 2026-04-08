# api.types.ts / user.types.ts / subject.types.ts

## O que este arquivo faz?
Define os contratos de interface do Typescript (interfaces e enumerações) usados pelos retornos e pelas props que transitam do back ao front.

## Por que foi criado?
Estabelecer um "Type-safe Environment". Ajuda significativamente o desenvolvimento a possuir auto-completar na IDE e impede builds em caso de quebra de contrato.

## Como funciona?
Isola os contratos numa pasta para manter lógica e definição apartados. Ele é somente um recurso em escopo de transpilação.

## Exemplos de uso
```ts
import type { UserResponse } from '@/types/user.types'
```
