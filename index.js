const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;
require('dotenv').config()

//middleware
app.use(cors());
app.use(express.json());


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD }@cluster0.rlfbbtk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const usersCollection= client.db('the-bike-rack').collection('users');

        //get all users
        app.get('/users',async(req,res)=>{
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })

        //insert user
        app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(user);
        })
    }
    finally{

    }

}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('The Bike Rack Server')
})
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})