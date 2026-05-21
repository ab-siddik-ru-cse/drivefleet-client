# DriveFleet — Client

Next.js 14 frontend for the DriveFleet car rental platform. Pairs with the **`drivefleet-server`** Express + Better Auth backend.

## 🌐 Live Demo

🔗 [DriveFleet Live Website](https://drivefleet-client-phi.vercel.app/)

---

##  Features

-  **Dual auth via server** — email/password with bcrypt + Google OAuth via Better Auth. After Better Auth confirms sign-in, the server mints a JWT cookie (`df_token`) that protects every API call.
-  **Full car CRUD** — owners list, edit, delete their cars; ownership enforced server-side.
-  **Smart search & filter** — search by car name (server runs MongoDB `$regex`, case-insensitive) and multi-select type filter (server uses `$in`). URL-driven so reloads work.
-  **Booking system** — date pickers, optional driver (+$10/day), special note, live total price. Server runs `$inc` on `bookingCount` for each confirmed booking.
-  **My Bookings dashboard** — summary cards, full history, cancellation.
-  **Theme toggle** — light/dark, persisted to `localStorage`, no flash on first paint.
-  **Framer Motion** — staggered card entry, hover lift, animated modals.
-  **Fully responsive** — desktop tables become mobile cards.
-  **No flash on reload** — root layout fetches user from server during SSR.
-  **Custom 404** — themed "This road leads nowhere".

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS (custom brand palette, dark mode) |
| Animations | Framer Motion |
| Icons | lucide-react |
| Toasts | react-hot-toast |
| API client | Native fetch wrapped in `lib/api.js` (always `credentials: "include"`) |
| Auth | All handled by drivefleet-server (Better Auth + custom JWT cookie) |

>  **No Firebase or MongoDB packages in the client.** All auth and data access goes through the Express server. The client is a pure UI layer.

---

## Folder Structure

```
drivefleet-client/
├── app/
│   ├── (public)/
│   │   ├── page.jsx                      
│   │   ├── login/page.jsx
│   │   ├── register/page.jsx
│   │   └── cars/
│   │       ├── page.jsx                   
│   │       ├── loading.jsx
│   │       └── [id]/
│   │           ├── page.jsx               
│   │           └── CarDetailsClient.jsx   
│   ├── (private)/
│   │   ├── layout.jsx                     
│   │   ├── add-car/page.jsx               
│   │   ├── my-cars/
│   │   │   ├── page.jsx                   
│   │   │   └── [id]/edit/page.jsx        
│   │   └── my-bookings/page.jsx           
│   ├── auth-callback/page.jsx             
│   ├── layout.jsx                         
│   ├── globals.css
│   └── not-found.jsx
├── components/
│   ├── AuthProvider.jsx                   
│   ├── GoogleButton.jsx                 
│   ├── BookingModal.jsx                   
│   ├── CarCard.jsx, CarForm.jsx, ConfirmModal.jsx
│   ├── Navbar.jsx, Footer.jsx, Spinner.jsx
│   ├── ThemeProvider.jsx, ThemeToggle.jsx
│   └── ToastProvider.jsx
└── lib/
    ├── api.js                             
    ├── constants.js                       
    └── validation.js                      
```

---

##  Setup

### 1. Start the server FIRST

This client won't work without `drivefleet-server` running. Follow its README:

```bash
cd ../drivefleet-server
npm install
# Set up .env with MongoDB URI, Better Auth secrets, Google OAuth credentials
npm run dev
```

Server should be live at `http://localhost:5000`.

### 2. Install client

```bash
cd drivefleet-client
npm install
```

### 3. Configure `.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production, set this to your deployed server URL (no trailing slash).

### 4. Run

```bash
npm run dev
```

Visit http://localhost:3000.

