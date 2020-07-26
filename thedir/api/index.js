const Joi = require('joi');
const express = require('express');
const { json } = require('express');
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
    const {error} = validateUser(req.params);
    if (error) {
        console.log('Validation error');
        
        var jsonRespond = {
            resut: "",
            message: error.detail[0].message
        }
        return res.status(400).json(jsonRespond)
    }
    console.log('Validation success and accepted');

    //check if username and password coreect
    console.log('Check existing username : ' + req.params.username + ' and password : ' + req.params.password);
    const check_user = users.find( u => u.username === req.params.username && u.password === req.params.password);
    if (!check_user){
        var error_message = 'Incorrect username or password';
        console.log(error_message);

        var jsonRespond = {
            result: "",
            message: error_message
        }
        return res.status(400).json(jsonRespond);
    }

    console.log('Username ' + req.params.username + ' sucessfully login.');
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

    users.push(user);
    return res.json(user); 
});


const listing = [
    {id: 1, name: 'Blooming Buds Bali', city: 'Denpasar', phone: '0812347321', address: 'Gunung Agung 48' , category: 'Shopping'},
    {id: 2, name: 'Brownfox Waffle and Coffee', city: 'Denpasar', phone: '081802392', address: 'Raya Puputan No. 80', category: 'Food and Restaurant'},
    {id: 3, name: 'Ayam Betutu khas Gilimanuk', city: 'Denpasar', phone: '03612183', address: 'Merdeka No.88', category: 'Food and Restaurant'},
    {id: 4, name: 'Massimo Italian Restaurant', city: 'Denpasar', phone: '03612394', address: 'Danau Tamblingan No.228', category: 'Food and Restaurant'}
];

// LIST ALL directory
app.get("/api/listing", (req, res) => {
    var datetime = new Date();
    console.log("\n" + datetime);
    console.log('Listing success');
    return res.json(listing);
});

//List a directory
app.get("/api/listing/:id", (req, res) => {

    var datetime = new Date();
    console.log("\n" + datetime);
    console.log("Incoming new GET HTTP request");

    const list = listing.find( l => l.id === parseInt(req.params.id));
    if ( !list ) res.status(404).send('ID not found.');
    console.log('List found');
    var jsonRespond = {
        result: list,
        message: "List found"
    }
    return res.json(jsonRespond);
});

// Add new directory
app.post("/api/listing", (req, res) => {

    var datetime = new Date();
    console.log("\n" + datetime);
    console.log("Incoming new GET HTTP request");
    console.log(req.body);

    const {error} = validateList(req.body);
    if(error) {
        return req.status(400).send(Error.detail[0].message);
    }

    const list = {
        id: listing.length + 1,
        name: req.body.name,
        city: req.body.city,
        phone: req.body.phone,
        address: req.body.address,
        category: req.body.category
    };
    listing.push(list);
    console.log('Add post success');
    var jsonRespond ={
        result: list,
        message: "Add post success"
    }
    return res.json(jsonRespond);
});

//Edit directory
app.put('/api/listing/:id', (req, res) => {
    var datetime = new Date();
    console.log("\n" + datetime);
    console.log("Incoming new GET HTTP request");
    console.log(req.body);

    const {error} = validateList(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const list = listing.find( l => l.id === parseInt(req.params.id));
    if(!list) return res.status(400).send('ID not found.');

        list.name = req.body.name,
        list.city = req.body.city,
        list.phone = req.body.phone,
        list.address = req.body.address,
        list.category = req.body.category

        console.log('Update success!');
        var jsonRespond = {
            result: list,
            message: 'Update success!' 
        }
        return res.json(jsonRespond);
});

//Delete directory
app.delete('/api/listing/:id', (req, res) => {
    const list  = listing.find( l => l.id === parseInt(req.params.id));
    if(!list) return res.status(400).send('ID not found.');
    
    const index = listing.indexOf(list);
    listing.splice(index, 1);
    console.log('Delete success');
    return res.json(json);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

function validateUser(user){
    const schema = Joi.object({
        username: Joi.string().min(3),
        email: Joi.string().email({ minDomainSegments : 2, tlds: { allow: ['com', 'net']}}),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });
    return schema.validate(user);
}

function validateList(list){
    const schema = Joi.object({
        name: Joi.string().min(3).required,
        city:Joi.string().min(5).required,
        phone: Joi.string().min(4).required,
        address: Joi.string().min(8).required,
        category: Joi.string().min(5).required
    });
    return schema.validate(list);
}