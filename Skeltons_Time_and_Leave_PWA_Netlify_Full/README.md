# Skeltons Chemists — Time Booking & Holiday Request (Netlify)

This is a mobile-friendly PWA that lets staff submit **time entries** and **holiday requests**. Submissions are emailed to management using a Netlify Function + SendGrid. Works on Android & iOS; install to home screen.

## Deploy to Netlify
1. Create a new site on Netlify (connect a repo or drag-drop this folder). For Functions to install dependencies, connecting a repo or using Netlify CLI is recommended.
2. In **Site settings → Environment variables**, add:
   - `SENDGRID_API_KEY` = your SendGrid API key
   - `TO_EMAIL` = `patelsa1110@gmail.com`
3. Ensure `netlify.toml` is present and deploy. Netlify will install `@sendgrid/mail` from `package.json` for the Function.
4. Open the site, then **Add to Home Screen** on your device.

## Notes
- If you use **manual file upload**, Netlify may not install function dependencies. Prefer connecting to Git or use Netlify CLI (`netlify deploy`) so Functions get built.
- The API endpoint used by the app is `/.netlify/functions/sendEmail`.
- Change `from` sender in `netlify/functions/sendEmail.js` if you want a custom domain.
