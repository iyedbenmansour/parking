import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

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
  double? ecop;
  double? premp;
  double? handp;
  int? ecoAvailable;
  int? luxAvailable;
  int? handAvailable;

  @override
  void initState() {
    super.initState();
    fetchParkingData();
  }

  Future<void> fetchParkingData() async {
    try {
      final response =
          await http.get(Uri.parse('http://localhost:5000/api/variables'));
      if (response.statusCode == 200) {
        var data = json.decode(response.body);
        setState(() {
          ecop = data['ecop'];
          premp = data['luxp'];
          handp = data['hadp'];
          // Assigning values based on selected location using ternary operator
          ecoAvailable =
              widget.selectedLocation == "Sfax–Thyna International Airport"
                  ? data['sfaxcapeco']
                  : data['djcapeco'];
          luxAvailable =
              widget.selectedLocation == "Sfax–Thyna International Airport"
                  ? data['sfaxcaplux']
                  : data['djcaplux'];
          handAvailable =
              widget.selectedLocation == "Sfax–Thyna International Airport"
                  ? data['sfaxcaphad']
                  : data['djcaphad'];
        });
      } else {
        throw Exception('Failed to load parking data');
      }
    } catch (e) {
      print('Error fetching parking data: $e');
    }
  }

  double calculatePrice(double baseRate) {
    final diffInHours = widget.duration.inHours;
    return diffInHours * baseRate;
  }

  @override
  Widget build(BuildContext context) {
    final ecoPrice = ecop != null ? calculatePrice(ecop!) : 0.0;
    final luxPrice = premp != null ? calculatePrice(premp!) : 0.0;
    final handPrice = handp != null ? calculatePrice(handp!) : 0.0;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title:
            Text('Parking Categories', style: TextStyle(color: Colors.white)),
        backgroundColor: Color(0xFF4b39ef),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              PlanBox(
                title: "Economy Zone",
                description:
                    "This zone could be designed for vehicles that require less space, such as compact cars or motorcycles. It's a great option for those who don't need a lot of parking space: $ecoAvailable available spots",
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
                description:
                    "Ideal for luxury vehicles or those that require more space, such as SUVs or large sedans. This zone offers more spacious parking spaces and might include additional amenities like reserved parking spots or valet services: $luxAvailable available spots",
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
                description:
                    "This zone is designed to accommodate vehicles with handicap parking permits. It ensures that individuals with disabilities have easy access to parking spaces: $handAvailable available spots",
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
