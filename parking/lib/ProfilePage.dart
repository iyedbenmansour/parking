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

      var userResponse = await http.get(Uri.parse('http://localhost:5000/api/user/$email'));
      var bookingResponse = await http.get(Uri.parse('http://localhost:5000/api/bookings?email=$email'));
      var contactResponse = await http.get(Uri.parse('http://localhost:5000/api/contact?email=$email'));

      if (userResponse.statusCode == 200) {
        setState(() {
          user = jsonDecode(userResponse.body)['user'] ?? {};
        });
      }
      if (bookingResponse.statusCode == 200) {
        setState(() {
          bookings = jsonDecode(bookingResponse.body)['bookings'] ?? [];
        });
      }
      if (contactResponse.statusCode == 200) {
        setState(() {
          contacts = jsonDecode(contactResponse.body)['contact'] ?? [];
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
              padding: EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Welcome ${user['fullname'] ?? ''}',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  SizedBox(height: 20.0),
                  _buildUserInfo(),
                  SizedBox(height: 20.0),
                  _buildSection('Reservation history', bookings, _buildBookingItem),
                  SizedBox(height: 20.0),
                  _buildSection('Your tickets', contacts, _buildContactItem),
                ],
              ),
            ),
    );
  }

  Widget _buildUserInfo() {
    return Card(
      elevation: 4.0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15.0)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Your Personal Information', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 10.0),
            Text('Name: ${user['fullname'] ?? ''}'),
            Text('Email: ${user['email'] ?? ''}'),
            Text('Phone Number: ${user['phoneNumber'] ?? ''}'),
            SizedBox(height: 10.0),
            ElevatedButton(
              onPressed: () {
                // Handle edit profile
              },
              child: Text('Edit Profile'),
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white, backgroundColor: Color(0xFF4b39ef), // text color
                elevation: 0, // remove shadow
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, List<dynamic> items, Widget Function(dynamic) itemBuilder) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 10.0),
        ListView.builder(
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          itemCount: items.length,
          itemBuilder: (context, index) {
            return itemBuilder(items[index]);
          },
        ),
      ],
    );
  }

  Widget _buildBookingItem(dynamic booking) {
    return Card(
      elevation: 2.0,
      margin: EdgeInsets.symmetric(vertical: 8.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  booking['title'] ?? '',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: Icon(Icons.delete, color: Colors.red),
                  onPressed: () => _deleteBooking(booking['_id']),
                ),
              ],
            ),
            SizedBox(height: 8.0),
            Text(
              'Booking Dates:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 4.0),
            Text(
              'From: ${_formatDate(booking['bookingStartDate'])}',
            ),
            Text(
              'To: ${_formatDate(booking['bookingEndDate'])}',
            ),
            SizedBox(height: 8.0),
            Text(
              'Car Details:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 4.0),
            Text('Car Model: ${booking['carModel'] ?? ''}'),
            Text('License Plate: ${booking['licensePlate'] ?? ''}'),
            SizedBox(height: 8.0),
            Text(
              'Price: ${booking['price'] ?? ''}',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(String? dateString) {
    if (dateString != null) {
      DateTime date = DateTime.parse(dateString);
      return '${date.day}/${date.month}/${date.year}';
    }
    return '';
  }

  Widget _buildContactItem(dynamic contact) {
    return Card(
      elevation: 2.0,
      margin: EdgeInsets.symmetric(vertical: 8.0),
      child: ListTile(
        title: Text(contact['message'] ?? ''),
        subtitle: Text(contact['createdAt'] ?? ''),
        trailing: IconButton(
          icon: Icon(Icons.delete, color: Colors.red),
          onPressed: () => _deleteContact(contact['_id']),
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
      Navigator.of(context).pushReplacementNamed('/'); // Navigate to home page after logout
    });
  }

  Future<void> _deleteBooking(String id) async {
    try {
      var response = await http.delete(Uri.parse('http://localhost:5000/api/bookings/$id'));
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
      var response = await http.delete(Uri.parse('http://localhost:5000/api/contacts/$id'));
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

void main() {
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    home: ProfilePage(),
  ));
}
