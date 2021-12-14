const { MongoClient } = require('mongodb');
var constants = {}
try {
    constants = require('../config/constants')
} catch (error) {
    console.log("Module 'constants' not found, trying Heroku config vars.")
}
const mongo_url = process.env.MONGO_URL || constants.mongo_url;
var useDb = false;
var client;
if (mongo_url) {
    client = new MongoClient(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
    useDb = true;
}

// write a single object to a collection
exports.logOne = async function (dbName, collectionName, data) {
    if (!useDb) return;
    try {
        await client.connect();
        //console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.insertOne(data);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

// write an array of objects to a collection
exports.logMany = async function (dbName, collectionName, data) {
    if (!useDb) return;
    try {
        await client.connect();
        //console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.insertMany(data);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}


exports.query = async function (dbName, collectionName, query = {}, callback) {

    var result = null;
    var success = false;

    if (!useDb) {
        callback(false, "DB not initialised");
        return;
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        for (let prop in query) {
            query[prop] = new RegExp(query[prop]);
        }
        result = await collection.find(query).toArray();
        if (result.length === 0) {
            result = "no results";
        }
        success = true;
    } catch (error) {
        console.log(error);
        result = error;
    } finally {
        client.close();
        callback(success, result);
    }
}