const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
const corsConfig = {
    origin: true,
    credentials: true,
}
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hoxpxin.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 async function run(){
   try{
    await client.connect();
    const teacherCollection = client.db("techkid").collection("teacherData");
    const studentCollection = client.db("techkid").collection("studentData");
    app.post("/teacher" , async(req , res) =>{
      const teacher = req.body      
      const result = await teacherCollection.insertOne(teacher)
      res.send(result)
    })
    app.post("/teacher/login" , async(req , res) =>{
      const teacher = req.body    
      const email = teacher.email  
      const password = teacher.password
      const storeEmail = await teacherCollection.findOne({email})
      const storePassword = await teacherCollection.findOne({password})
       if(storeEmail && storePassword){
        return res.status(200).send({message:"login successful"})
       }else{
         return res.status(500).send({message:"login unsuccessful"})
       }
    })
    app.get("/teacher" , async(req , res) =>{
      const result = await teacherCollection.find().toArray()
      res.send(result)
    })
    app.post("/student" , async(req , res) =>{
      const student = req.body      
      const result = await studentCollection.insertOne(student)
      res.send(result)
    })
    app.post("/student/login" , async(req , res) =>{
      const student = req.body    
      const email = student.email  
      const password = student.password
      const id = student.id
      const query ={
        email,
        password,
        id
      }
      const storeEmail = await studentCollection.findOne(query)      
       if(storeEmail ){
        return res.status(200).send({message:"login successful"})
       }else{
         return res.status(500).send({message:"login unsuccessful"})
       }
    })
    app.get("/totalStudent"  , async (req , res) =>{
     const result = await studentCollection.find().toArray()
     res.send(result)
    })
   }finally{

   }
 }
 run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Techkid Company')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})