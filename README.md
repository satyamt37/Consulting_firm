# Stratiq Cloud — consulting firm website

A complete, responsive, dependency-free website for an IT consulting firm delivering
**Salesforce, Snowflake, Oracle, AI (Deft AI), Java, Python, PHP, React, web development
and SEO** — headquartered in the United States with delivery centres in India.

**Live site:** https://satyamt37.github.io/Consulting_firm/

---

## ⚡ First thing to do: switch on the contact form (10 minutes)

Every form on this site sends to your inbox through **EmailJS**. It needs three values
from your EmailJS account. Until you add them, forms fall back to opening the visitor's
own email client with the enquiry pre-written — so nothing is lost, but you want the
real thing.

### Step 1 — create the account
Sign up at **https://dashboard.emailjs.com** using **satyamt37@gmail.com**.
The free plan allows 200 emails a month and needs no card.

### Step 2 — connect Gmail  →  get your **Service ID**
`Email Services` → `Add New Service` → **Gmail** → `Connect Account` →
authorise **satyamt37@gmail.com** → copy the **Service ID** (looks like `service_ab12cde`).

### Step 3 — create the template  →  get your **Template ID**
`Email Templates` → `Create New Template`.

Set the fields at the top of the template like this:

| Field       | Value                                        |
|-------------|----------------------------------------------|
| **To Email**   | `satyamt37@gmail.com`                     |
| **From Name**  | `{{from_name}}`                           |
| **Reply To**   | `{{reply_to}}`                            |
| **Subject**    | `{{subject}}`                             |

Then paste this into the template **Content** box:

```
New {{form_type}} from the website

Name        : {{from_name}}
Email       : {{from_email}}
Phone       : {{phone}}
Company     : {{company}}
Location    : {{country}}

Capability  : {{service}}
Engagement  : {{engagement}}
Budget      : {{budget}}
Timeline    : {{timeline}}
Role        : {{role}}

Message
-------
{{message}}

---
Full submission
{{details}}

Page        : {{page_url}}
Submitted   : {{submitted_at}}
```

Save, then copy the **Template ID** (looks like `template_xy34zab`).

### Step 4 — get your **Public Key**
`Account` → `General` → copy the **Public Key**.

### Step 5 — paste all three into the site
Open **`assets/js/config.js`** and replace the placeholders:

```js
window.STRATIQ = {
  emailjs: {
    publicKey : "your_public_key_here",
    serviceId : "service_ab12cde",
    templateId: "template_xy34zab"
  },
  inbox: "satyamt37@gmail.com",
  company: "Stratiq Cloud"
};
```

Commit and push. Send yourself a test enquiry from the live site — it should land in
**satyamt37@gmail.com** within a few seconds.

> **Is it safe to put the public key in the code?** Yes. EmailJS public keys are designed
> to be exposed in the browser. To stop other sites from using your quota, turn on
> **Account → Security → Use allowed domains** and add `satyamt37.github.io`.

---

## Where the forms are

| Page | Form | Lands in your inbox as |
|------|------|------------------------|
| `contact.html` | Main enquiry form (capability, engagement model, budget, timeline) | `Website enquiry — <name>` |
| `careers.html` | Job application form | `Job application — <name>` |

Both forms include client-side validation, a honeypot field that silently drops bots,
an inline success and error state, and a mailto fallback if EmailJS is ever unreachable.

Deep links pre-select the engagement type, e.g.
`contact.html?intent=job-support`, `?intent=freelance`, `?intent=project`,
`?intent=pod`, `?intent=staffing`, `?intent=ai`.

---

## Pages

