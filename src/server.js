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
  type Cat {
    name: String
  }

  type Dog {
    name: String,
    age: Int!,
    bark: String!
  }

  type Query {
    myCat: Cat!
    myDog: Dog!
    hello: String
  }

  input NewCatInput {
    name: String
  }

  input NewDogInput {
    name: String
    age: Int
  }


  type Mutation {
    newCat(newCatInput: NewCatInput!, num: Int) : Cat
    newDog(newDogInput: NewDogInput!, num: Int) : Dog
  }
  
  schema {
      query: Query
      mutation: Mutation
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: {
      Mutation: {
      },
      Query: {
        myCat() {
          return {name: "garfield"};
        },
        myDog() {
          return {name: "murph", age: 12, bark: "woof!", feet: 4};
        },
        hello() {
          return "hi";
        }
      },
    },  context({ req }) {
      // use the authenticate function from utils to auth req, its Async!
      return { user: null }
    }
  })

  await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}
