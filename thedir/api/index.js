const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
})

const users = [
    {id: 1, username: 'diva', email:'divaputriarya01@gmail.com', password: 'div123456'}
];


app.get('/api/users', (req, res) => {
    //log time
    var datetime = new Date();
    console.log("\n" + datetime);
    console.log('User data has been retrieved');
    return res.json(users);

});

app.get('/api/users/:username/:password', (req, res) => {
    //log time
    var datetime = new Date();
    console.log("\n" + datetime);
    console.log("Incoming new GET HTTP request for LOGIN");
    console.log(req.params);

    // validate
    /* const {error} = validateUser(req.params);
    if (error) {
        console.log('Validation error');
        
        var jsonRespond = {
            resut: "",
            message: error.detail[0].message
        }
        return res.status(400).json(jsonRespond)
    }
    console.log('Validation success'); */

    //check if username and password coreect
    console.log('Check existing username : ' + req.params.username + ' and password : ' + req.params.password);
    const check_user = users.find( u => u.username === req.params.username && u.password === req.params.password);
    if (!check_user){
        var error_message = 'Incorrect username or password is not corret';
        console.log(error_message);

        var jsonRespond = {
            result: "",
            message: error_message
        }
        return res.status(400).json(jsonRespond);
    }

    var jsonRespond = {
        result: users,
        message: "Login success"
    }
    return res.status(200).json(jsonRespond);
});

//Registration
app.post('/api/users', (req, res) => {
    //log time 
    var datetime = new Date();
    console.log("\n" + datetime);
    console.log("Incoming new GET HTTP request");
    console.log(req.body);

    // validate
    const {error} = validateUser(req.body);
    if (error) {
        console.log('Validation error');
        
        var jsonRespond = {
            resut: "",
            message: error.detail[0].message
        }
        return res.status(400).json(jsonRespond)
    }
    console.log('Validation success');

    //check if username already exists
    console.log('Check existing username : ' + req.body.username + ' , email : ' + req.body.email);
    const check_user = users.find( u => u.username === req.body.username && u.email === req.body.email);
    if (check_user){
        console.log('Username : ' + req.body.username + ' and Email ' + req.body.email + ' is already registered.');
        
        var jsonRespond = {
            result: "", 
            message: "Registration failed. Username : " + req.body.username + " and Email " + req.body.email +  "is already registered. Please use other username or email."
        }
        return res.status(404).json(jsonRespond);
    }
    
    console.log('Username : ' + req.body.username + ' and Email ' + req.body.email + ' is available');
    const user = {
        id: users.length + 1,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    user.push(user);
    return res.json(user); 
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

function validateUser(user){
    const schema = Joi.object({
        username: Joi.string().min(3),
        email: Joi.string().email({ minDomainAtoms: 2, tlds: { allow: ['com', 'net']}}),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });
    return schema.validate(user);
}