// import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";
const { ObjectId } = mongoose.Types;

const ProductModel = mongoose.model('Product', productSchema);
const ReviewModel = mongoose.model('Review', reviewSchema);
const CategoryModel = mongoose.model('Category', categorySchema);

class ProductRepository{
  async add(product) {
    try {
        // const db = getDB();
        // const collection = db.collection("products");
        // collection.insertOne(product);
        product.category = product.category.split(',').map( e=> e.trim());
        const newProduct = new ProductModel(product);
        const savedProduct = await newProduct.save();

        await CategoryModel.updateMany(
            {_id: {$in: product.category}},
            {
                $push: {
                    product: new ObjectId(product._id)
                }
            }
        )
        return newProduct;
    } catch (error) {
        throw new ApplicationError("Something went wrong..", error);
    }
    
  }

  async get(id) {
    try {
        // const db = getDB();
        // const collection = db.collection("products");
        // const product = collection.findOne({_id: id})
        // return product;

        return await ProductModel.findOne({_id: id})
    } catch (error) {
        throw new ApplicationError("Something went wrong..", error);
    }
    
  }

  async getAll() {
    try {
        // const db = getDB();
        // const collection = db.collection("products");
        // return await collection.find().toArray();

        return await ProductModel.find()
    } catch (error) {
        throw new ApplicationError("Something went wrong..", error);
    }
    
  }

  async filter(minPrice, maxPrice, category) {
    try {
        const db = getDB();
        const collection = db.collection("products");

        const query = {};

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }

        category = JSON.parse(category.replace(/'/g, '"'));
        if (category) {
            // query.category = category;
            query.category = {$or: [{category: {$in : category}}, query]}
        }

        const result = await collection.find(query).project({name: 1, _id: 0, rating: { $slice: 1}, price: 1}).toArray();
        return result;
    } catch (error) {
        throw new ApplicationError("Something went wrong..", error);
    }
    
  }

  async rateProduct(userID, productID, rating) {
    try {
        const db = getDB();
        const collection = db.collection("products");

        // const product = await collection.findOne({_id: new ObjectId(productID)});

        // const userRating = product?.rating?.find(r => r.userID==userID);
        // if (userRating) {
        //     await collection.updateOne(
        //         { 
        //             _id: new ObjectId(productID), 
        //             "ratings.userID": userID 
        //         },
        //         { 
        //             $set: { "ratings.$.rating": rating } 
        //     })
        // }


            
        // const pushResult = await collection.updateOne(
        //     { _id: pID },
        //     { 
        //         $push: { 
        //             ratings: { userID: userID, rating: rating } 
        //         } 
        //     }
        //     );

        //     if (pushResult.matchedCount === 0) {
        //     throw new ApplicationError('Product not found', 400);
        //     }
        // }

        // await collection.updateOne({ 
        //     _id: new ObjectId(productID)
        // },
        // { 
        //     $pull: {ratings: { userID: new ObjectId(userID) }}
        // }) 
        
        // await collection.updateOne({ 
        //     _id: new ObjectId(productID)
        // },
        // { 
        //     $push: {ratings: { userID: new ObjectId(userID), rating }}
        // }) 

        const productToUpdate = await ProductModel.findById(productID);

        if(!productToUpdate){
            throw new Error("Product not found");
        }

        const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});

        if(userReview){
            userReview.rating = rating;
            await userReview.save();
        }else{
            const newReview = new ReviewModel({
                product: new ObjectId(productID),
                user: new ObjectId(userID),
                rating: rating
            });

            newReview.save();
        }
        } catch (error) {
            throw new ApplicationError("Something went wrong..", error); 
        }
    }

    async averageProductPricePerCategory(){
        try {
           const db = getDB();
           const collection = db.collection("products").aggregate([
            {
                $group: {
                    _id: "$category",
                    averagePrice: {
                        $avg: "$price"
                    }
                }
            }
           ]).toArray();  
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong..", error); 
        }
    }
}

export default ProductRepository