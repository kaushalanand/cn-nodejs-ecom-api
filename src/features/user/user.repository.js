// import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from 'mongoose';
import { userSchema } from "./user.schema.js";

const UserModel = mongoose.model('Users', userSchema);


class UserRepository{
    async signUp(newUser) {
        try {
          // const db = getDB();
          // const collection = db.collection("users");
          // await collection.insertOne(newUser);

          const newUser = new UserModel(newUser);
          await await newUser.save();
          return newUser;
    } catch (error) {
        throw new ApplicationError("Something went wrong..", error);
    }
  }

  async findByEmail(email) {
    try {
      // const db = getDB();
      // const collection = db.collection("users");
      // return await collection.findOne({email});

      return await UserModel.findOne({email, password});
    } catch (error) {
      if(error instanceof mongoose.Error.ValidationError){
        throw error;
      }else{
        throw new ApplicationError("Something went wrong..", error);
      }
    }
  }

  async getAll() {
    try {
      // const db = getDB();
      // const collection = db.collection("users");
      // return collection.find();

      const result = await UserModel.finOne({email});
      return result
    } catch (error) {
      if(error instanceof mongoose.Error.ValidationError){
        throw error;
      }else{
        throw new ApplicationError("Something went wrong..", error);
      }
    }
  }

  async resetPassword(userID, newPassword){
    try {
      let user = await UserModel.findById(userID);

      if(!user){
        throw new Error("User not found!");
      }

      user.password = newPassword;
      user.save();
    } catch (error) {
      if(error instanceof mongoose.Error.ValidationError){
        throw error;
      }else{
        throw new ApplicationError("Something went wrong..", error);
      }
    }
    
  }
}

export default UserRepository