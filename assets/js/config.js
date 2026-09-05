/* ==========================================================================
   STRATIQ CLOUD — EmailJS configuration
   --------------------------------------------------------------------------
   Every form on this site (Contact, Job Support, Careers) is delivered to your
   inbox through EmailJS. Fill in the three values below ONCE and every form on
   every page starts working.

   HOW TO GET THE THREE VALUES  (free plan = 200 emails/month, no card needed)
   --------------------------------------------------------------------------
   1. Sign up at https://dashboard.emailjs.com  using  satyamt37@gmail.com
   2. Email Services  →  Add New Service  →  Gmail  →  Connect Account
         (authorise satyamt37@gmail.com)     →  copy the  SERVICE ID
   3. Email Templates →  Create New Template →  paste the template shown in
         README.md   →  Save   →  copy the  TEMPLATE ID
   4. Account → General → copy the  PUBLIC KEY
   5. Paste all three below, save the file, commit + push. Done.

   IMPORTANT: in your EmailJS template, set the "To Email" field to
              satyamt37@gmail.com   (or use the {{to_email}} variable).

   Until these are filled in, the forms stay usable: they fall back to opening
   the visitor's own email client with the whole enquiry pre-written, so no
   lead is ever lost.
   ========================================================================== */

window.STRATIQ = {
  emailjs: {
    publicKey : "YOUR_PUBLIC_KEY",
    serviceId : "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID"
  },

  /* Where enquiries land. Also used for the mailto fallback. */
  inbox: "satyamt37@gmail.com",

  /* Shown across the site. Change once, updates the JS-driven bits. */
  company: "Stratiq Cloud"
};
