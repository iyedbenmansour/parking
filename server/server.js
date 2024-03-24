const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserModel = require("./models/userModels");
const BookingModel = require("./models/bookingModels");
const ContactUsModel = require("./models/contactusModel");

require('dotenv').config();
const port = process.env.PORT;

require("./config/parking.config");

app.post("/api/register", async (req, res) => {
    const {fullname , email, password, phoneNumber, cin } = req.body;
    const newUser = {fullname , email, password, phoneNumber, cin } ;

    console.log(newUser);
    try {
        const user = await UserModel.create(newUser);
        res.json({
            user,
            message: "ok"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "useer already exists" });

    }
});

// Assuming this is part of your Express app setup

app.delete("/api/users/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        // Assuming UserModel is your Mongoose model for users
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

app.post("/api/booking", async (req, res) => {
    try {
        const {email , carModel, licensePlate, bookingStartDate, bookingEndDate , price , title} = req.body;
        const booking = { email , carModel, licensePlate, bookingStartDate, bookingEndDate ,price, title};

        const book = await BookingModel.create(booking);

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
       const contactUsData = new ContactUsModel({
         email: req.body.email, 
         errorType: req.body.errorType,
         specificError: req.body.specificError,
         message: req.body.message,
       });
   
       await contactUsData.save();
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
        console.log(`Fetched contacts: ${JSON.stringify(contact)}`); // Debugging line

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
