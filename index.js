require('dotenv').config()
const express = require('express')
const app = express()

const cors = require('cors')
const port = process.env.PORT || 5000



app.use(cors())
app.use(express.json())




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

    const userCollection = client.db('userDB').collection('users')


    // users
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: 'Student Already Exists' })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    // admin dashboard
    app.get('/admin/:email', async (req, res) => {
      const email = req.params.email;

      // if (req.decoded.email !== email) {
      //   return res.status(401).send({ error: true, message: 'Unauthorized Acess' })
      // }

      const query = { email: email }
      const user = await userCollection.findOne(query);
      const result = { admin: user?.role === 'admin' }
      res.send(result)
    })

    // user dashboard
    app.get('/general/user/:email', async (req, res) => {
      const email = req.params.email;

      // if (req.decoded.email !== email) {
      //   return res.status(401).send({ error: true, message: 'Unauthorized Acess' })
      // }

      const query = { email: email }
      const user = await userCollection.findOne(query);
      const result = { admin: user?.role === 'user' }
      res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.connect();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("Likho is in connection mode")
})

app.listen(port, () => {
  console.log(`Likho doc is going to be opened on port: ${port}`)
})

