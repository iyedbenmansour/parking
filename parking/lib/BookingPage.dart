import 'package:flutter/material.dart';
import 'package:parking/CategoryPage.dart';
import 'package:parking/LoginPage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class BookingPage extends StatefulWidget {
  final DateTime? startDate;
  final DateTime? endDate;

  BookingPage({Key? key, this.startDate, this.endDate}) : super(key: key);

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
  final List<String> locations = ['Djerba', 'Sfax'];

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
    startDate = widget.startDate;
    endDate = widget.endDate;
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

  void _bookNow() {
    if (_isFormIncomplete()) {
      _showErrorDialog('Please fill in all fields!');
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

  bool _isFormIncomplete() {
    return selectedLocation == null ||
        licensePlateController.text.isEmpty ||
        startDate == null ||
        endDate == null ||
        startTime == null ||
        endTime == null;
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Error'),
        content: Text(message),
        actions: <Widget>[
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
            },
            child: Text('Okay'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Book a Parking Space',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            _buildLocationDropdown(),
            SizedBox(height: 20),
            _buildTextField(
              labelText: 'Enter License Plate',
              icon: Icons.car_rental,
              controller: licensePlateController,
            ),
            SizedBox(height: 20),
            _buildDateTimeSelector(
              icon: Icons.date_range,
              label: 'Start Date',
              onSelect: (date) => startDate = date,
            ),
            SizedBox(height: 20),
            _buildDateTimeSelector(
              icon: Icons.date_range,
              label: 'End Date',
              onSelect: (date) => endDate = date,
            ),
            SizedBox(height: 20),
            _buildDateTimeSelector(
              icon: Icons.access_time,
              label: 'Start Time',
              isTimePicker: true,
              onSelect: (time) => startTime = time,
            ),
            SizedBox(height: 20),
            _buildDateTimeSelector(
              icon: Icons.access_time,
              label: 'End Time',
              isTimePicker: true,
              onSelect: (time) => endTime = time,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _bookNow,
              child: Text('Book Now', style: TextStyle(fontSize: 18)),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                padding: EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLocationDropdown() {
    return DropdownButtonFormField<String>(
      value: selectedLocation,
      onChanged: (String? newValue) {
        setState(() {
          selectedLocation = newValue;
        });
      },
      decoration: InputDecoration(
        labelText: 'Select Location',
        icon: Icon(Icons.location_on, color: Colors.blue),
        border: OutlineInputBorder(),
      ),
      items: locations.map((location) {
        return DropdownMenuItem<String>(
          value: location,
          child: Text(location),
        );
      }).toList(),
    );
  }

  Widget _buildTextField({
    required String labelText,
    required IconData icon,
    required TextEditingController controller,
  }) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: labelText,
        icon: Icon(icon, color: Colors.blue),
        border: OutlineInputBorder(),
      ),
    );
  }

  Widget _buildDateTimeSelector({
    required IconData icon,
    required String label,
    required Function(dynamic) onSelect,
    bool isTimePicker = false,
  }) {
    return ElevatedButton.icon(
      onPressed: () async {
        dynamic selectedValue;
        if (isTimePicker) {
          selectedValue = await showTimePicker(
            context: context,
            initialTime: TimeOfDay.now(),
          );
        } else {
          selectedValue = await showDatePicker(
            context: context,
            initialDate: DateTime.now(),
            firstDate: DateTime(2000),
            lastDate: DateTime(2100),
          );
        }
        if (selectedValue != null) {
          onSelect(selectedValue);
        }
      },
      icon: Icon(icon),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        foregroundColor: Colors.white, backgroundColor: Colors.blue,
        padding: EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }
}
