import { useEffect, useState } from 'react';
import styles from './ConsentBanner.module.css';

export const ConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('analytics-consent');
    if (hasConsent === null) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('analytics-consent', 'true');
    localStorage.setItem('consent-date', new Date().toISOString());
    setShowBanner(false);
    // Reload to trigger tracking
    window.location.reload();
  };

  const handleReject = () => {
    localStorage.setItem('analytics-consent', 'false');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <p className={styles.text}>
          We collect visitor analytics (location, page views) to understand our audience and improve your experience. 
          We do not share your data with third parties.
        </p>
        <div className={styles.buttons}>
          <button onClick={handleAccept} className={styles.acceptBtn}>
            Accept Analytics
          </button>
          <button onClick={handleReject} className={styles.rejectBtn}>
            Reject
          </button>
          <a href="/privacy-policy" className={styles.link}>
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};
