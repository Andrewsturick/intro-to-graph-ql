import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'


const types = ['product', 'coupon', 'user']

export const start = async () => {
  const rootSchema = `
    interface Animal {
      species: String
      age: Int
    }
    
    type Gorilla implements Animal {
      species: String
      age: Int
      sex: String
    }

    type Crocodile implements Animal {
      species: String
      age: Int
      teeth: Int!
    }

    type Moose implements Animal {
      species: String
      age: Int
      antlers: Int
    }

    type Cat {
      name: String!
      owner: Owner,
      age: Int
    }

    type Owner {
      name: String!
      cat: Cat
      age: Int
    }

    extend type Query {
      animals(len: Int) : [Animal]
      cat(name: String) : Cat
      owner(name: String) : Owner
    }

    extend type Mutation {
      car(name: String): String
    }

    schema {
      query: Query
      mutation: Mutation
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema, ...schemaTypes],
    resolvers: merge({
      Query: {
        animals(_, args) {
            return [{species: 'Moose'}, {species: 'Gorilla'}, {species: "Crocodile", teeth: 12}].slice(0, args.len * 2);
        }
      },
      Mutation: {
        
      },
      Animal: {
        __resolveType(animal) {
          return animal.species;
        }
      }
    }, product, coupon, user),
    context({ req }) {
      // use the authenticate function from utils to auth req, its Async!
      return { user: null }
    }
  })

  await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}
