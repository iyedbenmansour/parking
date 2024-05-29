import 'package:flutter/material.dart';
import 'package:parking/LoginPage.dart';
import 'package:parking/RegisterPage.dart';
import 'package:parking/ProfilePage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final BuildContext context;

  CustomAppBar({required this.context});

  Future<bool> _checkLoginStatus() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    // Check if 'token' is stored in SharedPreferences
    String? token = prefs.getString('token');
    return token != null && token.isNotEmpty;
  }

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Color(0xFF4b39ef),
      title: Text('Home', style: TextStyle(color: Color(0xFFf1f4f8))),
      elevation: 0.0,
      leading: Builder(
        builder: (BuildContext context) {
          return IconButton(
            icon: Icon(Icons.menu, color: Color(0xFFf1f4f8)),
            onPressed: () => Scaffold.of(context).openDrawer(),
            tooltip: MaterialLocalizations.of(context).openAppDrawerTooltip,
          );
        },
      ),
      actions: <Widget>[
        FutureBuilder<bool>(
          future: _checkLoginStatus(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done &&
                snapshot.hasData) {
              bool isLoggedIn = snapshot.data!;
              if (!isLoggedIn) {
                return Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.login, color: Color(0xFFf1f4f8)),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => LoginPage()),
                        );
                      },
                    ),
                    IconButton(
                      icon: Icon(Icons.person_add, color: Color(0xFFf1f4f8)),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => RegisterPage()),
                        );
                      },
                    ),
                  ],
                );
              } else {
                return IconButton(
                  icon: Icon(Icons.account_circle, color: Color(0xFFf1f4f8)),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => ProfilePage()),
                    );
                  },
                );
              }
            } else {
              return Container(); // Show nothing or a loading spinner while checking the login status
            }
          },
        ),
      ],
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}
