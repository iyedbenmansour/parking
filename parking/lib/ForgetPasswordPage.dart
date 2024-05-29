import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ForgetPasswordPage extends StatefulWidget {
  @override
  _ForgetPasswordPageState createState() => _ForgetPasswordPageState();
}

class _ForgetPasswordPageState extends State<ForgetPasswordPage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController verificationCodeController =
      TextEditingController();
  final TextEditingController newPasswordController = TextEditingController();
  bool showVerificationForm = false;
  bool showNewPasswordForm = false;
  String message = '';
  bool isModalOpen = false;

  void handleModal(bool isOpen, String message) {
    setState(() {
      isModalOpen = isOpen;
      this.message = message;
    });
    if (isOpen) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Notification'),
          content: Text(message),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
                setState(() {
                  isModalOpen = false;
                });
              },
              child: Text('OK'),
            ),
          ],
        ),
      );
    }
  }

  Future<void> sendVerificationCode() async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:5000/api/sendVerificationCode'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode({'email': emailController.text}),
      );
      final responseData = jsonDecode(response.body);
      if (responseData['message'] == "Verification code sent successfully.") {
        setState(() {
          showVerificationForm = true;
        });
        handleModal(true,
            "Verification code sent successfully. Please check your email.");
      } else {
        handleModal(true, "Failed to send verification code.");
      }
    } catch (error) {
      print("Error sending verification code: $error");
      handleModal(
          true, "An error occurred while sending the verification code.");
    }
  }

  Future<void> handleEmailSubmit() async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:5000/api/checkEmail'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode({'email': emailController.text}),
      );
      final responseData = jsonDecode(response.body);
      if (responseData['exists']) {
        sendVerificationCode();
      } else {
        handleModal(true, "Email not found.");
      }
    } catch (error) {
      print("Error checking email: $error");
      handleModal(true, "An error occurred while checking the email.");
    }
  }

  Future<void> handleVerificationSubmit() async {
    if (verificationCodeController.text.isEmpty) {
      handleModal(true, "Please enter the verification code.");
      return;
    }
    try {
      final response = await http.post(
        Uri.parse('http://localhost:5000/api/verifyCodemobile'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode({
          'email': emailController.text,
          'verificationCode': verificationCodeController.text,
        }),
      );
      final responseData = jsonDecode(response.body);
      if (responseData['verified']) {
        setState(() {
          showVerificationForm = false;
          showNewPasswordForm = true;
        });
        handleModal(
            true, "Verification successful. Please enter your new password.");
      } else {
        handleModal(true, "Verification code is incorrect.");
      }
    } catch (error) {
      print("Error verifying code: $error");
      handleModal(true, "An error occurred while verifying the code.");
    }
  }

  Future<void> handlePasswordUpdate() async {
    if (newPasswordController.text.isEmpty) {
      handleModal(true, "Please enter a new password.");
      return;
    }
    try {
      final response = await http.put(
        Uri.parse(
            'http://localhost:5000/api/forgetpassword/${emailController.text}'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode({'password': newPasswordController.text}),
      );
      final responseData = jsonDecode(response.body);
      if (responseData['message'] == "Password updated successfully") {
        handleModal(true, "Password updated successfully.");
        setState(() {
          showNewPasswordForm = false;
        });
        Navigator.pushNamed(context, '/login');
      } else {
        handleModal(true, "Password update failed.");
      }
    } catch (error) {
      print("Error updating password: $error");
      handleModal(true, "An error occurred while updating the password.");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Forget Password',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Color(0xFF4b39ef),
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                if (!showVerificationForm && !showNewPasswordForm)
                  buildEmailForm(),
                if (showVerificationForm) buildVerificationForm(),
                if (showNewPasswordForm) buildNewPasswordForm(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget buildEmailForm() {
    return buildForm(
      title: "Enter your email",
      controller: emailController,
      buttonText: "Submit",
      onPressed: handleEmailSubmit,
    );
  }

  Widget buildVerificationForm() {
    return buildForm(
      title: "Enter verification code",
      controller: verificationCodeController,
      buttonText: "Verify",
      onPressed: handleVerificationSubmit,
    );
  }

  Widget buildNewPasswordForm() {
    return buildForm(
      title: "Enter new password",
      controller: newPasswordController,
      buttonText: "Update Password",
      onPressed: handlePasswordUpdate,
    );
  }

  Widget buildForm({
    required String title,
    required TextEditingController controller,
    required String buttonText,
    required VoidCallback onPressed,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Text(
          title,
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 10),
        TextField(
          controller: controller,
          decoration: InputDecoration(
            labelText: title,
            border: OutlineInputBorder(),
          ),
        ),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: Color(0xFF4b39ef),
          ),
          child: Text(buttonText),
        ),
        SizedBox(height: 40),
      ],
    );
  }
}
