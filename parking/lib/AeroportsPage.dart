import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class AeroportsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Aeroports',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Color(0xFF4b39ef),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              // Aéroport de Sfax-Thyna
              Container(
                height: MediaQuery.of(context).size.height * 0.35,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage(
                        'https://lh3.googleusercontent.com/p/AF1QipPtFJ2dRfydrA_x9hI_e_PrfPWpxe3eYsUeXyhW=s1360-w1360-h1020'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              SizedBox(height: 10),
              Text(
                'Aéroport de Sfax-Thyna',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              Text(
                'Aéroport de Sfax-Thyna is the main international airport serving Sfax, Tunisia. It is located 10 km southwest of Sfax city center. The airport is named after Habib Bourguiba, the first President of Tunisia. It handles both domestic and international flights.',
                style: TextStyle(fontSize: 16),
              ),
              SizedBox(height: 20),
              Center(
                child: ElevatedButton(
                  onPressed: () => _launchMapsUrl(34.717953, 10.690972),
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.white,
                    backgroundColor: Color(0xFF4b39ef),
                  ),
                  child: Text('Go to Aéroport de Sfax-Thyna'),
                ),
              ),
              SizedBox(height: 40),
              // Aéroport de Djerba Zarzis
              Container(
                height: MediaQuery.of(context).size.height * 0.35,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage(
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEqEUlFTJpWvaPsCH2Smh4qyISgZYcM8aJ-w&usqp=CAU'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              SizedBox(height: 10),
              Text(
                'Aéroport de Djerba Zarzis',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              Text(
                'Aéroport de Djerba Zarzis is an international airport located on the island of Djerba, Tunisia. It is the main airport serving the island of Djerba. The airport is named after Zarzis, the ancient name of the island. It handles both domestic and international flights.',
                style: TextStyle(fontSize: 16),
              ),
              SizedBox(height: 20),
              Center(
                child: ElevatedButton(
                  onPressed: () => _launchMapsUrl(33.875, 10.775),
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.white,
                    backgroundColor: Color(0xFF4b39ef),
                  ),
                  child: Text('Go to Aéroport de Djerba Zarzis'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _launchMapsUrl(double lat, double lng) async {
    final url =
        'https://www.google.com/maps/dir/?api=1&destination=$lat,$lng&travelmode=driving';
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}
