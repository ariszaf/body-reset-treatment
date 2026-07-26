/**
 * Production error logger (invariant — ships with the starter)
 * Catches: JS errors, form failures, image load failures, third-party script failures
 * Sends to: webhook URL (Discord/Slack/Google Sheets) if configured, otherwise console only
 */

interface ErrorLog {
  type: 'js_error' | 'form_error' | 'image_error' | 'script_error' | 'unhandled_rejection';
  message: string;
  url: string;
  timestamp: string;
  userAgent: string;
  details?: string;
}

const WEBHOOK_URL = import.meta.env.PUBLIC_ERROR_WEBHOOK || '';

function sendLog(log: ErrorLog) {
  console.error(`[${log.type}]`, log.message, log.details || '');

  if (!WEBHOOK_URL) return;

  // Fire and forget — never block UI
  navigator.sendBeacon?.(WEBHOOK_URL, JSON.stringify(log))
    || fetch(WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify(log),
      keepalive: true
    }).catch(() => {});
}

// 1. Global JS errors
window.onerror = (msg, source, line, col, error) => {
  sendLog({
    type: 'js_error',
    message: String(msg),
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    details: `${source}:${line}:${col} ${error?.stack || ''}`
  });
};

// 2. Unhandled promise rejections (form submits, fetch calls)
window.onunhandledrejection = (event) => {
  sendLog({
    type: 'unhandled_rejection',
    message: String(event.reason),
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    details: event.reason?.stack || ''
  });
};

// 3. Image load failures
document.addEventListener('error', (e) => {
  const target = e.target as HTMLElement;
  if (target.tagName === 'IMG') {
    sendLog({
      type: 'image_error',
      message: `Image failed to load: ${(target as HTMLImageElement).src}`,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      details: (target as HTMLImageElement).alt || 'no alt text'
    });
  }
  // 4. Script load failures (analytics, maps, fonts)
  if (target.tagName === 'SCRIPT') {
    sendLog({
      type: 'script_error',
      message: `Script failed to load: ${(target as HTMLScriptElement).src}`,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
  }
}, true); // capture phase — catches errors before they bubble

// 5. Form submission monitoring
export function logFormError(formName: string, error: string) {
  sendLog({
    type: 'form_error',
    message: `Form "${formName}" failed: ${error}`,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });
}
