import { Product, productSchema } from './product.model'
import { User, roles } from '../user/user.model'

import mongoose from 'mongoose'
import { AuthenticationError } from 'apollo-server'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

const product = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }
  console.log(args.id, "this is the id!!!")
  return Product
    .findByIdAndDelete(args.id)
    .lean()
    .exec();
}

const products = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }

  return Product
    .find({})
    .lean()
    .exec();
}

const updateProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== "Admin") {
    throw new AuthenticationError() 
  }

  return Product.findByIdAndUpdate(args.id, args.input, {new: true}, )
  .lean()
  .exec();
}

const removeProduct =  (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== "Admin") {
    throw new AuthenticationError()
  }

  return Product.findByIdAndDelete(args.id);
}

const newProduct =  (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new AuthenticationError()
  }
  return Product.create({...args.input, createdBy: ctx.user._id});
}


export default {
  Query: {
    product,
    products,
  },
  Mutation: {
    newProduct,
    removeProduct,
    updateProduct,
  },
  Product: {
    __resolveType(product) {
      return productsTypeMatcher[product.type];
    },
    createdBy(product) {
      return User.findById(product.createdBy).lean().exec();
    }
  }
}
