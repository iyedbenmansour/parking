
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:parking/AlertModal.dart'; // Ensure this is the correct path

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final TextEditingController fullNameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneNumberController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController cinController = TextEditingController();
  bool isAlertOpen = false;
  String alertMessage = '';

  Future<void> handleRegister() async {
    final String fullName = fullNameController.text;
    final String email = emailController.text;
    final String password = passwordController.text;
    final String phoneNumber = phoneNumberController.text;
    final String cin = cinController.text;

    final newUser = {
      'fullname': fullName,
      'email': email,
      'password': password,
      'phoneNumber': phoneNumber,
      'cin': cin,
      'role': 'user', // Assuming 'role' is required and static for this example
    };

    try {
      final response = await http.post(
        Uri.parse('http://localhost:5000/api/register'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(newUser),
      );

      if (response.statusCode == 200) {
        Navigator.pushReplacementNamed(context, '/login');
      } else {
        setState(() {
          alertMessage =
              "An error occurred during registration. Please try again.";
          isAlertOpen = true;
        });
      }
    } catch (e) {
      print(e);
      setState(() {
        alertMessage =
            "An error occurred during registration. Please try again.";
        isAlertOpen = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFF4b39ef),
        title: Text('Register', style: TextStyle(color: Colors.white)),
        elevation: 0.0,
      ),
      body: SingleChildScrollView(
        child: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Container(
                padding: EdgeInsets.all(20.0),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.8),
                  borderRadius: BorderRadius.circular(10.0),
                  border: Border.all(color: Color(0xFF4b39ef), width: 2.0),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    SizedBox(height: 50),
                    buildTextField(
                        fullNameController, 'Full Name', Icons.person_outline),
                    SizedBox(height: 20),
                    buildTextField(emailController, 'Email', Icons.email),
                    SizedBox(height: 20),
                    buildTextField(
                        phoneNumberController, 'Phone Number', Icons.phone),
                    SizedBox(height: 20),
                    buildTextField(passwordController, 'Password', Icons.lock,
                        isPassword: true),
                    SizedBox(height: 20),
                    buildTextField(cinController, 'Identity Document',
                        Icons.document_scanner),
                    SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: handleRegister,
                      child: Text('Register',
                          style: TextStyle(color: Colors.white)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF4b39ef),
                        padding:
                            EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(5),
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
      bottomSheet: isAlertOpen
          ? AlertModal(
              message: alertMessage,
              onClose: () => setState(() => isAlertOpen = false),
            )
          : null,
    );
  }

  Widget buildTextField(
      TextEditingController controller, String label, IconData icon,
      {bool isPassword = false}) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Color(0xFF4b39ef), width: 2.0),
        ),
        border: OutlineInputBorder(),
        fillColor: Colors.white,
        filled: true,
        prefixIcon: Icon(icon),
        suffixIcon: isPassword ? Icon(Icons.visibility_off) : null,
        hintText: 'Enter your $label',
      ),
      obscureText: isPassword,
    );
  }
}
