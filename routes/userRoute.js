const express = require('express');

const app = express();

const router = express.Router();

const mysql = require('mysql');

const axios = require('axios');





// const connection = mysql.createConnection({

//     'host': 'localhost',

//     'user': 'root',

//     'password': '',

//     'database': 'dnmtc'

// });




connection.connect((error) => {

    if (error) {

        throw error;

    }

    console.log('database connected');

});







router.get('/', (req, res) => {

    res.render('index');

});





router.post('/status',(req,res)=>{



    console.log(req.body);



    let status = req.body.status;

    let trans_id = req.body.trans_id;

    let foreignID = req.body.foreignID;



    if(status == 'success'){



        let query = `UPDATE nominee SET status ='success' WHERE ref = ${foreignID}`;



        connection.query(query,(error,results)=>{



            if(error){

                throw error;

            }

            



        })



    }





})


router.get('/admin/list',(req,res)=>{
    
    console.log('Hit');

const query = "SELECT * FROM nominee";

connection.query(query,(error, results)=>{

    if (error) {

        throw error;
    }

    // console.log(results);

    res.render('viewnominee',{results});
})



})





router.get('/get-details', (req, res) => {

    console.log(req.query);

    // Extract necessary data from query parameters

    let contact = req.query.contact;

    let email = req.query.email;

    let ref = req.query.ref;



    // Call the MoMo API

    momoPromptWeb(contact, 50.00, ref, 'MTN',email) // Adjust amount and network as needed

        .then(response => {

            console.log('MoMo API response:', response);

            res.send('<h1>Payment prompt initiated. Check Your Phone and Approve. Kindly Check your Email for the receipt once the payment is approved.</h1>'); // Send a response to the client

        })

        .catch(error => {

            console.error('Error initiating payment prompt:', error);

            res.status(500).send('Error initiating payment prompt');

        });

});



router.post('/submit-registration', (req, res) => {



    generateReference()

        .then(reference => {

            let name = req.body.name;

            let level = req.body.level;

            let contact = req.body.contact;

            let email = req.body.email;

            let category = req.body.category;



            let query = `INSERT INTO nominee (name, contact, category, level, email, ref) VALUES ('${name}','${contact}','${category}','${level}','${email}','${reference}')`;

            

            connection.query(query, (error, results) => {

                if (error) {

                   res.render('index');

                }

                res.send("<h1>REGISTRATION SUCCESSFUL !!!!!</h1>");

            });

        })

        .catch(error => {

            console.error('Error generating reference:', error);

            res.status(500).send('Error generating reference');

        });

});



function generateReference() {

    return new Promise((resolve, reject) => {

        const randomDigits = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10));

        const reference = randomDigits.join('');

        resolve(reference);

    });

}





async function momoPromptWeb(destination, amount, client_ref, network,email) {

    const payload = {

        amount: parseFloat(20),

        tot_amnt: parseFloat(amount),

        provider: network.toLowerCase(),

        phoneNumber: destination,

        channel: 'mobile_money',

        senderEmail: email,

        description: `Payment for DNMTC Nominations`,

        foreignID: client_ref,

        

    };



    try {

        const response = await axios.post('https://api.junipayments.com/payment', payload, {

            headers: {

    

            }

        });

        return response.data;

    } catch (error) {

        throw error.response ? error.response.data : error.message;

    }

}



module.exports = router;

