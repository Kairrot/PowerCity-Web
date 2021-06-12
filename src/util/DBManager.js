const { MongoClient } = require('mongodb');

const uri = 'mongodb://server:PowerCity@185.157.246.55:27017';

class DBManager {
    client
    powercity

     async init() {
        this.client = new MongoClient(uri)

        await this.client.connect();

        // DB PowerCity //
        this.powercity = this.client.db("powercity");
    }

    async findOne(collection, where) {
        return Promise.resolve(await this.powercity.collection(collection).findOne(where));
    }

    async insert(collection, object) {
        await this.powercity.collection(collection).insertOne(object);
        return Promise.resolve();
    }

    async update(collection, where, object) {
        await this.powercity.collection(collection).updateOne(where, object);
        return Promise.resolve();
    }
}

module.exports = DBManager;