import 'package:flutter/material.dart';
import 'package:parking/HomePage.dart';
import 'package:parking/LoginPage.dart';
import 'package:parking/RegisterPage.dart';
import 'package:parking/BookingPage.dart';
import 'package:parking/ProfilePage.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Airport Parking Reservation',
      initialRoute: '/', // Set initial route to HomePage
      routes: {
        '/': (context) => HomePage(), // HomePage as the root route
        '/login': (context) => LoginPage(), // LoginPage
        '/register': (context) => RegisterPage(), // RegisterPage
        '/booking': (context) => BookingPage(), // BookingPage
        '/profile': (context) => ProfilePage(), // ProfilePage
      },
      onUnknownRoute: (settings) {
        return MaterialPageRoute(
            builder: (context) => HomePage()); // Fallback route
      },
    );
  }
}
