import 'package:flutter/material.dart';

class AlertModal extends StatelessWidget {
  final String message;
  final VoidCallback onClose;

  AlertModal({required this.message, required this.onClose});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Colors.white, // White background
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15), // Rounded corners
      ),
      title: Text(
        'Alert',
        style: TextStyle(
          color: Colors.black, // Darker text for better contrast
          fontWeight: FontWeight.bold, // Bold title
          fontSize: 24, // Larger font size for emphasis
        ),
      ),
      content: Text(
        message,
        textAlign: TextAlign.center,
        style: TextStyle(
          fontFamily: 'Open Sans', // Use a modern font
        ),
      ),
      actions: <Widget>[
        TextButton(
          onPressed: onClose,
          child: Text(
            'Close',
            style: TextStyle(
              color: Colors.white, // White text
              fontWeight: FontWeight.bold, // Bold text
            ),
          ),
          style: TextButton.styleFrom(
            backgroundColor: Color(0xFF0071C2), // Blue background
            padding: EdgeInsets.symmetric(
                horizontal: 24,
                vertical: 12), // Increased padding for better touch target size
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(5), // Rounded corners
            ),
          ),
        ),
      ],
    );
  }
}