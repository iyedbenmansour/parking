import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DateSelect extends StatelessWidget {
  final DateTime? startDate;
  final DateTime? endDate;
  final VoidCallback onStartDateSelected;
  final VoidCallback onEndDateSelected;
  final VoidCallback onBookTapped;

  const DateSelect({
    required this.startDate,
    required this.endDate,
    required this.onStartDateSelected,
    required this.onEndDateSelected,
    required this.onBookTapped,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 20),
          child: Text(
            'Choose your parking start and end dates',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.normal,
              color: Colors.black,
            ),
          ),
        ),
        SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: Text(
                startDate == null
                    ? 'Select start date'
                    : DateFormat('yyyy-MM-dd').format(startDate!),
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
            SizedBox(width: 10),
            IconButton(
              icon: Icon(Icons.calendar_today),
              onPressed: onStartDateSelected,
            ),
          ],
        ),
        SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: Text(
                endDate == null
                    ? 'Select end date'
                    : DateFormat('yyyy-MM-dd').format(endDate!),
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
            SizedBox(width: 10),
            IconButton(
              icon: Icon(Icons.calendar_today),
              onPressed: onEndDateSelected,
            ),
          ],
        ),
        SizedBox(height: 20),
        Center(
          child: ElevatedButton(
            onPressed: onBookTapped,
            child: Text('Book'),
          ),
        ),
      ],
    );
  }
}