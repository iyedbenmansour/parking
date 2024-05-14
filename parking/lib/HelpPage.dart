import 'package:flutter/material.dart';

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
      body: Stack(
        children: <Widget>[
          Container(
            decoration: BoxDecoration(
              color: Color.fromARGB(255, 250, 250, 250),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.white,
                ],
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Help Center',
                      style:
                          TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 10),
                    Text(
                      'Welcome to our Help Center! Here you\'ll find answers to commonly asked questions and guidance on using our parking website.',
                      style: TextStyle(fontSize: 16),
                    ),
                    SizedBox(height: 20),
                    _buildHelpSection(
                      title: 'Getting Started',
                      content: [
                        'Register for an account if you haven\'t already done so.',
                        'Login to your account using your credentials.',
                        'Search for available parking spaces using our search feature.',
                        'View details of parking spaces including location, price, and availability.',
                        'Select a parking space that suits your needs and proceed to book it.',
                      ],
                    ),
                    SizedBox(height: 20),
                    _buildHelpSection(
                      title: 'Booking a Parking Space',
                      content: [
                        'Make sure you\'re logged into your account.',
                        'Check the availability of the parking space for your desired dates and times.',
                        'Ensure that you have sufficient funds in your account to make the booking.',
                        'If you encounter any errors during the booking process, please contact our support team for assistance.',
                      ],
                    ),
                    SizedBox(height: 20),
                    _buildHelpSection(
                      title: 'Managing Your Bookings',
                      content: [
                        'View details of your upcoming and past bookings.',
                        'Modify or cancel a booking if your plans change.',
                        'Contact the parking provider directly if you need to discuss any specific details regarding your booking.',
                      ],
                    ),
                    SizedBox(height: 20),
                    _buildHelpSection(
                      title: 'Support and Assistance',
                      content: [
                        'Visit our Contact Us page to find our contact information.',
                        'Check our FAQs for answers to common queries.',
                        'Follow us on social media for updates and announcements.',
                      ],
                    ),
                    SizedBox(height: 20),
                    _buildHelpSection(
                      title: 'Feedback',
                      content: [
                        'Send us an email with your feedback at tunisia-ais@oaca.nat.tn.',
                        'Fill out our feedback form on the Feedback page.',
                      ],
                    ),
                    SizedBox(height: 20),
                    Text(
                      'We hope this Help Center provides you with the assistance you need. Thank you for choosing our parking website!',
                      style: TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHelpSection(
      {required String title, required List<String> content}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 10),
        ...content
            .map((item) => Text(item, style: TextStyle(fontSize: 16)))
            .toList(),
        SizedBox(height: 20),
      ],
    );
  }
}