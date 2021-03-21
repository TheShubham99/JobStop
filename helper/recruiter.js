function createRecruiter(id,name,username,org,phone,email,password,client,res){

    let recruiter=
    {
        _id:id,
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

module.exports.login=loginRecruiter;
module.exports.create=createRecruiter;