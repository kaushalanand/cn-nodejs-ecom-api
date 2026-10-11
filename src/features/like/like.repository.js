import mongoose from 'mongoose';
import { likeSchema } from './like.schema.js';
import { ApplicationError } from "../../error-handler/applicationError.js";
const ObjectId = mongoose.Schema.Types.ObjectId;

const LikeModel =  mongoose.model('Like', likeSchema);

export class LikeRepository{
    async getLikes(type,id){
        return await LikeModel.find({
            likeable: new ObjectId(id),
            types: type
        }).populate('user').populate({path: 'likeble', model: type})
    }

    async likeProduct(userId, productId){
        try {
            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(productId),
                types: 'Product'
            });

            await newLike.save();
            return newLike;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong..", error);
        }
    }

    async likeCategory(userId, categoryId){
        try {
            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(categoryId),
                types: 'Category'
            });

            await newLike.save();
            return newLike;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong..", error);
        }
    }
}