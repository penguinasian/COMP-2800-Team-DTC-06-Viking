# DTC Team 06 - Viking project


First Name | Last Name | Student Number
-----------|-----------|---------------
Daniel | Zhang | A00957847
Jonghoon | Jang | A01240621
Eiman | Ardakanian | A01195951
Fengrui (Kevin) | Guo | A01243552


## Getting Started

This is the project repository for our app. We used firebase for hosting, which means that all of the relevant html/css/js files are located in subfolders of the `public` folder. Site images are under `/public/images`, and favicons are under `/public/images`. The `/upload_firestore` folder contains all of the csv and json files which are the initial data for our database, along with the scripts to upload them to firebase.

### To setup the development environment, first install a few programs:

1. <a href="https://nodejs.org/en/">Node.js</a>
2. <a href="https://code.visualstudio.com/download">VS Code</a>
3. <a href="https://www.selenium.dev/downloads/">Selenium IDE</a>
    
Afterwards, create a <a href="https://firebase.google.com/">firebase account</a> to be able to access the database.

### To begin developing, follow the two steps below:

1. Clone the repository in VS Code
2. Setup a Node.js project by typing `npm init` into the terminal at the root of the cloned project folder
3. Install firebase import export by typing `npm install firestore-export-import` into the terminal

### To export data to firebase:

1. Store the relevant json file in `/upload_firestore/data`
2. Create or use a script in a similar format to `import.js` or `import_pop_routes.js` in the `/upload_firestore` folder
3. Navigate to `/upload_firestore` in the terminal and type `node file.js`, replacing `file.js` with the name of the script

### To deploy the site:

1. Type `firebase deploy` in the terminal

If it asks you to assign a project to the app, then follow the steps and select the Vikings firebase project to associate with the code.

## Testing Plan

https://docs.google.com/spreadsheets/d/10W77fkHyNKxPCpFfT9-ZwfgkHA0aP0CANFubDfCeIYg/edit#gid=0

Access our testing plan with the link above and see if there's anything to contribute!