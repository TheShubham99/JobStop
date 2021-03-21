//Candidate Helper
const candidate=require('./candidate')

// Create New Opening
function createOpening(title,org,status,vacancies,client,res){

    let opening=
    {
        title:title,
        org:org,
        status:status,
        vacancies:vacancies,
        candidates:[]

    };


    client.db('JobStop')
    .collection('Openings')
    .insertOne(opening)
    .then((opening)=>{
        console.log(`opening ${title} inserted.`)
    })
    client.close();
    res.send(`Job posting ${title}.\n is live!`)

}

//Delete Opening
function closeOpening(id,client,res){

    client.db('JobStop')
    .collection('Openings')
    .updateOne({_id:id},{$set:{status:"closed"}},(err,obj)=>{

        if(err) throw err;

        console.log("Job posting Deleted!")
        res.send(`Job Posting-${id} Deleted!`)
        
        client.close();

    })

}


function viewOpenings(client,res){

    client.db('JobStop')
    .collection('Openings')
    .find({status:'open'})
    .toArray((err,result)=>{
        res.send({"Open Postings:":result})        
    })

    client.close();
}

function viewClosedOpenings(client,res){

    client.db('JobStop')
    .collection('Openings')
    .find({status:'closed'})
    .toArray((err,result)=>{
        res.send({"Closed Postings:":result})        
    })

    client.close();
}

function getOpeningDetails(id,client,callback){

    client.db('JobStop')
    .collection('Openings')
    .find({_id:id})
    .toArray()
    .then((result)=>{
        return callback(result[0]);
    })

    client.close();

}


 function acceptApplicant(id,cid,client,res){
    
    candidate.getCandidateDetails(cid,client,(candidate)=>{
        

    client.db('JobStop')
        .collection('Openings')
        .find({_id:id})
        .toArray((err,result)=>{
            

            if(result[0].vacancies>0){

                client.db('JobStop')
                .collection('Openings')
                .updateOne({_id:id},{
                    $set:{vacancies:result[0].vacancies-1},
                    $push: { "candidates": candidate }
                })
                
                .then(()=>{
                    res.send("Candidate Added!")
                    
                    client.close();
                })
        
            }
            else{
                closeOpening(id,client,res)
                res.send("Vacency Full")
            }
        })
        
    


})
}
 

/* function acceptApplicant(id,cid,client,res){

   // console.log("ID"+id)
    
    let candidateObject={}

    candidate.getCandidateDetails(cid,client,(result)=>{
        candidateObject=result;
        console.log(result)
    
    client.db('JobStop')
    .collection('Openings')
    .updateOne({_id:id},{
         $set:{candidates: result }}
      )
    
    .then(()=>{
        closeOpening(id,client,res)
        client.close();
    })

})
} */



module.exports.viewClosedOpenings=viewClosedOpenings;
module.exports.getOpeningDetails=getOpeningDetails;
module.exports.viewOpenings=viewOpenings;
module.exports.create=createOpening;
module.exports.close=closeOpening;
module.exports.acceptApplicant=acceptApplicant;