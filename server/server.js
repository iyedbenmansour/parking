const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Resend } = require('resend');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserModel = require("./models/userModels");
const BookingModel = require("./models/bookingModels");
const ContactUsModel = require("./models/contactusModel");
// Initialize Resend instance
const resend = new Resend('re_5qBKgAne_NYwNS673AxrbDAQiexxFUZnM ');
require('dotenv').config();
const port = process.env.PORT;

require("./config/parking.config");

app.post("/api/register", async (req, res) => {
    const { fullname, email, password, phoneNumber, cin, role } = req.body;
    const newUser = { fullname, email, password, phoneNumber, cin, role };

    console.log(newUser);
    try {
        // Create a new user
        const user = await UserModel.create(newUser);

        // Send email
        const { data, error } = await resend.emails.send({
            from: 'OACA <onboarding@resend.dev>',
            to: [email], // Send email to the registered user
            subject: 'Welcome to Our Platform!',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Our Platform!</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #007bff;
                        text-align: center;
                    }
                    p {
                        margin: 10px 0;
                        line-height: 1.6;
                    }
                    .welcome-message {
                        font-size: 18px;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to Our Platform!</h1>
                    <p class="welcome-message">Hello <strong>${fullname}</strong>,</p>
                    <p class="welcome-message">Thank you for joining our platform. Your registration was successful.</p>
                    <p class="welcome-message">We're excited to have you on board!</p>
                </div>
            </body>
            </html>
            `,
                    });

        if (error) {
            console.error({ error });
            // Handle email sending error
        } else {
            console.log({ data });
            // Email sent successfully
        }

        res.json({
            user,
            message: "Registration successful"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "User already exists" });
    }
});


app.delete("/api/users/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        await UserModel.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting user" });
    }
});



app.get("/api/user/:email", async (req, res) => {
    try {
        // Extract the email from the request parameters
        const { email } = req.params;

        // Fetch the user by email
        const user = await UserModel.findOne({ email: email });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user details
        res.json({
            user,
            message: "User details fetched successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user details" });
    }
});

app.get('/api/allusers', async (req, res) => {
    try {
       // Fetch all users
       const users = await UserModel.find({});
   
       // Return the users
       res.json({
         users,
         message: 'Users fetched successfully',
       });
    } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Error fetching users' });
    }
   });

   app.post("/api/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email,
            password: req.body.password
        });
        if (user) {
            const token = jwt.sign({
                email: user.email,
                id: user._id,
                role: user.role ,
            }, 'secret123');

            res.json({
                user: token,
                message: "user exists"
            });
        } else {
            res.status(404).json({ message: "wrong credentials" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error" });
    }
});



// Define a route for booking creation
app.post("/api/booking", async (req, res) => {
    try {
        const { email, carModel, licensePlate, bookingStartDate, bookingEndDate, price, title } = req.body;
        const booking = { email, carModel, licensePlate, bookingStartDate, bookingEndDate, price, title };

        // Create a new booking
        const book = await BookingModel.create(booking);

        // Send email
        const { data, error } = await resend.emails.send({
            from: 'OACA <onboarding@resend.dev>',
            to: [email], // Send email to the provided email address
            subject: 'Booking Confirmation',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Booking Confirmation</title>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #007bff;
                  text-align: center;
                }
                p {
                  margin: 10px 0;
                }
                .details {
                  border-top: 2px solid #007bff;
                  padding-top: 20px;
                }
                .detail-item {
                  margin-bottom: 10px;
                }
                .detail-label {
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Booking Confirmation</h1>
                <p>Hello,</p>
                <p>Your booking for <strong>${carModel}</strong> (${licensePlate}) has been confirmed.</p>
                <div class="details">
                  <div class="detail-item">
                    <span class="detail-label">Start Date:</span> ${bookingStartDate}
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">End Date:</span> ${bookingEndDate}
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Price:</span> ${price}
                  </div>
                </div>
              </div>
            </body>
            </html>
            `,
                    });

        if (error) {
            console.error({ error });
            // Handle email sending error
        } else {
            console.log({ data });
            // Email sent successfully
        }

        res.json({
            booking: book,
            message: "Booking has been saved"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error" });
    }
});

app.get("/api/bookings", async (req, res) => {
    console.log("Bookings retrived"); // Debugging line
    try {
        // Extract the email from the query parameters
        const { email } = req.query;

        // Fetch bookings for the specified email
        const bookings = await BookingModel.find({ email: email });

        res.json({
            bookings: bookings,
            message: "Bookings fetched successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
});
    
app.get("/api/allbookings", async (req, res) => {
    console.log("Bookings retrieved"); // Debugging line
    try {
        // Fetch all bookings without filtering by email
        const bookings = await BookingModel.find({});

        res.json({
            bookings: bookings,
            message: "Bookings fetched successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
});


app.delete("/api/bookings/:id", async (req, res) => {
    console.log("Booking delete request received"); // Debugging line
    try {
        // Extract the booking ID from the request parameters
        const id = req.params.id; // Corrected line

        // Delete the booking with the specified ID
        await BookingModel.findByIdAndDelete(id);

        res.json({
            message: "Booking deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting booking" });
    }
});

app.post("/api/contact", async (req, res) => {
    try {
       const { email, errorType, specificError, message } = req.body;

       // Save contact form data to the database
       const contactUsData = new ContactUsModel({
         email,
         errorType,
         specificError,
         message,
       });
       await contactUsData.save();

       // Send email
       const { data, error } = await resend.emails.send({
            from: 'OACA <onboarding@resend.dev>',
            to: [email], // Send email to the provided email address
            subject: 'Contact Form Submission Confirmation',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Contact Form Submission Confirmation</title>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #007bff;
                  text-align: center;
                }
                p {
                  margin: 10px 0;
                }
                .details {
                  border-top: 2px solid #007bff;
                  padding-top: 20px;
                }
                .detail-item {
                  margin-bottom: 10px;
                }
                .detail-label {
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Contact Form Submission Confirmation</h1>
                <p>Hello,</p>
                <p>Your message has been received successfully.</p>
                <div class="details">
                  <div class="detail-item">
                    <span class="detail-label">Error Type:</span> ${errorType}
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Specific Error:</span> ${specificError}
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Message:</span> ${message}
                  </div>
                </div>
              </div>
            </body>
            </html>
            `,
        });

        if (error) {
            console.error({ error });
            // Handle email sending error
        } else {
            console.log({ data });
            // Email sent successfully
        }

       res.status(201).json({ message: "Contact form submitted successfully." });
    } catch (error) {
       res.status(500).json({ error: "An error occurred while submitting the contact form." });
    }
});

   
   app.get("/api/contacts", async (req, res) => {
       try {
           // Query the database for all contact form submissions
           const contacts = await ContactUsModel.find({});
   
           // Send the contacts in the response
           res.status(200).json({ contacts });
       } catch (error) {
           console.error("Error fetching contacts:", error);
           res.status(500).json({ error: "An error occurred while fetching contacts." });
       }
   });

   app.get("/api/contact", async (req, res) => {
    console.log("Contact retrieval initiated"); // Debugging line
    try {
        // Extract the email from the query parameters
        const { email } = req.query;
        console.log(`Fetching contact for email: ${email}`); // Debugging line

        // Fetch contacts for the specified email
        const contact = await ContactUsModel.find({ email: email });

        res.json({
            contact: contact,
            message: "Contact fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching contact:", error);
        res.status(500).json({ message: "Error fetching contact" });
    }
});


   
   app.delete("/api/contacts/:id", async (req, res) => {
    try {
        // Extract the contact ID from the request parameters
        const contactId = req.params.id;

        // Find and delete the contact by its ID
        const result = await ContactUsModel.findByIdAndDelete(contactId);

        // Check if the contact was found and deleted
        if (result) {
            // Send a success message
            res.status(200).json({ message: "Contact deleted successfully." });
        } else {
            // Send an error message if the contact was not found
            res.status(404).json({ error: "Contact not found." });
        }
    } catch (error) {
        console.error("Error deleting contact:", error);
        // Send a server error message
        res.status(500).json({ error: "An error occurred while deleting the contact." });
    }
});


app.listen(port, () => console.log(`Listening on port ${port}`));
