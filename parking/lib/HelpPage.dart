import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(
    home: HelpPage(),
  ));
}

class HelpPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFF4b39ef),
        title: Text('Help', style: TextStyle(color: Color(0xFFf1f4f8))),
        elevation: 0.0, // Remove shadow
        actions: <Widget>[],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSection(
              title: 'Help Center',
              color: const Color.fromARGB(161, 33, 149, 243),
              content:
                  'Welcome to our Help Center! Here you\'ll find answers to commonly asked questions and guidance on using our parking website.',
            ),
            SizedBox(height: 20),
            _buildSection(
              title: 'Getting Started',
              color: Color(0x9D1561E6),
              content:
                  'Register for an account if you haven\'t already done so.\nLogin to your account using your credentials.\nSearch for available parking spaces using our search feature.\nView details of parking spaces including location, price, and availability.\nSelect a parking space that suits your needs and proceed to book it.',
            ),
            SizedBox(height: 20),
            _buildSection(
              title: 'Booking a Parking Space',
              color: Color(0x9D1561E6),
              content:
                  'Make sure you\'re logged into your account.\nCheck the availability of the parking space for your desired dates and times.\nEnsure that you have sufficient funds in your account to make the booking.\nIf you encounter any errors during the booking process, please contact our support team for assistance.',
            ),
            SizedBox(height: 20),
            _buildSection(
              title: 'Managing Your Bookings',
              color: Color(0x9D1561E6),
              content:
                  'View details of your upcoming and past bookings.\nModify or cancel a booking if your plans change.\nContact the parking provider directly if you need to discuss any specific details regarding your booking.',
            ),
            SizedBox(height: 20),
            _buildSection(
              title: 'Support and Assistance',
              color: Color(0x9D1561E6),
              content:
                  'Visit our Contact Us page to find our contact information.\nCheck our FAQs for answers to common queries.\nFollow us on social media for updates and announcements.',
            ),
            SizedBox(height: 20),
            _buildSection(
              title: 'Feedback',
              color: Colors.teal,
              content:
                  'Send us an email with your feedback at tunisia-ais@oaca.nat.tn.\nFill out our feedback form on the Feedback page.',
            ),
            SizedBox(height: 20),
            Text(
              'We hope this Help Center provides you with the assistance you need. Thank you for choosing our parking website!',
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(
      {required String title, required Color color, required String content}) {
    return Container(
      padding: EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(10.0),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.4),
            spreadRadius: 2,
            blurRadius: 5,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 10),
          Text(
            content,
            style: TextStyle(fontSize: 16, color: Colors.white),
          ),
        ],
      ),
    );
  }
}
