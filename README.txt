HAMZA HUSSAIN — PERSONAL PORTFOLIO
===================================

FILES
- index.html: page structure and content
- style.css: responsive light-first design, dark mode, logo and animations
- script.js: navigation, theme switch, modal, certificate preview and contact form
- profile.jpg: your supplied profile photo
- certificate-digital.jpg: Digital Skills certificate (AI Tools, Freelancing, Digital Media Marketing)
- certificate-excel.jpg: Microsoft Excel certificate
- certificate-python.jpg: 30 Days Python Micro Course certificate

OPEN LOCALLY
1. Extract the ZIP.
2. Open this folder in VS Code.
3. Run index.html with Live Server.
4. Keep all image files in the same folder as index.html.

PUBLISH
Upload the contents of this folder to the root of your GitHub Pages repository.
Do not rename the image files unless you also update the matching HTML paths.

FUNCTIONALITY / HONEST LIMITATIONS
- Default appearance is Light Mode. The theme button switches to Dark Mode.
- Prime Dealer opens a centered popup with the supplied WhatsApp Channel and Facebook Page links.
- WhatsApp, LinkedIn and Facebook links are connected.
- Instagram and TikTok official-style icons are displayed but their profile URLs have not been supplied, so they are not clickable.
- The contact form opens the visitor's email app with a prefilled message. It does not store messages in a database or send them through a server.
- There is no admin dashboard, backend database, blog CMS or real visitor counter in this static version.
- Certificate images open in a larger preview when clicked.
- HK Food House card links to the live website. Features listed are limited to details previously discussed.

Additional logo image files used in Step 2: logo-facebook.png, logo-whatsapp.jpg, logo-linkedin.png, logo-tiktok.png, logo-web.png, logo-python.jpg, logo-canva.jpg, logo-digital-marketing.png, logo-office.jpg, logo-meta.jpg. Keep these files in the same folder as index.html.


ADMIN LOGIN SETUP
- Admin Login is a small link in the existing footer.
- The login uses Firebase Authentication Email/Password.
- The configured owner UID is checked in admin.js. Do not change it unless you intentionally change the owner account.
- Keep Firestore Rules restricted to /portfolio/{document} writes for this UID.
- Add your deployed GitHub Pages domain under Firebase Authentication > Settings > Authorized domains.
- This build provides owner authentication only. It does not yet provide a content editor or publish edited page content.
- Never put a Firebase service-account private key in browser files.

ADMIN DASHBOARD UPDATE
- Owner Dashboard includes text fields for Home, About, Education, Skills, Projects and Contact.
- Changes are stored in Firestore at portfolio/content and loaded for public visitors.
- Firebase Authentication owner UID is checked before saving.
- Confirm Firestore Rules allow public reads and owner-only writes under /portfolio/{document}.
- Add the deployed site domain under Firebase Authentication > Settings > Authorized domains.

- Admin Dashboard includes WhatsApp phone number editing. Enter international digits only, e.g. 923XXXXXXXXX (no +, spaces, or dashes). Saving updates all wa.me phone links and the Contact display.


DYNAMIC CONTENT MANAGEMENT (NO FIREBASE STORAGE)
- Skills, projects, certificates, and education can be added, edited, and deleted in the Owner Dashboard.
- This build stores item metadata and public image URLs in the existing Firestore portfolio/content document.
- To add an image, first upload it into this GitHub repository, then paste its public raw image URL into the matching image URL field.
- Firebase Storage is not used, so no Firebase Storage Blaze upgrade is required for this image-link workflow.
- Existing Firestore rules for /portfolio/{document} allow public reads and owner-only writes to this document. Keep the owner UID check unchanged.
