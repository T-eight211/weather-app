# Weather App 🌤️

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

Or you can access the live version at:  
🔗 https://weather-app-git-landing-page-t-eight211s-projects.vercel.app/

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Set Up Environment Variables**

Create a `.env.local` file in the **root directory** (same level as `package.json`) and paste the following:

```env

NEXT_PUBLIC_WEATHER_API_KEY=6f3fc0377e70753fbab151631f3aa247
```

> ⚠️ **Important Notes:**
>
> - For OpenWeather One Call API 3.0, **you must subscribe** to the [free tier here](https://openweathermap.org/api/one-call-3) (1000 free calls/month).
> - For Google Maps functionality, enable:
>   - Google Maps JavaScript API
>   - Places Autocomplete API  
>
> Visit [Google Cloud Console](https://console.cloud.google.com/welcome?invt=Abt1RA&project=plasma-air-432616-m9) to get your API key.

### 4. **Run the Development Server**

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✍️ Start Editing

You can start modifying the app from `app/page.tsx`. Changes will be auto-reflected on save.

## 📦 Features

- 🔍 City search with Google Places Autocomplete
- 🌡️ Current, hourly, and daily weather forecasts
- 🎥 Animated weather background videos (day/night aware)
- 📊 Rain prediction visualization (next 60 minutes)

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

---

## ☁️ Deployment

The easiest way to deploy this app is via [Vercel](https://vercel.com/).

---

## ✅ Commit Message Convention

This project uses **Conventional Commits**. Here's a summary:

| Type        | Purpose                                                  | Example                             |
| ----------- | -------------------------------------------------------- | ----------------------------------- |
| `feat:`     | Add new feature                                          | `feat: add city search bar`         |
| `fix:`      | Bug fix                                                  | `fix: handle API error correctly`   |
| `chore:`    | Routine maintenance or setup                             | `chore: configure eslint`           |
| `refactor:` | Code improvements without feature change                 | `refactor: clean up utils`          |
| `docs:`     | Documentation updates                                    | `docs: update README`               |
| `style:`    | Non-functional changes like formatting                   | `style: apply prettier`             |

---

