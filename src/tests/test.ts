import { Aurora } from "../lib/aurora"
import { ORM } from "../types"

const a = new Aurora()
const userOrm = a.object({
  name: a.string().min(3),
  age: a.number().optional(),
  job: a.object({
    name: a.string(),
    salary: a.number(),
    company: a.object({
      name: a.string(),
    }).optional(),
  }),
  birthDate: a.date().optional(),
  deathDate: a.type().union([a.date(), a.string()]),
  isIncomeTaxed: a.boolean().optional(),
  // TODO: see if this use case is necessary
  // tags: a.array([a.string(), a.number()]).optional(),
  employmentHistory: a.array([
    a.object({
      name: a.string(),
      salary: a.number(),
      company: a.string(),
    }),
  ]),
})

export type UserType = ReturnType<typeof userOrm.getType>

export const user: UserType = {
  name: 'ale',
  job: {
    name: 'dev',
    salary: 5000,
    company: {
      name: 'company',
    },
  },
  birthDate: new Date(),
  deathDate: true ? '3000-07-01' : new Date(),
  isIncomeTaxed: true,
  employmentHistory: [
    {
      name: 'dev',
      salary: 5000,
      company: 'company',
    },
    {
      name: 'po',
      salary: 5000,
      company: 'company',
    },
  ],
  // tags: ['tag1', 123],
}

console.log(userOrm.getSchema(ORM.MONGO))

// Teste de validação com objeto válido
try {
  const result = userOrm.validate(user)
  console.log('Validação bem-sucedida:', result)
} catch (e) {
  console.error('Erro de validação (válido):', e)
}

// Teste de validação com array inválido (campo faltando e tipo errado)
const userInvalido = {
  ...user,
  employmentHistory: [
    {
      name: 'dev',
      salary: 'não é número', // tipo errado
      // company: 'company', // campo faltando
    },
  ],
}

try {
  const result = userOrm.validate(userInvalido)
  console.log('Validação inesperadamente bem-sucedida:', result)
} catch (e) {
  console.error('Erro de validação (inválido):', e)
}

Aurora.setConfig({
  custom: {
    string: {
      min: { error: new Error('test error global') }
    }
  }
})

const b = new Aurora({
  custom: {
    string: {
      min: {
        error: new Error('test error instance'),
        // validate: (any: any) => { throw new Error('validate function instance') }
      }
    }
  }
})

const test = b.object({
  name: b.string().min(3),
  age: b.number(),
})

export type People = ReturnType<typeof test2.getType>
const people: People = {
  name: 'al',
  age: 21
}

test.validate(people)

// o erro da instancia ta funcionando, só q ao fazer o pick
// ele está pegando os erros da instancia original, não da nova
const c = new Aurora({
  custom: {
    string: {
      min: { error: new Error('test error instance') }
    }
  }
})

const test2 = c.type().pick(test, ['name', 'age'])

export type Person = ReturnType<typeof test2.getType>
const person: Person = {
  name: 'al',
  age: 21
}

// test2.validate(person)

// ver questão do ObjectId no schema
// ver formas de metrificar os ganhos da ferramenta
// ver como é q fica a questão do extended reference
