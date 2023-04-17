const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri = `mongodb+srv://admin:${process.env.PASS}@cluster0.lry4qqt.mongodb.net/?retryWrites=true&w=majority`;
const uri =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let _db;

const connectDB = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    _db = await client.db("shop");
  } catch (err) {
    console.error(err);
  }
};

const getDB = () => {
  if (_db) return _db;
  throw new Error("No database found!");
};

module.exports = { connectDB, getDB };
