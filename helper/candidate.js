// Creates a new Candidate entry with given parameters

function createCandidate(name,username,qualification,age,phone,email,password,client,res){

    let candidate=
    {
        name:name,
        username:username,
        qualification:qualification,
        age:age,
        phone:phone,
        email:email,
        password:password

    };


    client.db('JobStop')
    .collection('Candidate')
    .insertOne(candidate)
    .then((candidate)=>{
        console.log(`candidate ${name} inserted.`)
    })

    res.send(`Hello, ${name}.\n Sign Up successful!`)

}

function loginCandidate(username,password,client,res){


    client.db('JobStop')
    .collection('Candidate')
    .find({username:username,password:password})
    .toArray((err,result)=>{

        if(err) throw err;


        if(result.length){
            res.send("Login Successful.")
        }else{
            res.send("Wrong Credentials.")
        }
    })
    
}

function viewCandidates(client,res){

    client.db('JobStop')
    .collection('Candidate')
    .find({})
    .toArray((err,result)=>{
        res.send({"All Candidates":result})        
    })



}

function getCandidateDetails(id,client,callback){

    client.db('JobStop')
    .collection('Candidate')
    .find({_id:id})
    .toArray()
    .then((result)=>{
        return callback(result[0]);
    })

}

module.exports.login=loginCandidate;
module.exports.getCandidateDetails=getCandidateDetails;
module.exports.viewCandidates=viewCandidates;
module.exports.create=createCandidate;