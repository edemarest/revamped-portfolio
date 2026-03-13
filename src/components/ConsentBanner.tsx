import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
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
        <Cookie className={styles.icon} size={24} />
        <p className={styles.text}>
          I am collecting simple location data so I can experiment with Netlify functions. Allow cookies?
        </p>
        <div className={styles.buttons}>
          <button onClick={handleAccept} className={styles.acceptBtn}>
            Allow
          </button>
          <button onClick={handleReject} className={styles.rejectBtn}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
