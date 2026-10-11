import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class CartItemRepository{
  async add(productID, userID, quantity) {
    try {
      const db = getDB();
      const collection = db.collection("cartItems");
      const id = this.getNextCounter(db);
      const cartObj = {
        productID: new ObjectId(productID),
        userID: new ObjectId(userID),
        quantity: quantity
      }

      // await collection.insertOne(cartObj);

      await collection.updateOne({productID: new ObjectId(productID), userID: new ObjectId(productID)},
              {
                $setOnInsert: {_id : id},
                $inc: quantity
              },
              { upsert: true}
          )
      return cartObj;
    } catch (error) {
      throw new ApplicationError("Something went wrong..", error);
    }
  }

  async get(userID) {
    try {
      const db = getDB();
      const collection = db.collection("cartItems");
      return await collection.findOne({userID: new ObjectId(userID)});
    } catch (error) {
      throw new ApplicationError("Something went wrong..", error);
    }
  }

  async delete(cartItemID, userID) {
    try {
      const db = getDB();
      const collection = db.collection("cartItems");

      const result = await collection.deleteOne({userID: new ObjectId(userID), _id: new ObjectId(cartItemID)});

      return result.deleteCount > 0; 
    } catch (error) {
      throw new ApplicationError("Something went wrong..", error);
    }
  }

  async getNextCounter(db){
    const counter = await db.collection("counters").findOneAndUpdate(
      {_id: 'cartItemId'},
      {$inc: {value: 1}},
      {returnDocument: 'after'}
    )

    return counter.return.return;
  } 
}

export default CartItemRepository