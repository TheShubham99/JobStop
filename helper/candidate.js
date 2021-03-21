function createCandidate(id,name,username,qualification,age,phone,email,password,client,res){

    let candidate=
    {
        _id:id,
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

module.exports.login=loginCandidate;
module.exports.create=createCandidate;