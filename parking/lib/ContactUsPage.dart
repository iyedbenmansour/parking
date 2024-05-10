import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:parking/AlertModal.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class ContactUsPage extends StatefulWidget {
  @override
  _ContactUsPageState createState() => _ContactUsPageState();
}

class _ContactUsPageState extends State<ContactUsPage> {
  final _formKey = GlobalKey<FormState>();
  String _errorType = 'Select Error Type';
  List<String> _specificErrorOptions = ['Select Specific Error'];
  String _specificError = 'Select Specific Error';
  String _message = '';
  bool isModalOpen = false;
  String modalMessage = '';

  void setSpecificErrorOptions(List<String> options) {
    setState(() {
      _specificErrorOptions = ['Select Specific Error', ...options];
      _specificError = 'Select Specific Error';
    });
  }

  Future<void> _handleSubmit() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      try {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('token');
        final decodedToken = jsonDecode(token!);
        final userEmail = decodedToken['email'];

        final response = await http.post(
          Uri.parse('http://localhost:5000/api/contact'),
          body: {
            'errorType': _errorType,
            'specificError': _specificError,
            'message': _message,
            'email': userEmail,
          },
        );

        if (response.statusCode == 201) {
          setState(() {
            modalMessage = "Contact form submitted successfully.";
            isModalOpen = true;
          });
          Future.delayed(Duration(seconds: 2), () {
            setState(() {
              isModalOpen = false;
            });
          });
        } else {
          setState(() {
            modalMessage =
                "An error occurred while submitting the contact form.";
            isModalOpen = true;
          });
        }
      } catch (e) {
        print(e);
        setState(() {
          modalMessage = "An error occurred.";
          isModalOpen = true;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFF4b39ef),
        title: Text('Contact us', style: TextStyle(color: Color(0xFFf1f4f8))),
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
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Container(
                  padding:
                      EdgeInsets.all(20.0), // Add padding inside the container
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(
                        0.8), // Make the container semi-transparent
                    borderRadius:
                        BorderRadius.circular(10.0), // Add rounded corners
                    border: Border.all(
                        color: Color(0xFF4b39ef), width: 2.0), // Add a border
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        SizedBox(height: 50), // Adjust the space as needed
                        DropdownButtonFormField<String>(
                          value: _errorType,
                          onChanged: (String? newValue) {
                            setState(() {
                              _errorType = newValue!;
                              switch (_errorType) {
                                case "payment":
                                  setSpecificErrorOptions([
                                    "Insufficient Funds",
                                    "Card Declined",
                                    "Expired Card",
                                    "Card Not Supported",
                                    "Transaction Failed",
                                    // Add more payment-related options here
                                  ]);
                                  break;
                                case "login":
                                  setSpecificErrorOptions([
                                    "Wrong Password",
                                    "Account Locked",
                                    "Email Not Verified",
                                    "Account Not Found",
                                    "Password Reset Required",
                                    // Add more login-related options here
                                  ]);
                                  break;
                                case "register":
                                  setSpecificErrorOptions([
                                    "Email Already In Use",
                                    "Username Already Taken",
                                    "Invalid Email Format",
                                    "Password Too Weak",
                                    "Terms Not Accepted",
                                    // Add more login-related options here
                                  ]);
                                  break;
                                case "parking":
                                  setSpecificErrorOptions([
                                    "Expired Ticket",
                                    "Invalid Location",
                                    "No Parking Zone",
                                    "Overstayed",
                                    "Meter Expired",
                                    "Incorrect Payment",
                                    // Add more login-related options here
                                  ]);
                                  break;
                                case "adminReport":
                                  setSpecificErrorOptions([
                                    "User Complaint",
                                    "System Issue",
                                    "Data Inconsistency",
                                    "Security Violation",
                                    "Feature Request",
                                    // Add more login-related options here
                                  ]);
                                  break;
                                case "bugReport":
                                  setSpecificErrorOptions([
                                    "Crash Report",
                                    "Performance Issue",
                                    "UI Glitch",
                                    "Feature Bug",
                                    "Security Flaw",
                                    // Add more login-related options here
                                  ]);
                                  break;
                                // Add cases for other error types
                                default:
                                  setSpecificErrorOptions([]);
                              }
                            });
                          },
                          items: [
                            DropdownMenuItem(
                                child: Text('Select Error Type'),
                                value: 'Select Error Type'),
                            DropdownMenuItem(
                                child: Text('Payment Error'), value: 'payment'),
                            DropdownMenuItem(
                                child: Text('login Error'), value: 'login'),
                            DropdownMenuItem(
                                child: Text('register Error'),
                                value: 'register'),
                            DropdownMenuItem(
                                child: Text('parking Error'), value: 'parking'),
                            DropdownMenuItem(
                                child: Text('adminReport Error'),
                                value: 'adminReport'),
                            DropdownMenuItem(
                                child: Text('bugReport Error'),
                                value: 'bugReport'),
                          ],
                          validator: (value) => value == 'Select Error Type'
                              ? 'Please select an error type'
                              : null,
                        ),
                        SizedBox(height: 20),
                        DropdownButtonFormField<String>(
                          value: _specificError,
                          onChanged: (String? newValue) {
                            setState(() {
                              _specificError = newValue!;
                            });
                          },
                          items: _specificErrorOptions.map((option) {
                            return DropdownMenuItem<String>(
                              value: option,
                              child: Text(option),
                            );
                          }).toList(),
                          validator: (value) => value == 'Select Specific Error'
                              ? 'Please select a specific error'
                              : null,
                        ),
                        SizedBox(height: 20),
                        TextFormField(
                          decoration: InputDecoration(
                            labelText: 'Message',
                            labelStyle: TextStyle(color: Colors.black),
                            enabledBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.black),
                            ),
                            focusedBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.black),
                            ),
                          ),
                          onSaved: (value) => _message = value!,
                          validator: (value) => value == null || value.isEmpty
                              ? 'Please enter your message'
                              : null,
                        ),
                        SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: _handleSubmit,
                          child: Text('Submit'),
                          style: ElevatedButton.styleFrom(
                            foregroundColor: Colors.white,
                            backgroundColor: Color(0xFF4b39ef),
                            padding: EdgeInsets.symmetric(
                                horizontal: 24,
                                vertical:
                                    12), // Increased padding for better touch target size
                            shape: RoundedRectangleBorder(
                              borderRadius:
                                  BorderRadius.circular(5), // Rounded corners
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
        ],
      ),
      bottomSheet: isModalOpen
          ? AlertModal(
              message: modalMessage,
              onClose: () => setState(() => isModalOpen = false))
          : null,
    );
  }
}
