## 2024-02-14 - Content Security Policy Implementation
**Vulnerability:** Lack of Content Security Policy (CSP) headers or meta tags allowed potential XSS and data injection attacks.
**Learning:** Even static applications without backend code can benefit from CSP to prevent execution of malicious scripts injected via compromised local files or reflected XSS if any dynamic inputs were mishandled. The application was already well-structured (no inline scripts/styles), making a strict 'self' policy easy to implement.
**Prevention:** Always include a strict CSP meta tag in `index.html` for static sites. Audit code for inline styles/scripts before applying.
