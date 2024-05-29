import 'package:flutter/material.dart';
import 'package:parking/AeroportsPage.dart';
import 'package:parking/BookingPage.dart';
import 'package:parking/ContactUsPage.dart';
import 'package:parking/HelpPage.dart';

class CustomDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding:
            EdgeInsets.zero, 
        children: <Widget>[
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Color(0xFF4b39ef), 
            ),
            child: Text(
              'Navigation',
              style: TextStyle(color: Colors.white),
            ), 
          ),
          ListTile(
            leading: Icon(Icons.book),
            title: const Text('Reservation'), 
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => BookingPage()),
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.airport_shuttle), 
            title: const Text(
              'Aeroports',
            ), //
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => AeroportsPage()),
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.contact_phone),
            title: const Text('Contact Us'), 
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ContactUsPage()),
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.help),
            title: const Text('Help'), 
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => HelpPage()),
              );
            },
          ),
        ],
      ),
    );
  }
}
