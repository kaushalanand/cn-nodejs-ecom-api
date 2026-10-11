import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const productSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    inStock: Number,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'   
        }
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'   
        }
    ]
})