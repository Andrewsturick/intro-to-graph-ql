import { Product, productSchema } from './product.model'
import { User, roles } from '../user/user.model'

import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

const product = (_, args, ctx) => {
  if (!ctx.user) {
    
  }
  console.log(args.id, "this is the id!!!")
  return Product
    .findByIdAndDelete(args.id)
    .lean()
    .exec();
}

const products = (_, args, ctx) => {
  if (!ctx.user) {
    
  }

  return Product
    .find({})
    .lean()
    .exec();
}

const updateProduct = (_, args, ctx) => {
  if (!ctx.user) {
    
  }

  return Product.findByIdAndUpdate(args.id, args.input, {new: true}, )
  .lean()
  .exec();
}

const removeProduct =  (_, args, ctx) => {
  if (!ctx.user) {
    
  }

  return Product.findByIdAndDelete(args.id);
}

const newProduct =  (_, args, ctx) => {
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
