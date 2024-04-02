import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import './global.css'; 

export default function Help() {
  return (
    <>
      <Navbar />
      <Header type={"list"} />  
      <div className="mainContentArea">
        <div className="help-section-container">
          <div className="help-section">
            <h2>Help Center</h2>
            <p>Welcome to our Help Center! Here you'll find answers to commonly asked questions and guidance on using our parking website.</p>
          </div>

          <div className="help-section">
            <h3>Getting Started</h3>
            <p>If you're new to our website, here's how to get started:</p>
            <ul>
              <li>Register for an account if you haven't already done so.</li>
              <li>Login to your account using your credentials.</li>
              <li>Search for available parking spaces using our search feature.</li>
              <li>View details of parking spaces including location, price, and availability.</li>
              <li>Select a parking space that suits your needs and proceed to book it.</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Booking a Parking Space</h3>
            <p>If you're having trouble booking a parking space, here are some tips:</p>
            <ul>
              <li>Make sure you're logged into your account.</li>
              <li>Check the availability of the parking space for your desired dates and times.</li>
              <li>Ensure that you have sufficient funds in your account to make the booking.</li>
              <li>If you encounter any errors during the booking process, please contact our support team for assistance.</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Managing Your Bookings</h3>
            <p>Once you've made a booking, you can manage it through your account:</p>
            <ul>
              <li>View details of your upcoming and past bookings.</li>
              <li>Modify or cancel a booking if your plans change.</li>
              <li>Contact the parking provider directly if you need to discuss any specific details regarding your booking.</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Support and Assistance</h3>
            <p>If you need further assistance or have any questions, don't hesitate to contact us:</p>
            <ul>
              <li>Visit our <a href="/contactus">Contact Us</a> page to find our contact information.</li>
              <li>Check our <a href="/faq">FAQs</a> for answers to common queries.</li>
              <li>Follow us on social media for updates and announcements.</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Feedback</h3>
            <p>We value your feedback! If you have any suggestions for improving our website or services, please let us know.</p>
            <ul>
              <li>Send us an email with your feedback at <a href="mailto:tunisia-ais@oaca.nat.tn">tunisia-ais@oaca.nat.tn</a>.</li>
              <li>Fill out our feedback form on the <a href="/feedback">Feedback</a> page.</li>
            </ul>
          </div>

          <div className="help-section">
            <p>We hope this Help Center provides you with the assistance you need. Thank you for choosing our parking website!</p>
          </div>
        </div>
      </div>
      <Footer />  
    </>
  )
}
