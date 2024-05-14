import 'package:flutter/material.dart';
import 'package:parking/PaymentPage.dart'; // Ensure this import path is correct

class PlanBox extends StatefulWidget {
  final String title;
  final String description;
  final double price;
  final IconData icon;
  final String selectedLocation;
  final String licensePlate;
  final DateTime bookingStartDate;
  final DateTime bookingEndDate;

  PlanBox({
    Key? key,
    required this.title,
    required this.description,
    required this.price,
    required this.icon,
    required this.selectedLocation,
    required this.licensePlate,
    required this.bookingStartDate,
    required this.bookingEndDate,
  }) : super(key: key);

  @override
  _PlanBoxState createState() => _PlanBoxState();
}

class _PlanBoxState extends State<PlanBox> {

  void _handleClick() async {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Confirmation'),
          content: Text(
              'dt${widget.price.toStringAsFixed(2)} will be your total price for ${widget.title}'),
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
              Text('dt${widget.price.toStringAsFixed(2)}',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }
}