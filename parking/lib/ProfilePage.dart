import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfilePage extends StatefulWidget {
  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage>
    with SingleTickerProviderStateMixin {
  final storage = FlutterSecureStorage();
  Map<String, dynamic> user = {};
  List<dynamic> bookings = [];
  List<dynamic> contacts = [];
  bool isLoading = true;
  TabController? _tabController;

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController?.dispose();
    super.dispose();
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
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Card(
                    elevation: 4.0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome ${user['fullname'] ?? ''}',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 8.0),
                          Text(
                            'Email: ${user['email'] ?? ''}',
                            style: TextStyle(fontSize: 16),
                          ),
                          SizedBox(height: 8.0),
                          Text(
                            'Phone Number: ${user['phoneNumber'] ?? ''}',
                            style: TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                TabBar(
                  controller: _tabController,
                  tabs: [
                    Tab(text: 'Reservation History'),
                    Tab(text: 'Contact Us History'),
                  ],
                  indicatorColor: Colors.deepPurple,
                  labelColor: Colors.deepPurple,
                  unselectedLabelColor: Colors.grey,
                ),
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildReservationList(),
                      _buildContactList(),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildReservationList() {
    return ListView(
      children: bookings
          .map((booking) => Card(
                margin: EdgeInsets.all(10.0),
                child: ListTile(
                  contentPadding: EdgeInsets.all(10.0),
                  title: Text(
                    booking['title'],
                    style: TextStyle(color: Colors.black87, fontSize: 18),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Airport: ${booking['carModel']}'),
                      Text('License Plate: ${booking['licensePlate']}'),
                      Text(
                          'Booking Start Date: ${DateTime.parse(booking['bookingStartDate']).toLocal().toString().split(' ')[0]}'),
                      Text(
                          'Booking End Date: ${DateTime.parse(booking['bookingEndDate']).toLocal().toString().split(' ')[0]}'),
                      Text('Price: ${booking['price']}'),
                    ],
                  ),
                  trailing: IconButton(
                    icon: Icon(Icons.delete, color: Colors.red),
                    onPressed: () => _deleteBooking(booking['_id']),
                  ),
                ),
              ))
          .toList(),
    );
  }

  Widget _buildContactList() {
    return ListView(
      children: contacts
          .map((contact) => Card(
                margin: EdgeInsets.all(10.0),
                child: ListTile(
                  contentPadding: EdgeInsets.all(10.0),
                  title: Text(
                    contact['message'],
                    style: TextStyle(color: Colors.black87, fontSize: 18),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Email: ${contact['email']}'),
                      Text('Error Type: ${contact['errorType']}'),
                      Text('Specific Error: ${contact['specificError']}'),
                      Text(
                          'Created At: ${DateTime.parse(contact['createdAt']).toLocal().toString().split(' ')[0]}'),
                    ],
                  ),
                  trailing: IconButton(
                    icon: Icon(Icons.delete, color: Colors.red),
                    onPressed: () => _deleteContact(contact['_id']),
                  ),
                ),
              ))
          .toList(),
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
