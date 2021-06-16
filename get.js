// COWIN API Automation -  Node JS
// Rishish Dixit

start_point("110016", "12-06-2021");

// Starting point to process COWIN API
function start_point(pincode, date) {
	const https = require('https'); //import https module

	//initiate get request
	let req = https.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + pincode + '&date=' + date, function (res) {
		let data = '', json_data;

		// Add data when response expect data fragments
		res.on('data', function (data_fragment) {
			data += data_fragment;
		});
		// At end of response parsing data as JS object
		res.on('end', function () {
			json_data = JSON.parse(data);
			//pass this JS object in the search function to process 
			search_available_capacity(json_data);
		});
	});
	// return error if expectatios are not met
	req.on('error', function (e) {
		console.log(e.message);
	});
}

function search_available_capacity(json_data_object) {
	for (var key in json_data_object) {
		if (typeof json_data_object[key] == 'object') {
			search_available_capacity(json_data_object[key]);
		} else {
			if (key == "available_capacity" && json_data_object["available_capacity"] > 0) {
				subject = "Vaccine Availbilty - Pincode - " + json_data_object["pincode"] + " - " + json_data_object["name"];
				console.log(subject);
				message_to_go = json_data_object["name"] + "(District name - " + json_data_object["district_name"] +
					") --Total Availbilty = " + json_data_object["available_capacity"] + " (Age Limit - " + json_data_object["min_age_limit"] + " )";
				console.log(message_to_go);
				// pass email, subject and message and call function to send email
				send_mail("rishish.xyz@gmail.com", subject, message_to_go);

			}
		}
	}
}

function send_mail(mailid, subject, message_to_go) {
	// import nodemailer
	// use - npm install nodemailer
	// before import
	var nm = require('nodemailer');
	var transporter = nm.createTransport({
		service: 'gmail',
		auth: {
			user: 'xxxxx@gmail.com', // put gmail user name
			pass: 'xxxxxxxx'		// put gmail password
		}
	});

	var mailOptions = {
		from: 'xxxxx@gmail.com',
		to: mailid,
		subject: subject,
		text: message_to_go
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}
