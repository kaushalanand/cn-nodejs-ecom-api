import { MongoClient } from "mongodb";

const url = process.env.DB_URL;
let client;

export const connectToMongoDB= ()=>{
    MongoClient.connect(url)
        .then((clientInstance)=>{
            client = clientInstance
            console.log("Connected to Mongodb");
            createCounter(client.db());
            createIndex(client.db());
        })
        .catch(err=>{
            console.log(err);
        })
}

export const getClient = () => {
    return client;
}

export const getDB = () => {
    return client.db();
}

const createCounter = async (db) => {
    const existingCounter = await db.collection("counters").findOne({_id: 'cartItemId'});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id: 'cartItemId', value: 0});
    }
}

const createIndex = async(db) => {
    try {
       await db.collection("product").createIndex({price: 1});
       await db.collection("product").createIndex({name: 1, category: -1});
       await db.collection("product").createIndex({desc: "text"});
       console.log("Index is created"); 
    } catch (error) {
        console.log(error);
    }
}

