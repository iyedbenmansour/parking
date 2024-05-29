import 'package:flutter/material.dart';
import 'package:parking/CategoryPage.dart';
import 'package:parking/LoginPage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class BookingPage extends StatefulWidget {
  final DateTime? startDate;
  final DateTime? endDate;
  final String? locationSelected;

  BookingPage({
    Key? key,
    this.startDate,
    this.endDate,
    this.locationSelected,
  }) : super(key: key);

  @override
  _BookingPageState createState() => _BookingPageState();
}

class _BookingPageState extends State<BookingPage> {
  DateTime? startDate;
  DateTime? endDate;
  TimeOfDay? startTime;
  TimeOfDay? endTime;
  String? selectedLocation;
  final TextEditingController licensePlateController = TextEditingController();
  final List<String> locations = [
    'Djerba–Zarzis international Airport',
    'Sfax–Thyna International Airport'
  ];

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
    startDate = widget.startDate;
    endDate = widget.endDate;
    selectedLocation = widget.locationSelected;
  }

  Future<void> _checkLoginStatus() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    if (token == null) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => LoginPage()),
      );
    }
  }

  Future<void> _selectDate(BuildContext context, bool isStart) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate:
          isStart ? startDate ?? DateTime.now() : endDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      setState(() {
        if (isStart) {
          startDate = picked;
        } else {
          endDate = picked;
        }
      });
    }
  }

  Future<void> _selectTime(BuildContext context, bool isStart) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime:
          isStart ? startTime ?? TimeOfDay.now() : endTime ?? TimeOfDay.now(),
    );
    if (picked != null) {
      setState(() {
        if (isStart) {
          startTime = picked;
        } else {
          endTime = picked;
        }
      });
    }
  }

  void _bookNow() {
    if (selectedLocation == null ||
        licensePlateController.text.isEmpty ||
        startDate == null ||
        endDate == null ||
        startTime == null ||
        endTime == null) {
      _showErrorDialog('All fields must be filled!');
      return;
    }

    DateTime bookingStartDate = DateTime(startDate!.year, startDate!.month,
        startDate!.day, startTime!.hour, startTime!.minute);
    DateTime bookingEndDate = DateTime(endDate!.year, endDate!.month,
        endDate!.day, endTime!.hour, endTime!.minute);

    if (bookingEndDate.isBefore(bookingStartDate) ||
        bookingStartDate.isBefore(DateTime.now())) {
      _showErrorDialog(
          'Please ensure the end date/time is after the start date/time and both are in the future.');
      return;
    }

    Duration duration = bookingEndDate.difference(bookingStartDate);

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => CategoryPage(
          selectedLocation: selectedLocation!,
          licensePlate: licensePlateController.text,
          bookingStartDate: bookingStartDate,
          bookingEndDate: bookingEndDate,
          duration: duration,
        ),
      ),
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(
          'Error',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Color(0xFF4b39ef), // Custom color for the title
          ),
        ),
        content: Text(
          message,
          style: TextStyle(
            color: Colors.black54, // Subtle text color for the content
          ),
        ),
        actions: <Widget>[
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
            },
            child: Text(
              'Okay',
              style: TextStyle(
                color: Color(0xFF4b39ef), // Custom color for button text
              ),
            ),
          ),
        ],
        shape: RoundedRectangleBorder(
          borderRadius:
              BorderRadius.circular(20), // Rounded corners for the dialog
        ),
        backgroundColor: Colors.white, // Background color for the dialog
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Booking Page', style: TextStyle(color: Colors.white)),
        backgroundColor: Color(0xFF4B39EF),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Container(
          padding: EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: Color.fromARGB(255, 215, 212, 212), // Light grey background
            borderRadius: BorderRadius.circular(10.0),
            border: Border.all(
                color: Color.fromARGB(255, 0, 0, 0), width: 2.0), // Blue border
          ),
          child: Column(
            children: <Widget>[
              DropdownButtonFormField<String>(
                decoration: InputDecoration(
                  labelText: 'Location',
                  border: OutlineInputBorder(),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                        color: Color.fromARGB(255, 0, 0, 0), width: 2.0),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                        color: Color.fromARGB(255, 0, 0, 0), width: 2.5),
                  ),
                ),
                value: selectedLocation,
                onChanged: (String? newValue) {
                  setState(() {
                    selectedLocation = newValue;
                  });
                },
                items: locations.map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
              ),
              SizedBox(height: 20),
              TextField(
                controller: licensePlateController,
                decoration: InputDecoration(
                  labelText: 'License Plate',
                  border: OutlineInputBorder(),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                        color: Color.fromARGB(255, 0, 0, 0), width: 2.0),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                        color: Color.fromARGB(255, 0, 0, 0), width: 2.5),
                  ),
                ),
              ),
              SizedBox(height: 20),
              InkWell(
                onTap: () => _selectDate(context, true),
                child: InputDecorator(
                  decoration: InputDecoration(
                    labelText: 'Start Date',
                    border: OutlineInputBorder(),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                          color: Color.fromARGB(255, 0, 0, 0), width: 2.0),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                          color: Color.fromARGB(255, 0, 0, 0), width: 2.5),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(startDate?.toString().split(' ')[0] ??
                          'Not selected'),
                      Icon(Icons.calendar_today),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 20),
              InkWell(
                onTap: () => _selectDate(context, false),
                child: InputDecorator(
                  decoration: InputDecoration(
                    labelText: 'End Date',
                    border: OutlineInputBorder(),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                          color: Color.fromARGB(255, 0, 0, 0), width: 2.0),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                          color: Color.fromARGB(255, 0, 0, 0), width: 2.5),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(endDate?.toString().split(' ')[0] ?? 'Not selected'),
                      Icon(Icons.calendar_today),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 20),
              InkWell(
                onTap: () => _selectTime(context, true),
                child: InputDecorator(
                  decoration: InputDecoration(
                    labelText: 'Start Time',
                    border: OutlineInputBorder(),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                          color: Color.fromARGB(255, 0, 0, 0), width: 2.0),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                          color: Color.fromARGB(255, 0, 0, 0), width: 2.5),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(startTime?.format(context) ?? 'Not selected'),
                      Icon(Icons.access_time),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 20),
              InkWell(
                onTap: () => _selectTime(context, false),
                child: InputDecorator(
                  decoration: InputDecoration(
                    labelText: 'End Time',
                    border: OutlineInputBorder(),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                          color: Color.fromARGB(255, 0, 0, 0), width: 2.0),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                          color: Color.fromARGB(255, 0, 0, 0), width: 2.5),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(endTime?.format(context) ?? 'Not selected'),
                      Icon(Icons.access_time),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _bookNow,
                child: Text('Book Now!'),
                style: ElevatedButton.styleFrom(
                  foregroundColor: Colors.white,
                  backgroundColor: Color(0xFF4B39EF),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
