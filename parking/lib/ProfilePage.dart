import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfilePage extends StatefulWidget {
  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final storage = FlutterSecureStorage();
  Map<String, dynamic> user = {};
  List<dynamic> bookings = [];
  List<dynamic> contacts = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    if (token == null) {
      setState(() {
        isLoading = false;
      });
      return;
    }

    try {
      var decodedToken = parseJwt(token);
      String email = decodedToken['email'];

      var userResponse =
          await http.get(Uri.parse('http://localhost:5000/api/user/$email'));
      var bookingResponse = await http
          .get(Uri.parse('http://localhost:5000/api/bookings?email=$email'));
      var contactResponse = await http
          .get(Uri.parse('http://localhost:5000/api/contact?email=$email'));

      if (userResponse.statusCode == 200) {
        setState(() {
          user = jsonDecode(userResponse.body)['user'];
        });
      }
      if (bookingResponse.statusCode == 200) {
        setState(() {
          bookings = jsonDecode(bookingResponse.body)['bookings'];
        });
      }
      if (contactResponse.statusCode == 200) {
        setState(() {
          contacts = jsonDecode(contactResponse.body)['contact'];
        });
      }
    } catch (e) {
      print("Failed to load data: $e");
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Map<String, dynamic> parseJwt(String token) {
    final parts = token.split('.');
    if (parts.length != 3) {
      throw Exception('Invalid token');
    }

    final payload = parts[1];
    var normalized = base64Url.normalize(payload);
    var resp = utf8.decode(base64Url.decode(normalized));
    final payloadMap = json.decode(resp);
    if (payloadMap is! Map<String, dynamic>) {
      throw Exception('Invalid payload');
    }

    return payloadMap;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile', style: TextStyle(color: Colors.white)),
        backgroundColor: Color(0xFF4b39ef),
        actions: [
          IconButton(
            icon: Icon(Icons.exit_to_app, color: Colors.white),
            onPressed: _showLogoutDialog,
          ),
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Center(
                      child: Text('Welcome ${user['fullname'] ?? ''}',
                          style: TextStyle(
                              fontSize: 24, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  Divider(),
                  ...bookings
                      .map((booking) => ListTile(
                            title: Text(booking['title'],
                                style: TextStyle(color: Colors.black87)),
                            subtitle: Text(
                                'From ${booking['bookingStartDate']} to ${booking['bookingEndDate']}',
                                style: TextStyle(color: Colors.grey)),
                            trailing: IconButton(
                              icon: Icon(Icons.delete, color: Colors.red),
                              onPressed: () => _deleteBooking(booking['_id']),
                            ),
                          ))
                      .toList(),
                  Divider(),
                  ...contacts
                      .map((contact) => ListTile(
                            title: Text(contact['message'],
                                style: TextStyle(color: Colors.black87)),
                            subtitle: Text(contact['createdAt'],
                                style: TextStyle(color: Colors.grey)),
                            trailing: IconButton(
                              icon: Icon(Icons.delete, color: Colors.red),
                              onPressed: () => _deleteContact(contact['_id']),
                            ),
                          ))
                      .toList(),
                ],
              ),
            ),
    );
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Logout'),
        content: Text('Are you sure you want to logout?'),
        actions: <Widget>[
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close the dialog
            },
            child: Text('No'),
          ),
          TextButton(
            onPressed: () {
              _logout();
            },
            child: Text('Yes'),
          ),
        ],
      ),
    );
  }

  Future<void> _logout() async {
    await SharedPreferences.getInstance().then((prefs) {
      prefs.remove('token');
      Navigator.of(context)
          .pushReplacementNamed('/'); // Navigate to home page after logout
    });
  }

  Future<void> _deleteBooking(String id) async {
    try {
      var response = await http
          .delete(Uri.parse('http://localhost:5000/api/bookings/$id'));
      if (response.statusCode == 200) {
        setState(() {
          bookings.removeWhere((booking) => booking['_id'] == id);
        });
      }
    } catch (e) {
      print("Error deleting booking: $e");
    }
  }

  Future<void> _deleteContact(String id) async {
    try {
      var response = await http
          .delete(Uri.parse('http://localhost:5000/api/contacts/$id'));
      if (response.statusCode == 200) {
        setState(() {
          contacts.removeWhere((contact) => contact['_id'] == id);
        });
      }
    } catch (e) {
      print("Error deleting contact: $e");
    }
  }
}