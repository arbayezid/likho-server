require('dotenv').config()
const express = require('express')
const app = express()

const cors = require('cors')
const port = process.env.PORT || 5000



app.use(cors())
app.use(express.json())

//0JTpDUkUTEkCdj2I







const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.LIKHO_USER}:${process.env.LIKHO_PASS_CODE}@cluster0.hscvvc4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const likhoUserCollection = client.db('likho').collection('generalUser')


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.connect();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send("likho is in connection mode")
})

app.listen(port, ()=>{
    console.log(`Likho doc is going to be opened on port: ${port}`)
})

