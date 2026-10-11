import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const userSchema = new Schema({
    name: String,
    email: {type: String, match: [/.+\@.+\../, 'Please enter a valid email.'], unique: true},
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)},
                message: "Password should be between 8-12 characters and have a special character"
            }
    },
    type: {type: String, enum: ["Customer", "Seller"]}
});