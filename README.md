🌦️ Weather App (Next.js)
This is a Next.js project bootstrapped with create-next-app.

🚀 Getting Started
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/weather-app.git
cd weather-app
🔗 Or access the live version at:
https://weather-app-git-landing-page-t-eight211s-projects.vercel.app

2. Install Dependencies
bash
Copy
Edit
npm install
3. Set Up Environment Variables
Create a .env.local file in the root directory (same level as package.json) and paste the following:

env
Copy
Edit
GOOGLE_API_KEY=AIzaSyB8KMKGOf2VwDGSeoTHWLzmIG407JCcVRA
NEXT_PUBLIC_WEATHER_API_KEY=6f3fc0377e70753fbab151631f3aa247
⚠️ Important Notes:
OpenWeather One Call API 3.0
Subscribe to the free tier here (1000 free calls/month):
👉 https://openweathermap.org/api/one-call-3

Google Maps APIs Required:

Google Maps JavaScript API

Places Autocomplete API
👉 Get your key from the Google Cloud Console

4. Run the Development Server
bash
Copy
Edit
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Then open your browser and go to:
http://localhost:3000 

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

This project uses [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Commit Message Convention Guide

To ensure consistency and clarity in our commit history, we follow the **Conventional Commits** standard. Below is the list of commit types and their purposes:

| Type        | Purpose                                                  | Example                             |
| ----------- | -------------------------------------------------------- | ----------------------------------- |
| feat:     | A new feature added to the codebase                      | feat: add user signup form        |
| fix:      | A bug fix that addresses an issue                        | fix: resolve navbar alignment bug |
| chore:    | Routine tasks, project setup, and non-functional updates | chore: install eslint             |
| refactor: | Code improvements that don't add functionality           | refactor: clean up API calls      |
| docs:     | Documentation updates (README, comments, etc.)           | docs: update project setup guide  |
| style:    | Changes related to code formatting (Prettier, etc.)      | style: apply prettier formatting  |

## Additional Notes:

- **chore:**: Used for updates or maintenance tasks that don't affect the app’s functionality (e.g., installing dependencies, updating config files, or folder structure changes).
- **feat:** and **fix:** should be used when adding new features or fixing bugs that impact the functionality of the app.
- **refactor:** is reserved for changes to the codebase that do not affect functionality but improve structure or readability.
- **docs:** applies only to changes in documentation files (e.g., updating the README).
- **style:** is for changes that don't affect the logic of the code, such as formatting or minor code style tweaks.
