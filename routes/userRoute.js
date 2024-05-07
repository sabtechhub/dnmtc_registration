const express = require('express');

const app = express();

const router = express.Router();

const mysql = require('mysql');

const axios = require('axios');



const connection = mysql.createConnection({

    'host': 'localhost',

    'user': 'sabtechhub_dnmtc2_user',

    'password': '[u%g#YQ&hD#(',

    'database': 'sabtechhub_dnmtc_2'

});


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

        'callbackUrl' :'https://app.smartvotegh.com/status'

    };



    try {

        const response = await axios.post('https://api.junipayments.com/payment', payload, {

            headers: {

                'clientid': 'Qys10304',

                'Content-Type': 'application/json',

                'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiIiwiaWF0IjoxNjY1MDkzMjQxfQ.pRFO8MCG06NkeXJ9mCefTi90yMKLu8tdiEUvLlxiWl4WkgfygXwCdrqs5aywDOwAL_7QQXv5Mul7_ASBZS25g-klBUBUMi6yw4HPw6SBLv-Q0ktoSCjIRWlL3N9-V-bHhndn1qAD2wU4HShhtFhT8gxoaNj5IvWv_upEdRMky2f6Ky6P_rZuv5wVMn_9QjfDeGuRnPcvrbwXO0k_1kGGhYBjozeOyWARhUUjwIAjIBH5u1SQATSpFEs20p308NeUeumiluaMve8MsVORP_bAVDkKM2ZMVvH609AUDrVmns-sFqoiwx9tl-nztfq8n_VJyaVmJQ3uJDSDQ1LKFWT3kicyJBl-Cg4QzFt0DggEu0WyWPWp311CBohLxp6A58bSuNkg5wwCP_Rfa_0Vh2PsJvZpYiLoGhTU1YnjCcspRiBAC6ijAcMfmdDbwRWvzSUzFmjXFFlJqxImbvetPI_kqunNQGHFVEfe9DgDWZAWfneReW4rJ5xPivEe28J0qJteDcqDgu9sET9n4oTmHmXfqlwpIz4ciPxhPdx2fWFAUomE0MSrG_n_wnHTlCqHtvc-xDJOSiSiwKkwGp7XfsgmPwtTb9DY0OwSKdgwY8s0ZJEUkUQ6TG66emZJPdxL4uH7g_fN2gJJuhUKBrIHiFeHjSs_gz5yID-7ewBlzOxq1X0'

            }

        });

        return response.data;

    } catch (error) {

        throw error.response ? error.response.data : error.message;

    }

}



module.exports = router;

