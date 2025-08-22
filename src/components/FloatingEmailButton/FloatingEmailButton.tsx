import styles from './FloatingEmailButton.module.css'
import { useState, useRef } from 'react'
import { Mail } from 'lucide-react'

export default function FloatingEmailButton() {
  const [open, setOpen] = useState(false)
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showPopup = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    setOpen(true)
  }

  const hidePopup = () => {
    hideTimeout.current = setTimeout(() => setOpen(false), 750) // 1.8s delay
  }

  return (
    <div
      className={`${styles.floatingEmailWrapper}${open ? ' ' + styles.open : ''}`}
      onMouseEnter={showPopup}
      onMouseLeave={hidePopup}
      onFocus={showPopup}
      onBlur={hidePopup}
      tabIndex={0}
      aria-label="Contact Ella by email"
    >
      <button
        className={styles.floatingEmailBtn}
        onClick={() => window.open('mailto:ellajdemarest@gmail.com')}
        aria-label="Send email to Ella"
      >
        <Mail size={28} />
      </button>
      <div className={styles.floatingEmailPopup}>
        <span className={styles.floatingEmailPopupLine}>Want to talk?</span>
        <span className={styles.floatingEmailPopupAccent}>Send me an email!</span>
      </div>
    </div>
  )
}
