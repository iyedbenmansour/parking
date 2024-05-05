import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart'; 
import 'package:parking/BookingPage.dart';
import 'package:parking/component/CustomAppBar.dart';
import 'package:parking/component/CustomDrawer.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late TextEditingController _startDateController;
  late TextEditingController _endDateController;
  DateTime? startDate;
  DateTime? endDate;

  @override
  void initState() {
    super.initState();
    _startDateController = TextEditingController();
    _endDateController = TextEditingController();
  }

  @override
  void dispose() {
    _startDateController.dispose();
    _endDateController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context, bool isStartDate) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: isStartDate? DateTime.now() : (startDate?? DateTime.now()),
      firstDate: DateTime.now(),
      lastDate: DateTime(2100),
    );
    if (picked!= null) {
      setState(() {
        if (isStartDate) {
          startDate = picked;
          _startDateController.text = picked.toString().substring(0, 10);
        } else {
          endDate = picked;
          _endDateController.text = picked.toString().substring(0, 10);
        }
      });
    }
  }
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: CustomAppBar(context: context),
    drawer: CustomDrawer(),
    backgroundColor: Color(0xFFF1F4F8),
    body: ListView(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Start Date',
                  border: OutlineInputBorder(
                    borderSide: BorderSide(color: Color(0xFF4B39EF)),
                  ),
                  prefixIcon: Icon(Icons.date_range, color: Color(0xFF4B39EF)),
                ),
                controller: _startDateController,
                onTap: () => _selectDate(context, true),
              ),
              SizedBox(height: 20),
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'End Date',
                  border: OutlineInputBorder(
                    borderSide: BorderSide(color: Color(0xFF4B39EF)),
                  ),
                  prefixIcon: Icon(Icons.date_range, color: Color(0xFF4B39EF)),
                ),
                controller: _endDateController,
                onTap: () => _selectDate(context, false),
              ),
              SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 58.0,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    textStyle: TextStyle(fontSize: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(4.0),
                    ),
                  ),
                  onPressed: () {
                    if (startDate == null || startDate!.isBefore(DateTime.now())) {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                        content: Text("Start date must be today or later."),
                      ));
                      return;
                    }
                    if (endDate == null || endDate!.isBefore(startDate!)) {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                        content: Text("End date must be after start date."),
                      ));
                      return;
                    }
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => BookingPage(
                          startDate: startDate,
                          endDate: endDate,
                        ),
                      ),
                    );
                  },
                  child: Text('Search'),
                ),
              ),
            ],
          ),
        ),
        Container(
          padding: EdgeInsets.all(16.0),
          margin: EdgeInsets.symmetric(vertical: 20.0, horizontal: 16.0),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8.0),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'How to Use Our Parking App',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 20),
              _buildTutorialStep(
                FontAwesomeIcons.car,
                'Select Your Vehicle',
                'Open the app and choose the type of vehicle you\'re driving.',
              ),
              _buildTutorialStep(
                FontAwesomeIcons.mapMarkerAlt,
                'Choose Your Parking Spot',
                'Browse through available parking spots and select one that suits your needs.',
              ),
              _buildTutorialStep(
                FontAwesomeIcons.creditCard,
                'Pay Securely Online',
                'Enter your payment details and confirm your reservation to lock in the rate.',
              ),
              _buildTutorialStep(
                FontAwesomeIcons.checkCircle,
                'Confirm Your Reservation',
                'Receive a confirmation message and enjoy your reserved parking spot.',
              ),
            ],
          ),
        ),
        Container(
          padding: EdgeInsets.all(16.0),
          margin: EdgeInsets.symmetric(vertical: 20.0, horizontal: 16.0),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8.0),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'About Our Parking Solutions',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 20),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildAboutUsItem(
                    'Short-Term Parking',
                    'We offer convenient short-term parking solutions in various locations, perfect for visitors and commuters.',
                  ),
                  _buildAboutUsItem(
                    'Long-Term Parking',
                    'Our long-term parking options provide secure storage for your vehicles, with easy access whenever you need it.',
                  ),
                  _buildAboutUsItem(
                    'Handicapped Parking',
                    'We ensure accessibility with designated parking spots for our valued customers with disabilities.',
                  ),
                  _buildAboutUsItem(
                    'Motorcycle Parking',
                    'For motorcycle enthusiasts, we have dedicated spaces where you can park your two-wheelers with pride.',
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    ),
  );
}


  Widget _buildTutorialStep(IconData icon, String title, String description) {
    return ListTile(
      leading: Icon(icon, size: 36, color: Color(0xFF4B39EF)),
      title: Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      subtitle: Text(description),
    );
  }

  Widget _buildAboutUsItem(String title, String description) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 8),
        Text(
          description,
          style: TextStyle(fontSize: 16),
        ),
        SizedBox(height: 20),
      ],
    );
  }
}
