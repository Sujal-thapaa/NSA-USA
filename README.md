#Hosted in https://nsa-usa.vercel.app/

# NSA Network Website

Discover and connect with Nepali Student Associations (NSA) across American universities. This site provides searchable listings, an interactive map with chapter pins, event discovery with AI-powered search, a donation portal (Stripe), and Supabase authentication.

## Features

### 🏠 **Home Page**
- Hero section with animated statistics
- Floating visual elements
- Quick access to search and map features
- Call-to-action buttons

### 🔍 **Advanced Search & Filtering**
- Real-time search by university name, NSA name, or location
- State-based filtering
- Multiple sorting options (Name A-Z, Name Z-A, State, Social Media Count)
- Dropdown autocomplete for universities

### 📊 **Multiple View Modes**
- **Grid View**: Card-based layout with social media links
- **List View**: Compact list format for easy scanning
- **Map View**: Interactive map showing NSA locations across the US

### 🗺️ **Interactive Map**
- Geographic visualization of NSA chapters with pins (Leaflet)
- Automatic geocoding and local caching
- Click markers for details and social links
- Responsive map controls

### 📱 **Social Media Integration**
- Direct links to all social platforms:
  - Instagram
  - Facebook
  - YouTube
  - TikTok
  - LinkedIn
  - Twitter/X
  - Discord
  - GroupMe
  - LinkTree
  - Website

### 📈 **Statistics Dashboard**
- Total number of universities
- Number of states covered
- Total NSA chapters
- Real-time updates based on data

### 🏆 **Popular Universities Section**
- Highlights most active NSA chapters
- Based on social media presence
- Quick access to top communities

### 📝 **NSA Submission Form**
- Modal-based submission interface
- Form validation
- Contact information collection
- Social media link submission

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Smooth animations and transitions
- Modern color scheme and typography
- Accessibility features

## Technical Stack

- HTML5, CSS3, JavaScript (ES6+)
- Leaflet.js + OpenStreetMap tiles (maps)
- Nominatim (geocoding, client-side)
- Font Awesome (icons), Google Fonts (Inter)
- Supabase JS (Auth + DB)
- Stripe.js (donation demo)
- Hugging Face Zero-Shot Classification API (AI search)

## File Structure

```
NSA-Website/
├── index.html
├── home.html
├── search.html
├── chapter-map.html
├── ai-search.html
├── donation.{html,css,js}
├── events.{html,css,js}
├── news.{html,css,js}
├── mentorship.{html,js}
├── resources.{html,css,js}
├── scholarships.{html,js}
├── login.{html,css,js}
├── register.html
├── profile.html
├── settings.html
├── supabase.js
├── nav-updater.js
├── styles.css
├── chapter-map.css
├── nsa_data.json
└── stripe-demo/
```

## Data Structure

The website loads NSA data from `nsa_data.json` with the following structure:

```json
{
  "name": "NSA Chapter Name",
  "university": "University Name",
  "location": "City, State",
  "email": "contact@email.com",
  "phone": "+1-234-567-8900",
  "president": "President Name",
  "instagram": "https://instagram.com/...",
  "facebook": "https://facebook.com/...",
  "youtube": "https://youtube.com/...",
  "tiktok": "https://tiktok.com/...",
  "linkedin": "https://linkedin.com/...",
  "twitter": "https://twitter.com/...",
  "discord": "https://discord.com/...",
  "groupme": "https://groupme.com/...",
  "linktree": "https://linktr.ee/...",
  "website": "https://website.com/..."
}
```

## Key Features

### Search Functionality
- Real-time filtering as you type
- Multiple search criteria (university, NSA name, location)
- State-based filtering
- Smart sorting options

### Map Integration
- Interactive map using Leaflet.js
- Automatic geocoding of locations
- Popup information for each NSA
- Responsive map controls

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Adaptive layouts

### Performance
- Lazy loading of map markers
- Efficient data filtering
- Optimized animations
- Minimal dependencies

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Setup & Run

Static frontend requires serving over HTTP (not file://). Choose one:

```bash
# Option A: Python
python3 -m http.server 5500
# open http://localhost:5500/NSA-Website/index.html

# Option B: Node serve
npx serve -l 5500

# Option C: VS Code Live Server
# Right-click index.html → Open with Live Server
```

Entry pages:

- `auth-index.html` (Google login)
- `home.html` (landing)
- `search.html` (Find NSA)
- `chapter-map.html` (Interactive Map)
- `ai-search.html` (Global AI search)

## Customization

### Adding New Features
- Extend the `NSAWebsite` class in `script.js`
- Add new CSS classes in `styles.css`
- Update the HTML structure in `index.html`

### Styling
- Modify CSS custom properties in `:root`
- Update color schemes and typography
- Adjust animations and transitions

### Data Management
- Update `nsa_data.json` with new entries
- Modify data structure as needed
- Add new social media platforms

## Dependencies & Tools

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- UI: Font Awesome, Google Fonts
- Maps: Leaflet.js, OpenStreetMap tiles, Nominatim (geocoding)
- Auth/DB: Supabase JavaScript SDK
- AI: Hugging Face Inference API (Zero-Shot Classification)
- Payments: Stripe.js (frontend), Node.js + Express demo in `stripe-demo/`

Stripe demo backend:

```bash
cd stripe-demo
npm install
export STRIPE_SECRET_KEY=sk_test_...
npm run dev   # or npm start
```

## Team

- Team Lead: Sujal Thapa — Full Stack & AI
- Sandhya Rimal — Backend & Presentation
- Ankit Devkota — Frontend

## License

Internal project for the NSA Network / FUSN initiative.

## Support

For questions or support, contact:
- Email: contact@nsanetwork.org
- GitHub Issues: [Repository Issues]

---

Built with ❤️ for the Nepali student community in America. 