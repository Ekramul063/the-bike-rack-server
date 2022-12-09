const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
require('dotenv').config()

//middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).send({ message: 'unauthorize access' })
    }
    const token = authHeader.split(' ')[1]; //broken by space

    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rlfbbtk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const usersCollection = client.db('the-bike-rack').collection('users');
        const categoryCollection = client.db('the-bike-rack').collection('categories');
        const productCollection = client.db('the-bike-rack').collection('products');
        const bookingCollection = client.db('the-bike-rack').collection('bookings');

         //jwt token
         app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '12h' });
                return res.send({ accessToken: token })
            }
            res.status(403).send({ 'access-token': '' })
        })

        //get all users
        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })
        //get all seller
        app.get('/users/seller', async(req, res) => {
            const query = {seller:true};
            const seller = await usersCollection.find(query).toArray();
            res.send(seller);
        })
        //get single user
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.send(user);
        })
        //get admin
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            console.log(email);
            const user = await usersCollection.findOne(query);
            res.send({isAdmin: user?.role ==='admin'});
        })

        //insert user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        
        //delete seller
        app.delete('/users/seller/:id',verifyJWT,async(req,res)=>{
            const decodedEmail = req.decoded.email;
            console.log('decodedEmail delete',decodedEmail)
            const query = {email:decodedEmail};
            const user = await usersCollection.findOne(query);
            if(user.role !== 'admin'){
                return res.status(403).send('Forbidden access')
            }
            const id = req.params.id;
            const filter = {_id:ObjectId(id)};
            const result = await usersCollection.deleteOne(filter);
            res.send(result)
        })
           

        // make admin
        app.put('/users/seller/:id',verifyJWT,async(req,res)=>{
            const decodedEmail = req.decoded.email;
            
           const query={email:decodedEmail};
           const user = await usersCollection.findOne(query);
           if(user.role !== 'admin'){
            return res.status(403).send('forbidden access');
           }
            const id = req.params.id;
            const filter = {_id:ObjectId(id)};
            const options = { upsert: true };
            const updateDoc ={
                $set:{
                    role:'admin'
                }
            }
            const result = await usersCollection.updateOne(filter,updateDoc,options);
            res.send(result)
        })

        //all category
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoryCollection.find(query).toArray();
            res.send(categories);

        })
       
        // get single category
        app.get('/categories/:name', async (req, res) => {
            const brandName = req.params.name;
            const query = { categoryName: brandName };
            const category = await categoryCollection.findOne(query);
            res.send(category);
        })
        //get all product
        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productCollection.find(query).toArray();
            res.send(products);
        })
        //get category product
        app.get('/products/:categoryName', async (req, res) => {
            const category = req.params.categoryName;
            const query = { categoryName: category };
            const categoryProducts = await productCollection.find(query).toArray();
            res.send(categoryProducts);
        })
        //insert a product
        app.post('/products',async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result)
        })
        //booking product
        app.get('/bookings', async (req, res) => {
            const query = {};
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })
        //insert booking
        app.post('/bookings', async (req, res) => {
            const bookingProduct = req.body;
            const result = await bookingCollection.insertOne(bookingProduct);
            res.send(result);
        })
        //single booking
        app.get('/bookings/:email',verifyJWT,async (req, res) => {
            const email = req.params.email;
            const decodedEmail = req.decoded.email;
            // console.log('decoded email',decodedEmail);
            // console.log('original email', email)
           if(email !== decodedEmail){
            return res.status(403).send({message:'forbidden access'})
           }
            const query = { buyer: email };
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })

    }
    finally {

    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('The Bike Rack Server')
})
app.listen(port, () => {
    console.log(`server is running on ${port}`)
})