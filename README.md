# Tripli 
Een gebruiksvriendelijke webapplicatie waarmee families hun reizen kunnen plannen, bekijken en delen.
Gebruikers kunnen reizen aanmaken, dag per dag activiteiten toevoegen, foto's uploaden, reizen delen,…
Ook kunnen familieleden worden toegevoegd en meldingen ontvangen bij updates.
## Features
- 📅 Reizen aanmaken en beheren
- 📸 Activiteiten per dag toevoegen en foto's uploaden
- 👨‍👩‍👧‍👦 Familieleden toevoegen en beheren
- 🔔 Notificaties ontvangen bij updates
- 🗺️ Kaartweergave van locaties (Mapbox)
- 🔍 Filters op reizen (toekomstig, voorbije, eigen)
- 🔐 JWT-authenticatie voor veilige toegang

## Inhoudstafel
- [Installatie](#Installatie)
- [Developen](#Developen)
- [Project structuur](#Project-Structuur)
- [Conventions](#Conventions)
- [Databasestructuur](#Databasestructuur)
- [Style Guide](#Style-Guide)
- [Bronnen](#Bronnen)
- [Promo filmpje](#Promo-filmpje)
- [Author](#Author)

## Installatie
Zorg ervoor dat Node.js en Npm zijn geïnstalleerd:
[Download Node.js](https://nodejs.org/en/download/prebuilt-installer)  
[Download Npm](https://www.npmjs.com/)

1. Clone de repository:
```bash
git clone https://github.com/NelleFavoreel/Memoraa.git
```
2. Navigeer naar de projectmap

- Start frontend
```bash
cd frontend
```
```bash
npm install
```
```bash
npm run dev
```
- Start backend
```bash
cd backend
```
```bash
npm install
```
```bash
Node index.js
```

De applicatie is bereikbaar op http://localhost:5173/

## Developen
Tijdens het ontwikkelen werd gewerkt met React (frontend), Express en MongoDB (backend). 
De frontend en backend draaien los van elkaar met behulp van Vite en Node.js. 
Notificaties, reizen en gebruikers worden beheerd via eigen API-routes.
## Project Structuur
```bash
ProjectRoot/
backend/
├── middleware/
│   └── auth.js               # Middleware voor authenticatie (bijv. JWT check)
│
├── routes/
│   ├── family.js             # Routes voor familieleden en vrienden
│   ├── notifications.js      # Routes voor meldingen / notificaties
│   ├── trips.js              # Routes voor het beheren van reizen
│   └── users.js              # Routes voor gebruikersinformatie
│
├── node_modules/             # NPM packages (automatisch gegenereerd)
│
├── db.js                     # Verbindt met de MongoDB database
├── index.js                  # Startpunt van de server (Express app)
├── .env                      # Bevat geheime omgevingsvariabelen (zoals database URI, JWT secret)
├── .gitignore                # Geeft aan welke bestanden Git moet negeren
├── package.json              # Projectconfiguratie en dependencies
└── package-lock.json         # Exacte versies van geïnstalleerde dependencies
frontend/
├── public/
│   ├── images/            # Afbeeldingen voor statisch gebruik
│   └── models/            # 3D-modellen of andere assets
├── src/
│   ├── assets/            # Fonts, iconen, kleurenschema's, ...
│   ├── components/        # Herbruikbare UI-componenten
│   │   ├── 3D/            # 3D-gerelateerde componenten
│   │   ├── account/       # Account-gerelateerde elementen
│   │   ├── animations/    # Animaties en motion componenten
│   │   ├── button/        # Alle custom knoppen
│   │   ├── footer/        # Voettekstcomponent
│   │   ├── home/          # Componenten specifiek voor de homepage
│   │   ├── maps/          # Kaartweergave (bv. met Mapbox)
│   │   ├── modal/         # Pop-ups en overlay vensters
│   │   ├── navigation/    # Navbar en navigatiecomponenten
│   │   ├── notifications/ # Meldingen (zoals toasts)
│   │   ├── slideshow/     # Slideshow/slider componenten
│   │   └── trips/         # Alles rond reizen
│   │       ├── filters/   # Filters voor reizen
│   │       ├── AddTrip.jsx
│   │       ├── EditTrip.jsx
│   │       ├── TripDetail.jsx
│   │       └── ...        # Andere trip-subcomponenten
│   ├── pages/             # Volledige paginaweergaven
│   │   ├── account/
│   │   ├── beforeHome/
│   │   ├── home/
│   │   ├── login/
│   │   ├── notifications/
│   │   └── trips/
│   │       ├── TravelOverview.jsx
│   │       ├── TravelDetail.jsx
│   │       └── Calendar.jsx
│   ├── App.jsx            # Hoofdcomponent
│   ├── App.css            # Algemene app styling
│   ├── main.jsx           # Entreepunt React app
│   ├── index.css          # Globale CSS
├── .env                   # Omgevingsvariabelen
├── .gitignore             # Bestanden/ordners die Git negeert
└── eslint.config.js       # Lintingconfiguratie
```
## Conventions

### File names
- React components -> Hoofdletters (Header.jsx, MyComponent.jsx)
- Styles and CSS files -> kebab-case (main-styles.css)
- Folder namen -> kleine letter (pages)
### React Components
- Geef de voorkeur aan functionele componenten boven class-based componenten.
- Houd componenten zo klein en herbruikbaar mogelijk.
### CSS Modules (Optioneel)
- Voor betere scheiding van stijlen kun je CSS-modules gebruiken. Bestandsnamen eindigen dan op .module.css en worden geïmporteerd in de bijbehorende React-component.
## Databasestructuur
### Users:
```bash
{
  "_id": "string",
  "name": "string",                // Voornaam van de gebruiker
  "email": "string",               // Uniek e-mailadres
  "passwordHash": "string",        // Versleuteld wachtwoord
  "familyId": "string",            // ID van de familie waar deze gebruiker toe behoort
  "screenName": "string",          // Gebruikersnaam zichtbaar voor anderen
  "familyMembers": ["string"],     // Array met gebruikers-ID’s van familieleden
  "friends": ["string"],           // Array met eventuele toegevoegde vrienden
  "familyRequests": ["string"]     // Array met aanvragen om familie toe te voegen
}
```
### Trips:
```bash
{
  "_id": "string",
  "place": "string",               // Stad of regio
  "country": "string",             // Land
  "imageUrl": "string",            // Coverfoto van de reis
  "startDate": "Date",             // Begindatum
  "endDate": "Date",               // Einddatum
  "travelers": ["string"],         // Array met gebruikers-ID’s van meereizende familieleden
  "familyId": "string",            // ID van de familie waartoe de reis behoort
  "photos": ["string"],            // Algemene foto s los van dagen (URLs)
  "tripType": "string"             // Soort reis (bv. citytrip, roadtrip, staytrip)
}
```
### TripDays:
```bash
{
  "_id": "string",
  "tripId": "string",              // Link naar de betreffende reis
  "date": "Date",                 // Datum van deze dag
  "description": "string",        // Beschrijving van de dag
  "activities": ["string"],       // Tekstuele activiteiten of planning
  "photos": ["string"]            // Foto’s van die dag (URLs)
}
```
### Notifications:
```bash
{
  "_id": "string",
  "userId": "string",             // Naar wie de notificatie gestuurd is
  "sender": "string",             // Wie de notificatie heeft veroorzaakt (gebruikers-ID of naam)
  "tripId": "string (optioneel)", // Eventuele link naar een reis
  "type": "string",               // Soort notificatie (bv. "family-request", "trip-update")
  "date": "Date",                 // Tijdstip van aanmaken
  "read": false,                  // Of de notificatie gelezen is
  "readBy": ["string"]            // Gebruikers die het al gelezen hebben (bij gedeelde notificaties)
}
```

## Style Guide 
- HTML: Volg de semantische HTML-standaarden.
- CSS: Volg de semantische CSS-standaarden.
- Volg de best practices van React voor het structureren van je code.

## Bronnen

Hieronder vind je een overzicht van geraadpleegde bronnen tijdens de ontwikkeling van dit project:

### 📦 Packages & documentatie
- [Axios documentatie](https://axios-http.com/docs/intro)  
- [Mapbox tutorials](https://docs.mapbox.com/help/tutorials/)  
- [React Slick documentatie](https://react-slick.neostack.com/docs/example/center-mode)  
- [React Slick GitHub](https://github.com/akiran/react-slick/blob/master/examples/__tests__/CentreMode.test.js)  
- [React Toastify GitHub](https://github.com/fkhadra/react-toastify/blob/main/src/style.css)  
- [React Toastify styling](https://fkhadra.github.io/react-toastify/how-to-style)  
- [React Toastify op npm](https://www.npmjs.com/package/react-toastify)  
- [Hero UI Toast component](https://www.heroui.com/docs/components/toast)  
- [React Icons](https://react-icons.github.io/react-icons/)  
- [Lightbox.js React op npm](https://www.npmjs.com/package/lightbox.js-react)  
- [Yet Another React Lightbox](https://yet-another-react-lightbox.com/)  
- [FullPage.js voorbeelden](https://alvarotrigo.com/fullPage/examples/)  

### 🤖 ChatGPT-hulpmomenten
- [ChatGPT-gesprek 1](https://chatgpt.com/share/682451b0-12b4-8004-a020-fffbdb581f2d)  
- [ChatGPT-gesprek 2](https://chatgpt.com/share/68272242-d780-8004-91af-5bbe9436bc07)  
- [ChatGPT-gesprek 3](https://chatgpt.com/share/683c28ab-97dc-8004-a2a5-3c68e5f01bbb)  
- [ChatGPT-gesprek 4](https://chatgpt.com/share/684a9f82-d274-8004-8da7-77c7aa09127c)  
- [ChatGPT-gesprek 5](https://chatgpt.com/share/684aa22c-68f8-8004-bdac-3752560a9773)  
- [ChatGPT-gesprek 6](https://chatgpt.com/share/684aa29e-3a0c-8004-8031-fd2264dd567e)  
- [ChatGPT-gesprek 7](https://chatgpt.com/share/684aa2c9-e14c-8004-8764-eb24cdb1bcf9)  
- [ChatGPT-gesprek 8](https://chatgpt.com/share/684aa309-a5d0-8004-9e8c-60374e3a0de3)  


### 🧠 Andere
- [Git branch strategie (GitKraken)](https://www.gitkraken.com/learn/git/best-practices/git-branch-strategy)  
- [Best README Template (GitHub)](https://github.com/othneildrew/Best-README-Template)

## Promo filmpje



https://github.com/user-attachments/assets/a052aa9f-a64e-4f23-a67d-7010ddadbc13



## Author
Nelle Favoreel
