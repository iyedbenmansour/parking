import 'package:flutter/material.dart';
import 'package:parking/PaymentPage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:parking/component/PlanBox.dart'; // Ensure this is the correct path

class CategoryPage extends StatefulWidget {
  final Duration duration;
  final String selectedLocation;
  final String licensePlate;
  final DateTime bookingStartDate;
  final DateTime bookingEndDate;

  CategoryPage({
    Key? key,
    required this.duration,
    required this.selectedLocation,
    required this.licensePlate,
    required this.bookingStartDate,
    required this.bookingEndDate,
  }) : super(key: key);

  @override
  _CategoryPageState createState() => _CategoryPageState();
}

class _CategoryPageState extends State<CategoryPage> {
  String? token;
  String? storedBooking;

  @override
  void initState() {
    super.initState();
  }

  double calculatePrice(double baseRate) {
    final diffInHours = widget.duration.inHours;
    return diffInHours * baseRate;
  }

  @override
  Widget build(BuildContext context) {
    final ecoPrice = calculatePrice(1.1); // $3 per hour
    final luxPrice = calculatePrice(2.2); // $10 per hour
    final handPrice = calculatePrice(0.6); // $5 per hour

    return Scaffold(
      backgroundColor: Colors.white, // Set the background color to white
      appBar: AppBar(
        title: Text('Parking Categories'),
        backgroundColor: Color(0xFF4b39ef),
      ),
      body: SingleChildScrollView(
        child: Padding(
          // Removed the Container widget to ensure the background color is white
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              PlanBox(
                title: "Economy Zone",
                description: "Ideal for compact cars and motorcycles.",
                price: ecoPrice,
                icon: Icons.directions_car,
                selectedLocation: widget.selectedLocation,
                licensePlate: widget.licensePlate,
                bookingStartDate: widget.bookingStartDate,
                bookingEndDate: widget.bookingEndDate,
              ),
              SizedBox(height: 20),
              PlanBox(
                title: "Premium Zone",
                description: "Spacious spots for SUVs and luxury vehicles.",
                price: luxPrice,
                icon: Icons.local_parking,
                selectedLocation: widget.selectedLocation,
                licensePlate: widget.licensePlate,
                bookingStartDate: widget.bookingStartDate,
                bookingEndDate: widget.bookingEndDate,
              ),
              SizedBox(height: 20),
              PlanBox(
                title: "Handicap Zone",
                description: "Accessible parking for permit holders.",
                price: handPrice,
                icon: Icons.accessible,
                selectedLocation: widget.selectedLocation,
                licensePlate: widget.licensePlate,
                bookingStartDate: widget.bookingStartDate,
                bookingEndDate: widget.bookingEndDate,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PlanBoxState extends State<PlanBox> {
  String _modalMessage = '';

  void _handleClick() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString('title', widget.title);
    prefs.setString('price', widget.price.toStringAsFixed(2));

    setState(() {
      _modalMessage =
          'Price ${widget.price.toStringAsFixed(2)} will be your total price for ${widget.title}';
    });

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Confirmation'),
          content: Text(_modalMessage),
          actions: <Widget>[
            TextButton(
              child: Text('Close'),
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
                Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => PaymentPage(
                    selectedLocation: widget.selectedLocation,
                    licensePlate: widget.licensePlate,
                    bookingStartDate: widget.bookingStartDate,
                    bookingEndDate: widget.bookingEndDate,
                    title: widget.title,
                    price: widget.price,
                  ), // Navigate to PaymentPage with parameters
                ));
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      elevation: 5,
      margin: EdgeInsets.all(20),
      child: InkWell(
        onTap: _handleClick,
        child: Padding(
          padding: EdgeInsets.all(30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(widget.icon, size: 24),
                  SizedBox(width: 10),
                  Text(widget.title,
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                ],
              ),
              SizedBox(height: 10),
              Text(widget.description, style: TextStyle(fontSize: 16)),
              SizedBox(height: 20),
              Text('\$${widget.price.toStringAsFixed(2)}',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }
}