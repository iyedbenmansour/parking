import 'package:flutter/material.dart';
import 'package:parking/BookingPage.dart';
import 'package:parking/component/CustomAppBar.dart';
import 'package:parking/component/CustomDrawer.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  DateTime? startDate;
  DateTime? endDate;

  Future<void> _selectDate(BuildContext context, bool isStartDate) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: isStartDate ? DateTime.now() : (startDate ?? DateTime.now()),
      firstDate: DateTime.now(),
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      setState(() {
        if (isStartDate) {
          startDate = picked;
        } else {
          endDate = picked;
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(context: context),
      drawer: CustomDrawer(),
      backgroundColor: Color(0xFFF1F4F8),
      body: Column(
        children: <Widget>[
          Container(
            height: MediaQuery.of(context).size.height * 0.35,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(
                    'data:image/png;base64,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'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Start Date',
                    border: OutlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF4B39EF)),
                    ),
                    prefixIcon: Icon(Icons.date_range,
                        color: Color(0xFF4B39EF)), // Added icon
                  ),
                  controller: TextEditingController(
                      text: startDate?.toString().substring(0, 10)),
                  onTap: () => _selectDate(context, true),
                ),
                SizedBox(height: 20),
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'End Date',
                    border: OutlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF4B39EF)),
                    ),
                    prefixIcon: Icon(Icons.date_range,
                        color: Color(0xFF4B39EF)), // Added icon
                  ),
                  controller: TextEditingController(
                      text: endDate?.toString().substring(0, 10)),
                  onTap: () => _selectDate(context, false),
                ),
                SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 58.0,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      foregroundColor: Colors.white,
                      backgroundColor: Color(0xFF4B39EF),
                      textStyle: TextStyle(fontSize: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4.0),
                      ),
                    ),
                    onPressed: () {
                      if (startDate == null ||
                          startDate!.isBefore(DateTime.now())) {
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                          content: Text("Start date must be today or later."),
                        ));
                        return;
                      }
                      if (endDate == null || endDate!.isBefore(startDate!)) {
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                          content: Text("End date must be after start date."),
                        ));
                        return;
                      }
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => BookingPage(
                                startDate: startDate, endDate: endDate)),
                      );
                    },
                    child: Text('Search'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