| File | What it covers |
|------|----------------|
| `index.html` | Home — hero, 9 capabilities, platform tabs, Deft AI, 5 engagement models, process, industries, case study teasers, offices, testimonials, FAQ |
| `services.html` | Full capability catalogue: Salesforce, Snowflake, Oracle, AI, data, Java/Python/PHP/React, cloud & DevOps, web & SEO, QA |
| `ai-solutions.html` | The Deft AI practice — six types of AI work, the four-stage method, accelerators, responsible-AI commitments |
| `engagement.html` | Projects, dedicated pods, staff augmentation, **job support**, **freelance projects**, and the **rate card** |
| `industries.html` | Healthcare, BFSI, retail, manufacturing, technology, professional services |
| `work.html` | Three long-form case studies plus six short engagements |
| `about.html` | Story, six commitments, structure, all four offices, security & compliance |
| `careers.html` | Why join, eight open roles, hiring process, application form |
| `contact.html` | Main enquiry form, direct contact details, offices, quick FAQ |
| `legal.html` | Privacy notice, terms of use, cookie notice |
| `404.html` | Branded not-found page (uses absolute paths so it works at any depth) |

---

## Responsive behaviour

Built mobile-first and checked from **320px to 2560px**.

- Fluid type and spacing throughout via `clamp()` — no fixed pixel layouts
- Desktop navigation with hover mega-menus above **1120px**; full-screen drawer below it
- Grids collapse 4 → 2 → 1 column at 1000px and 620px
- All tap targets are at least 44–48px; form inputs use 16px text so iOS never zooms on focus
- Wide tables scroll horizontally inside their own container — the page body never scrolls sideways
- `viewport-fit=cover` plus `100svh` on the 404 page for iPhone notch and dynamic toolbars
- Honours `prefers-reduced-motion` (animations, marquee and counters all stand down)
- Print stylesheet included

---

## Files

```
├── index.html … legal.html      the 10 built pages
├── 404.html                     standalone, absolute paths
├── assets/
│   ├── css/style.css            the entire design system, one file
│   ├── js/config.js             ← your EmailJS keys go here
│   ├── js/site.js               nav, accordions, tabs, reveal, counters, forms
│   └── img/favicon.svg, og.svg  brand mark and social share card
├── robots.txt · sitemap.xml · .nojekyll
```

No build step, no npm install, no framework. Open any `.html` file and it works.
To preview locally: `python -m http.server 8000` then visit http://localhost:8000.

---

## ✏️ Placeholder content to replace with your real details

The site is complete and coherent, but this content was written to be replaced:

| What | Where | Currently |
|------|-------|-----------|
| **Company name** | everywhere | "Stratiq Cloud" — find and replace across `*.html` |
| **US address** | `about.html`, `contact.html`, `index.html`, page head JSON-LD | 2591 Dallas Parkway, Suite 300, Frisco, TX 75034 |
| **US phone** | same files + `assets/js/site.js` | +1 (469) 913-0142 |
| **India addresses** | `about.html`, `contact.html`, `index.html` | Hyderabad, Pune, Bengaluru — building names are generic |
| **Rate card** | `engagement.html#rates` | Indicative USD ranges — set your own before quoting |
| **Case studies** | `work.html` | Realistic but illustrative. Replace with your own engagements |
| **Testimonials** | `index.html` | Anonymised illustrative quotes — swap in real, attributable ones |
| **Statistics** | `index.html`, `about.html` | 120+ engagements, 94% extension rate, etc. |
| **Open roles** | `careers.html` | Eight sample roles |
| **Legal pages** | `legal.html` | Plain-language starting point — have counsel review it |

The India phone number (+91 89594 59494) and the contact email
(satyamt37@gmail.com) are already yours and are live across the site.

---

## Deployment

Hosted on **GitHub Pages** from the `main` branch, root folder. Every push to `main`
republishes within about a minute. `.nojekyll` is present so nothing is filtered out.

To use a custom domain later: add a `CNAME` file containing your domain, point the
domain's DNS at GitHub Pages, then update the `<link rel="canonical">` and Open Graph
URLs in each page's `<head>` plus `sitemap.xml` and `robots.txt`.

---

## Trademarks

Salesforce, Snowflake, Oracle, AWS, Microsoft Azure and other product names are the
trademarks of their respective owners and are referenced here to describe services.
No affiliation or endorsement is implied.
