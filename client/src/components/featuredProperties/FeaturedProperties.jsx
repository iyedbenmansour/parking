import "./featuredProperties.css";

const FeaturedProperties = () => {
  return (
    <div className="appPromotion">
      <h1 className="promotionTitle">Download Our Parking App Today!</h1>
      <div className="appFeatures">
        <div className="appFeature">
          <img
            src="easeofuse.png"
            alt="Ease of Use"
            className="appFeatureIcon"
          />
          <h2>Ease of Use</h2>
          <p>Find parking in seconds and book directly from your phone.</p>
        </div>
        <div className="appFeature">
          <img
            src="update.png"
            alt="Real-Time Updates"
            className="appFeatureIcon"
          />
          <h2>Real-Time Updates</h2>
          <p>Get instant notifications for price drops and availability changes.</p>
        </div>
        <div className="appFeature">
          <img
            src="card.png"
            alt="Secure Payment"
            className="appFeatureIcon"
          />
          <h2>Secure Payment</h2>
          <p>Pay for parking easily and securely within the app.</p>
        </div>
        <div className="appFeature">
          <img
            src="service.png"
            alt="Customer Support"
            className="appFeatureIcon"
          />
          <h2>Customer Support</h2>
          <p>Access  24/7 support for any issues or questions you may have.</p>
        </div>
      </div>
      <div className="appDownloadButtons">
        <a href="https://play.google.com/store/apps/details?id=com.example.parkingapp" target="_blank" rel="noopener noreferrer">
          <img src="android.png" alt="Download on Google Play" className="appStoreBadge" />
        </a>
        <a href="https://apps.apple.com/us/app/example-parking-app/id123456789" target="_blank" rel="noopener noreferrer">
          <img src="apple.png" alt="Download on the App Store" className="appStoreBadge" />
        </a>
      </div>
    </div>
  );
};

export default FeaturedProperties;
