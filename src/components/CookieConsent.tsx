import { useState, useEffect } from 'react';

const STORAGE_KEY = 'netwearing-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  }

  function handleReject() {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[998] transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* Banner */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[999] bg-surface border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
        style={{
          animation: 'slideUpCookie 0.4s ease-out',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Text */}
          <div className="flex-1 text-sm text-muted leading-relaxed">
            <p>
              By clicking &ldquo;Accept,&rdquo; you agree to our{' '}
              <a href="#" className="text-linkedin-blue underline hover:text-linkedin-dark cursor-pointer">
                Privacy Statement
              </a>
              ,{' '}
              <a href="#" className="text-linkedin-blue underline hover:text-linkedin-dark cursor-pointer">
                Cookie Notice
              </a>
              , and{' '}
              <a href="#" className="text-linkedin-blue underline hover:text-linkedin-dark cursor-pointer">
                Terms of Use
              </a>
              . Clicking &ldquo;Accept&rdquo; means you consent to the use of cookies and similar
              tracking technologies. Tracking may begin once you navigate away from this page.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setVisible(false)}
              className="px-5 py-2.5 text-sm font-semibold border border-linkedin-blue text-linkedin-blue rounded-md hover:bg-linkedin-light transition-colors cursor-pointer"
            >
              Cookie Settings
            </button>
            <button
              onClick={handleReject}
              className="px-5 py-2.5 text-sm font-semibold bg-linkedin-blue text-white rounded-md hover:bg-linkedin-dark transition-colors cursor-pointer"
            >
              Reject All
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 text-sm font-semibold bg-linkedin-blue text-white rounded-md hover:bg-linkedin-dark transition-colors cursor-pointer"
            >
              Accept All Cookies
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
