import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:auto_size_text/auto_size_text.dart';

class PaymentPage extends StatefulWidget {
  final String selectedLocation;
  final String licensePlate;
  final DateTime bookingStartDate;
  final DateTime bookingEndDate;
  final String title;
  final double price;

  PaymentPage({
    Key? key,
    required this.selectedLocation,
    required this.licensePlate,
    required this.bookingStartDate,
    required this.bookingEndDate,
    required this.title,
    required this.price,
  }) : super(key: key);

  @override
  _PaymentPageState createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  String _price = '';
  String _title = '';
  String _email = '';
  bool _isModalOpen = false;
  String _modalMessage = '';

  @override
  void initState() {
    super.initState();
    _loadDataFromStorage();
  }

  Future<void> _loadDataFromStorage() async {
    final prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    if (token != null && token.isNotEmpty) {
      try {
        final parts = token.split('.');
        if (parts.length != 3) {
          throw Exception('Invalid token');
        }
        final payload = parts[1];
        final normalized = base64Url.normalize(payload);
        final response = utf8.decode(base64Url.decode(normalized));
        final payloadMap = jsonDecode(response);
        if (payloadMap is Map<String, dynamic>) {
          setState(() {
            _email = payloadMap['email'] ?? 'No email';
            _title = widget.title;
            _price = widget.price.toStringAsFixed(2);
          });
        }
      } catch (e) {
        setState(() {
          _modalMessage = 'Failed to load data: $e';
          _isModalOpen = true;
        });
      }
    }
  }

  Future<void> _handleBooking() async {
    // First, decrement the capacity
    try {
      final decrementResponse = await http.post(
        Uri.parse('http://localhost:5000/api/decrement-capacity'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode({
          'location': widget.selectedLocation,
          'category': widget.title, 
        }),
      );

      if (decrementResponse.statusCode != 200) {
        throw Exception('Failed to decrement capacity');
      }
    } catch (err) {
      setState(() {
        _modalMessage = "Error updating capacity: $err";
        _isModalOpen = true;
      });
      return;
    }

    
    final newBooking = {
      'carModel': widget.selectedLocation,
      'licensePlate': widget.licensePlate,
      'bookingStartDate': widget.bookingStartDate.toIso8601String(),
      'bookingEndDate': widget.bookingEndDate.toIso8601String(),
      'price': _price,
      'title': _title,
      'email': _email,
    };

    try {
      // First, archive the booking data
      final archiveResponse = await http.post(
        Uri.parse('http://localhost:5000/api/archive'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(newBooking),
      );

      if (archiveResponse.statusCode != 201) {
        throw Exception('Failed to archive booking');
      }

      
      final bookingResponse = await http.post(
        Uri.parse('http://localhost:5000/api/booking'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(newBooking),
      );

      if (bookingResponse.statusCode != 201) {
        throw Exception('Failed to book');
      }

      setState(() {
        _modalMessage = "Booking and archiving done successfully.";
        _isModalOpen = true;
      });

    
      Future.delayed(Duration(seconds: 2), () {
        Navigator.pushNamed(context, '/booking');
      });
    } catch (err) {
      setState(() {
        _modalMessage = "Error processing booking: $err";
        _isModalOpen = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Payment', style: TextStyle(color: Colors.white)),
        backgroundColor: Color(0xFF4b39ef),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(32.0),
              child: Container(
                padding: EdgeInsets.all(40.0),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.8),
                  borderRadius: BorderRadius.circular(20.0),
                  border: Border.all(color: Color(0xFF4b39ef), width: 3.0),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    SizedBox(height: 100),
                    AutoSizeText('Airport parking: ',
                        style: TextStyle(
                            fontSize: 24, fontWeight: FontWeight.bold)),
                    AutoSizeText(' ${widget.selectedLocation}',
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold)),
                    SizedBox(height: 20),
                    AutoSizeText('License Plate: ${widget.licensePlate}',
                        style: TextStyle(fontSize: 20)),
                    SizedBox(height: 20),
                    AutoSizeText(
                        'From: ${widget.bookingStartDate.toIso8601String()}',
                        style: TextStyle(fontSize: 20)),
                    SizedBox(height: 20),
                    AutoSizeText(
                        'To: ${widget.bookingEndDate.toIso8601String()}',
                        style: TextStyle(fontSize: 20)),
                    SizedBox(height: 20),
                    AutoSizeText('Price: $_price dt',
                        style: TextStyle(
                            fontSize: 24, fontWeight: FontWeight.bold)),
                    SizedBox(height: 20),
                    AutoSizeText('Zone: $_title',
                        style: TextStyle(fontSize: 20)),
                    SizedBox(height: 20),
                    AutoSizeText('Email: $_email',
                        style: TextStyle(fontSize: 20)),
                    SizedBox(height: 40),
                    ElevatedButton(
                      onPressed: _handleBooking,
                      child: Text('Confirm'),
                      style: ElevatedButton.styleFrom(
                        foregroundColor: Colors.white,
                        backgroundColor: Color(0xFF4b39ef),
                        padding:
                            EdgeInsets.symmetric(vertical: 20, horizontal: 30),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: _isModalOpen ? _buildModal() : null,
    );
  }

  Widget _buildModal() {
    return AlertDialog(
      title: Text(_modalMessage),
      actions: <Widget>[
        TextButton(
          child: Text('Close'),
          onPressed: () {
            setState(() {
              _isModalOpen = false;
            });
          },
        ),
      ],
    );
  }
}
