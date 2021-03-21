const express = require('express');
const app = express();
require("dotenv/config")

const mongo=require('mongodb')
const MongoClient = mongo.MongoClient;
const uri = process.env.DB_connection;
const ObjectID = mongo.ObjectID;

//Candidate Helper
const candidate=require('./helper/candidate')

//Recruiter Helper
const recruiter=require('./helper/recruiter')

//Openings Helper
const opening=require('./helper/openings')

//Applications Helper
const application=require('./helper/applications')


//Candidate Login/Signup Test
app.get('/candidate',(req,res)=>{
    res.sendFile('./views/candidate.html', {root: __dirname })
})

//Recruiter Login/Signup Test
app.get('/recruiter',(req,res)=>{
    res.sendFile('./views/recruiter.html', {root: __dirname })
})

// Show the list of all of the open openings. (Recruiter)
app.get('/',(req,res)=>{
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;

        opening.viewOpenings(client,res)
    })
})

// Show the list of all of the closed openings. c
app.get('/closed',(req,res)=>{
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;

        opening.viewClosedOpenings(client,res)
    })
})

//Signup New Candidate.
app.get('/candidate/new',(req,res)=>
{

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>
    {
        if (err) throw err;
    

        const name=req.query.name;
        const username=req.query.username;
        const qualification=req.query.qualification;
        const age=req.query.age;
        const phone=req.query.phone;
        const email=req.query.email;
        const password=req.query.password;
        

        candidate.create(name,username,qualification,age,phone,email,password,client,res)
    })
})

app.get('/recruiter/new',(req,res)=>
{
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
    

        const name=req.query.name;
        const username=req.query.username;
        const org=req.query.org;
        const phone=req.query.phone;
        const email=req.query.email;
        const password=req.query.password;
        

        recruiter.create(name,username,org,phone,email,password,client,res)
    })
})

// Login for Candidate.
app.get("/candidate/login",(req,res)=>{

    const username=req.query.username;
    const password=req.query.password;


    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;

            candidate.login(username,password,client,res)
    });
})

// Login for Recruiter.
app.get("/recruiter/login",(req,res)=>{

    const username=req.query.username;
    const password=req.query.password;


    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;

            recruiter.login(username,password,client,res)
    });
})

//View All Candidates. (Recruiter)
app.get("/recruiter/viewcandidates",(req,res)=>{

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
        candidate.viewCandidates(client,res)
    });
})

//Post a new Opening. (Recruiter)
app.get('/recruiter/opening/new',(req,res)=>{

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
    
        const title=req.query.title;
        const org=req.query.org;
        const status=req.query.status;
    
        opening.create(title,org,status,client,res)

    })
})

// Apply for an opening. (Candidate)
app.get('/opening/:id/apply/:cid',(req,res)=>{

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;

        const openingId=ObjectID(req.params.id);
        const applicantId=ObjectID(req.params.cid);

        application.create(openingId,applicantId,client,res)

    })
})

//Close an opening. (Recruiter)
app.get('/recruiter/opening/:id/close',(req,res)=>{

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
    
        const OpeningId=ObjectID(req.query.id);
    
        opening.close(OpeningId,client,res)

    })
})

// Show Details of a Particular Job Opening (Recruiter/Candidate)
app.get('/recruiter/opening/:id',(req,res)=>{

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
    
        const OpeningId=ObjectID(req.params.id);
    
        opening.getOpeningDetails(OpeningId,client,(result)=>{

            res.send({"Opening Details":result})

        })

    })
})

// Show Details of Applicants of a Particular Job Opening (Recruiter)
app.get('/recruiter/opening/:id/candidates',(req,res)=>{

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
    
        const OpeningId=ObjectID(req.params.id);
    
        opening.getOpeningDetails(OpeningId,client,(result)=>{

            res.send({"Opening Name":result.title,"Organization":result.org,"Candidates Applied": result.candidates})

        })

    })
})


// Accept Applicant to a opening (Recruiter)
app.get('/recruiter/applications/accept/:aid',(req,res)=>{

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
    
        const applicationId=ObjectID(req.params.aid)
       application.accept(applicationId,client,res);

    })
})

// Reject Applicant to a opening (Recruiter)
app.get('/recruiter/applications/reject/:aids',(req,res)=>{

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
    
        const applicationId=ObjectID(req.params.aid)
       application.reject(applicationId,client);

    })
})

// Show candidate's Applications.
app.get('/candidate/myapplications/:cid',(req,res)=>{
    
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
    
       const applicantId=ObjectID(req.params.cid)
       application.myapplications(applicantId,client,res)

    })
})

// Delete an Applications.
app.get('/candidate/myapplications/:aid/delete',(req,res)=>{
    
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client)=>{
        if (err) throw err;
    
       const applicantId=ObjectID(req.params.aid)
       application.reject(aid,client)

    })
})

app.listen(3000,()=>{
    console.log("Server started")
})
