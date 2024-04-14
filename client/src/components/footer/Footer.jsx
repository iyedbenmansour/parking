import React from 'react';
import './footer.css';

const Footer = () => {
 return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="footer-col">
            <h4>OACA</h4>
            <ul>
              <li><a href="https://www.oaca.nat.tn/web/corporate/oaca">about us</a></li>
              <li><a href="https://www.oaca.nat.tn/web/corporate">our services</a></li>
              <li><a href="https://www.oaca.nat.tn/web/corporate/conformité">privacy policy</a></li>
              <li><a href="https://www.oaca.nat.tn/web/corporate/gouvernance">gouvernance </a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>get help</h4>
            <ul>
              <li><a href="http://localhost:3000/help">FAQ</a></li>
              <li><a href="#">order status</a></li>
              <li><a href="#">payment options</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Utils</h4>
            <ul>
              <li><a href="https://www.oaca.nat.tn/web/corporate/accès-à-l-information">Accès</a></li>
              <li><a href="https://www.oaca.nat.tn/web/corporate/relation-avec-le-citoyen">Client service </a></li>
              <li><a href="https://www.oaca.nat.tn/web/corporate/marche">Job offers</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact us</h4>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
 );
};

export default Footer;
