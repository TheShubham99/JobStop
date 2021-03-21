const candidate=require('./candidate')
const opening=require('./openings')


function createApplication(openingId,applicantId,client,res)
{
    
        client.db('JobStop')
        .collection('Openings')
        .find({_id:openingId})
        .toArray((err,opening)=>{
            console.log(opening[0].vacancies)
            if(opening[0].vacancies===0){
                res.send("Application Closed")
                return
            }
        })


        let application=
        {
            openingId:openingId,
            applicantId:applicantId,
            applicant:"",
            qualification:"",

        };

        candidate.getCandidateDetails(applicantId,client,(result)=>{
            application.applicant=result.name;
            application.qualification=result.qualification;


            client.db('JobStop')
            .collection('Applications')
            .insertOne(application)
            .then((application)=>{
                console.log(`Application posted.`)
            })

            
            res.send(`Hello, ${application.applicant}.\n Application Successful!`)

        })
}

function deleteApplication(applicationId,client)
{
 
    client.db('JobStop')
            .collection('Applications')
            .deleteOne({_id:applicationId})
            .then((application)=>{
                console.log(`Application Deleted.`)
            })

}

function acceptApplication(applicationId,client,res)
{

    client.db('JobStop')
    .collection('Applications')
    .find({_id:applicationId})
    .toArray((err,result)=>{
        
        if(err) throw err;

        opening.acceptApplicant(result[0].openingId,result[0].applicantId,client,res)
        deleteApplication(applicationId,client)
        
    })
}

function showMyApplications(cid,client,res){

    client.db('JobStop')
    .collection('Applications')
    .find({applicantId:cid})
    .toArray((err,result)=>{
        console.log(result)
        res.send({"My Applications":result})
    })
}

module.exports.create=createApplication
module.exports.accept=acceptApplication
module.exports.reject=deleteApplication
module.exports.myapplications=showMyApplications
