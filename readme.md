# Techedu API

> Backend API for Techedu application, which is an educational managment system for students to publish their projects, Build their profiles to get reviewed by instructors and companies.

## Usage

> Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

> To seed the database with users, profiles, categories, projects and reviews with data from the "\_data" folder, run

```
# Destroy all data
node seeder -d

#Import all data
node seeder -i
```

## Demo

> The API is live at https://techedu-api.herokuapp.com/

- Version: 1.0.0
- License: MIT
- Author: Mostafa Sayed
