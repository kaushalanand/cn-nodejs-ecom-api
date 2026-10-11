import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";
import { getClient } from "../../config/mongodb.js";

export default class OrderRepository{
    constructor(){
        this.collection = "orders";
    }

    async placeOrder(userId){
        const client = getClient();
        const session = client.startSession();

        try {
            // Get cartItem and calculate total amount.
            session.startTransaction();
            const db = getDB();
            const items = await this.getTotalAmount(userId, session);
            const finalTotalAmount = items.reduce((acc,item) => acc+item.totalAmount, 0);

            //Create an order record.
            const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date());
            db.collection(this.collection).insertOne(newOrder, {session});

            //Reduce the stock.
            for(let item of items){
                await db.collection("products").updateOne(
                    {_id: item.productID},
                    {$inc: {stock: -item.quantity}},
                    {session}
                ) 
            }

            //Clear the cart items.
            await db.collection("cartItems").deleteMany({
                userID: new ObjectId(userId)
            }, {session})

            session.commitTransaction();
            session.endSession();
            return;
        } catch (error) {
            await session.abortTransation();
            session.endSession();
            console.log(error);
            throw new ApplicationError("Something went wrong..", error);
        }
        
    }

    async getTotalAmount(userId, session){
        const db = getDB();

        const items = await db.collection("cartItems").aggregate([
            {
                $match: {userId: new ObjectId(userId)}
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productID",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            {
                $unwind: "$productInfo"
            },
            {
                $addFields: {
                    "totalAmount": {
                        $multiply: ["$productInfo.price", "$quantity"]
                    }
                }
            }
        ], {session}).toArray();

        return items;
    }
}