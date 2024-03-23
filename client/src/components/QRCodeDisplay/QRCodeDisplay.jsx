// BookingQRCode.jsx
import React from 'react';
import QRCode from 'qrcode.react';

const BookingQRCode = ({ bookingInfo }) => {
  return (
    <div className="qrCodeContainer">
      <QRCode value={bookingInfo} />
    </div>
  );
};

export default BookingQRCode;
