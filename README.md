# Aurora

Aurora é uma biblioteca TypeScript para criação dinâmica de **schemas** e **tipos** para bancos de dados, com foco inicial em MongoDB, mas com arquitetura preparada para outros ORMs no futuro.  
Ela permite que você defina modelos de dados de forma fluente, **gerando automaticamente os tipos TypeScript** correspondentes e os schemas para validação e integração com ORMs.

---

## Recursos

- **Definição fluente de schemas** (string, number, boolean, date, object, array, id, union, type)
- **Geração automática de tipos TypeScript** a partir do schema
- **Validação automática dos dados** com métodos `.validate()`
- **Validações e erros personalizados** (globais e por instância)
- **Compatível com MongoDB** (outros ORMs em breve)
- **Campos opcionais**
- **Schemas aninhados e arrays tipados**
- **Zero dependências externas**

---

## Instalação

> **Nota:** Aurora ainda não está publicada no npm.  
> Para usar localmente, basta importar os arquivos no seu projeto.

---

## Exemplo Rápido

```typescript
import { Aurora, ORM } from 'aurora-lib'

const a = new Aurora(ORM.MONGO)
const userOrm = a.object({
  name: a.string(),
  age: a.number().optional(),
  job: a.object({
    name: a.string(),
    salary: a.number(),
    company: a.object({
      name: a.string(),
    }).optional()
  }),
  birthDate: a.date().optional(),
  isIncomeTaxed: a.boolean().optional(),
  employmentHistory: a.array([
    a.object({
      name: a.string(),
      salary: a.number(),
      company: a.string(),
    }),
  ])
})

// Gerando o tipo TypeScript a partir do schema:
export type UserType = ReturnType<typeof userOrm.getType>

// Exemplo de uso do tipo gerado:
const user: UserType = {
  name: 'name',
  job: {
    name: 'dev',
    salary: 5000,
    company: {
      name: 'company',
    },
  },
  birthDate: new Date(),
  isIncomeTaxed: true,
  employmentHistory: [
    {
      name: 'dev',
      salary: 5000,
      company: 'company',
    },
  ],
}
```

---

## Validação de Dados

Cada campo e schema possui o método `.validate(value)` para validar dados em tempo de execução. O método retorna `{ value, error? }`.

```typescript
const nameField = a.string().min(3)
const result = nameField.validate('Jo')
// result.error: 'the sentence "Jo" must be greater than 3 characters'
```

Você pode validar objetos inteiros:

```typescript
const userResult = userOrm.validate({ name: 'Jo' })
// userResult.error: '{"job":"Field is required", ...}'
```

---

## Validações e Erros Personalizados

Você pode customizar mensagens de erro e funções de validação globalmente ou por instância:

```typescript
Aurora.setConfig({
  custom: {
    string: {
      min: {
        error: 'Nome muito curto!'
      }
    }
  }
})

const a = new Aurora({
  custom: {
    number: {
      min: {
        error: 'Número muito pequeno!'
      }
    }
  }
})
```

Também é possível definir funções de validação customizadas:

```typescript
Aurora.setConfig({
  custom: {
    string: {
      regex: {
        validate: (str: string) => {
          if (!/^AURORA/.test(str)) throw new Error('Precisa começar com AURORA')
        },
        error: 'Precisa começar com AURORA'
      }
    }
  }
})
```

---

## Campos Opcionais

Todos os campos possuem o método `.optional()`, tornando-os opcionais no tipo e no schema:

```typescript
a.string().optional()
a.object({ ... }).optional()
a.array([ ... ]).optional()
```

---

## Campo ID Customizável

O campo `id` permite definir o tipo do ID e a referência (útil para ORMs como o Mongoose):

```typescript
a.id(String, 'User') // tipo do id e referência
```

---

## Como funciona?

1. Criação do Schema

Você instancia a classe `Aurora` passando o ORM desejado (por enquanto, apenas `ORM.MONGO`):

```typescript
const a = new Aurora(ORM.MONGO)
```

Depois, utilize os métodos para criar campos:

- `a.string()`
- `a.number()`
- `a.boolean()`
- `a.date()`
- `a.object({...})`
- `a.array([...])`
- `a.id(type, reference)`
- `a.type()`

Campos podem ser aninhados e marcados como opcionais com `.optional()`.

---

2. Gerando o Tipo TypeScript

Para obter o tipo TypeScript do seu schema, use:

```typescript
export type UserType = ReturnType<typeof userOrm.getType>
```

Assim, você garante que qualquer objeto do tipo `UserType` estará sempre sincronizado com o schema definido.

---

3. Obtendo o Schema para o ORM

Para obter o schema pronto para uso no ORM (ex: passar para o Mongoose):

```typescript
userOrm.getSchema(ORM.MONGO)
```

O resultado será um objeto com a estrutura do schema, incluindo tipos, obrigatoriedade e propriedades aninhadas.

---

## Extensibilidade e Customização

- **Validações customizadas**: Adicione funções de validação próprias para qualquer campo.
- **Mensagens de erro customizadas**: Defina mensagens globais ou por instância.
- **Schemas aninhados**: Combine objetos, arrays e tipos primitivos livremente.
- **Suporte a outros ORMs**: Arquitetura preparada para expansão.

---

## Métodos de Aurora

| Método         | Descrição                                 |
| -------------- | ----------------------------------------- |
| `string()`     | Campo string                              |
| `number()`     | Campo number                              |
| `boolean()`    | Campo boolean                             |
| `date()`       | Campo date                                |
| `object(obj)`  | Campo objeto aninhado                     |
| `array(arr)`   | Campo array de objetos ou tipos primitivos|
| `id(type, ref)`| Campo id customizável (tipo e referência) |
| `type()`       | Campo tipo genérico                       |

Todos os campos possuem o método `.optional()` para torná-los opcionais no tipo e no schema.

---

Exemplo Avançado

```typescript
const productOrm = a.object({
  title: a.string(),
  price: a.number(),
  tags: a.array([a.string()]).optional(),
  metadata: a.object({
    createdAt: a.date(),
    updatedAt: a.date().optional(),
  })
})

type ProductType = ReturnType<typeof productOrm.getType>

// Validação
const result = productOrm.validate({ title: 'A', price: 10 })
// result.error: '{"metadata":"Field is required"}'
```

---

## Roadmap

- Suporte a outros ORMs além do MongoDB
- Validações customizadas
- Erros customizaveis
- Hooks e middlewares
- Criação de Mocks dinâmicos

---

## Licença

BSD-3-Clause license