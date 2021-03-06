function createRecruiter(name,username,org,phone,email,password,client,res){

    let recruiter=
    {

        name:name,
        username:username,
        org:org,
        phone:phone,
        email:email,
        password:password

    };


    client.db('JobStop')
    .collection('Recruiter')
    .insertOne(recruiter)
    .then((recruiter)=>{
        console.log(`recruiter ${name} inserted.`)
    })

    res.send(`Hello, ${name}.\n Sign Up successful!`)

}

function loginRecruiter(username,password,client,res){


    client.db('JobStop')
    .collection('Recruiter')
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

function showAllRecruiters(client,res){

    client.db('JobStop')
    .collection('Recruiter')
    .find({})
    .toArray((err,result)=>{
        res.send({"All Recruiters: ":result})
    })
    
}

module.exports.login=loginRecruiter;
module.exports.create=createRecruiter;
module.exports.showAllRecruiters=showAllRecruiters