const express = require('express');
const app = express();
require("dotenv/config")

const mongo=require('mongodb')
const MongoClient = mongo.MongoClient;
const uri = process.env.DB_connection;
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const ObjectID = mongo.ObjectID;

//Candidate Helper
const candidate=require('./helper/candidate')

//Recruiter Helper
const recruiter=require('./helper/recruiter')



app.get('/candidate',(req,res)=>{
    res.sendFile('./views/candidate.html', {root: __dirname })
})

app.get('/recruiter',(req,res)=>{
    res.sendFile('./views/recruiter.html', {root: __dirname })
})


app.get('/candidate/new',(req,res)=>{

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
    

    const name=req.query.name;
    const username=req.query.username;
    const qualification=req.query.qualification;
    const age=req.query.age;
    const phone=req.query.phone;
    const email=req.query.email;
    const password=req.query.password;

    const objectId=new ObjectID();

    recruiter.create(objectId,name,username,qualification,age,phone,email,password,client,res)
})
})

app.get('/recruiter/new',(req,res)=>{

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
    

    const name=req.query.name;
    const username=req.query.username;
    const org=req.query.org;
    const phone=req.query.phone;
    const email=req.query.email;
    const password=req.query.password;

    const objectId=new ObjectID();

    recruiter.create(objectId,name,username,org,phone,email,password,client,res)
})
})


app.get("/candidate/login",(req,res)=>{

    const username=req.query.username;
    const password=req.query.password;


    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;

            candidate.login(username,password,client,res)
    });
})

app.get("/recruiter/login",(req,res)=>{

    const username=req.query.username;
    const password=req.query.password;


    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;

            recruiter.login(username,password,client,res)
    });
})

app.listen(3000,()=>{
    console.log("Server started")
})

/*     client.connect(()=>{
            

            // perform actions on the collection object
            console.log("DB Connected")
            
            client.db("JobStop").collection("people").find({}).toArray().then((docs)=>{
                console.log(docs);
                const name=docs[0].name;
                console.log(name)
            })
            .catch((err)=>{
                client.close()
            })
            .finally(()=>{
                client.close()
            });

    });
 */