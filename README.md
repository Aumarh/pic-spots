## PicSpots - a social media platform for tourists who love to explore and capture picture perfect spots around Vienna.

## Description

A web application where registered users can upload pictures of beautiful spots around Vienna, add the spot name, a spot description to guide users visiting the spot, and the spot location which can be opened on the map to navigate users. Users are also able to leave comments on spots they fancy, view the spot community page and discover spots form other users.

## Technologies

- Next.js
- Javascript / Typescript
- CSS / Emotion
- Material UI
- PostgreSQL
- Ley
- dotenv-safe
- Cloudinary
- Google API / Places Autocomplete
- Bcrypt
- CSRF Token
- Jest for unit testing
- Playwright for E2E testing
- Figma
- drawSQL

## Getting started

Clone the repo from GitHub and then install the dependencies:

`git clone https://github.com/Aumarh/pic_spots cd pic_spots yarn`

Setup a database with postgres on your computer:
`psql <login> CREATE DATABASE <database name>; CREATE USER <username> WITH ENCRYPTED PASSWORD '<pw>'; GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;`

Create a .env file with the userinfo for the database and create .env.example as a template file for userinfo

Use migrations:

`yarn migrate up`

To delete data from database run:

`yarn migrate down`

To run the development server:
`yarn dev`

Open http://localhost:3000 with your browser to see the result.

## deployment

To deploy this project, create a Heroku Account and follow the instructions

## Figma Wireframe

(https://www.figma.com/file/OEFA457H3RFqN0JSiGbRQp/Pic-Spots?node-id=0%3A1)

## Database schema

(https://drawsql.app/cyber-security-corner/diagrams/pic-spots#)

## Preview

### Home page

![Screenshot of the home page](/public/screenshots/homepage.jpg 'This is the home page')

### Single post page

![Screenshot of the single post page](/public/screenshots/singlepostpage.jpg 'This is the single post page')

### Profile page

![Screenshot of the private-profile page](/public/screenshots/privateprofilepage.jpg 'This is the profile page')

### Upload page

![Screenshot of the upload page](/public/screenshots/uploadpage.jpg 'This is the upload page')

### Community page

![Screenshot of the community page](/public/screenshots/communitypage.jpg 'This is the community page')
