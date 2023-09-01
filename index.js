require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http');
const { Server } = require("socket.io");


const port = process.env.PORT || 5000
const server = http.createServer(app);

app.use(cors({
  origin: "*"
}));
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    app.put('/users/:email', async (req, res) => {
      const email = req.params.email
      const user = req.body;
      const filter = { email: email }
      const option = { upsert: true }
      const updateDoc = {
        $set: user
      }

      const result = await userCollection.updateOne(filter, updateDoc, option);
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
      const result = { user: user?.role === 'user' }
      res.send(result)
    })


  app.patch('/users/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    console.log(body,id);
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        displayName: body.displayName,
        email: body.email,
        phoneNumber: body.phoneNumber,
      },
    };
    const result = await userCollection.updateOne(filter, updatedDoc);
    res.send(result);
  });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.connect();
  }
}
run().catch(console.dir);


const io = new Server(server, {
  cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
  }
});


io.on('connection', (socket) => {
  console.log(`User Connected ${socket.id}`);

  socket.on("disconnect", () => {
      console.log("User Disconnect", socket.id)
  });

  socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
  });
});

app.get("/", (req,res) =>{
  res.send("Likho is in connection mode")
})


server.listen(port, () => {
  console.log('Likho server is running');
});


