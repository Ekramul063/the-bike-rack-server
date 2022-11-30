const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const categoryCollection= client.db('the-bike-rack').collection('categories');
        const productCollection= client.db('the-bike-rack').collection('products');

        //get all users
        app.get('/users',async(req,res)=>{
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })
        //get single user
        app.get('/users/:email',async(req,res)=>{
            const email = req.params.email;
            const query ={email:email};
            const user = await usersCollection.findOne(query);
            res.send(user);
        })

        //insert user
        app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(user);
        })
        //all category
        app.get('/categories',async(req,res)=>{
            const query = {};
            const categories = await categoryCollection.find(query).toArray();
            res.send(categories);

        })
       // get single category
        app.get('/categories/:name',async(req,res)=>{
            const brandName = req.params.name;
            const query ={categoryName: brandName};
            const category = await categoryCollection.findOne(query);
            res.send(category);
        })
        //get all product
        app.get('/products',async(req,res)=>{
            const query ={};
            const products = await productCollection.find(query).toArray();
            res.send(products);
        })
        //get category product
        app.get('/products/:categoryName',async(req,res)=>{
            const category = req.params.categoryName;
            const query = {categoryName:category};
            const categoryProducts =  await productCollection.find(query).toArray();
            res.send(categoryProducts);
        })
        //insert a product
        app.post('/products',async(req,res)=>{
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result)
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