import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:parking/ForgetPasswordPage.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart'; // Import SharedPreferences
import 'package:parking/AlertModal.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool isModalOpen = false;
  String modalMessage = '';

  Future<void> handleLogin() async {
    final String email = emailController.text;
    final String password = passwordController.text;

    try {
      final response = await http.post(
        Uri.parse('http://localhost:5000/api/login'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['user'] != null) {
          // Store the token
          SharedPreferences prefs = await SharedPreferences.getInstance();
          await prefs.setString(
              'token', data['user']); // Assuming 'user' contains the token

          setState(() {
            modalMessage = "Logged in successfully.";
            isModalOpen = true;
          });
          Future.delayed(Duration(seconds: 2), () {
            Navigator.pushReplacementNamed(context, '/home');
            setState(() {
              isModalOpen = false;
            });
          });
        }
      } else {
        setState(() {
          modalMessage = "Wrong credentials.";
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

  void navigateToRegister() {
    Navigator.pushNamed(context, '/register');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFF4b39ef),
        title: Text('Login', style: TextStyle(color: Colors.white)),
        elevation: 0.0,
      ),
      body: Stack(
        children: <Widget>[
          SafeArea(
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
                      TextFormField(
                        controller: emailController,
                        decoration: InputDecoration(
                          labelText: 'Email',
                          enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: Color(0xFF4b39ef), width: 2.0),
                          ),
                          border: OutlineInputBorder(),
                          fillColor: Colors.white,
                          filled: true,
                          prefixIcon: Icon(Icons.email),
                          hintText: 'Enter your email',
                        ),
                      ),
                      SizedBox(height: 20),
                      TextFormField(
                        controller: passwordController,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: Color(0xFF4b39ef), width: 2.0),
                          ),
                          border: OutlineInputBorder(),
                          fillColor: Colors.white,
                          filled: true,
                          prefixIcon: Icon(Icons.lock),
                          hintText: 'Enter your password',
                        ),
                        obscureText: true,
                      ),
                      SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: handleLogin,
                        child: Text('Log In',
                            style: TextStyle(color: Colors.white)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFF4b39ef),
                          padding: EdgeInsets.symmetric(
                              horizontal: 24, vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(5),
                          ),
                        ),
                      ),
                      SizedBox(height: 10),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => ForgetPasswordPage()),
                          );
                        },
                        child: Text('Forgot Password?',
                            style: TextStyle(color: Color(0xFF4b39ef))),
                      ),
                      SizedBox(height: 20),
                      TextButton(
                        onPressed: navigateToRegister,
                        child: Text("I don't have an account",
                            style: TextStyle(color: Color(0xFF4b39ef))),
                      ),
                    ],
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