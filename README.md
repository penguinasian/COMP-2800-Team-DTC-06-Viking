# DTC Team 06 - Viking project


First Name | Last Name | Student Number
-----------|-----------|---------------
Daniel | Zhang | A00957847
Jonghoon | Jang | A01240621
Eiman | Ardakanian | A01195951
Fengrui (Kevin) | Guo | A01243552

## Content
Content of the project folder:

 Top level of project folder: 
├── .gitignore               # Git ignore file
├── public                   # Contains css, html, javascript, images and favicon subfolders
├── README.md
├── files related to firebase rules and indexes	
├── upload_firestore # To export data to firebase
├── archive   # To store all the unused files

Subfolders and files of public folder:
├── CSS                      # Folder for css files
├── images                   # Folder for images for our application
├── Javascripts              # Folder for all javascript files                  
├── favicon                  # Folder for favicon icons used for our web application                    
├── html files     


Subfolders of upload_firestore folder:
├── data                     # csv, json files for the database
├── javascripts              # javascript files for exporting data to firestore  
├── serviceAccount.json      # firebase private key


## Getting Started

This is the project repository for our app. We used firebase for hosting, which means that all of the relevant html/css/js files are located in subfolders of the `public` folder. Site images are under `/public/images`, and favicons are under `/public/images`. The `/upload_firestore` folder contains all of the csv and json files which are the initial data for our database, along with the scripts to upload them to firebase.

### To setup the development environment, first install a few programs:

1. <a href="https://nodejs.org/en/">Node.js</a>
2. <a href="https://code.visualstudio.com/download">VS Code</a>
3. <a href="https://www.selenium.dev/downloads/">Selenium IDE</a>
    
Afterwards, create a <a href="https://firebase.google.com/">firebase account</a> to be able to access the database. You will need to be invited to be able to access the project files on github and firebase.

To create route maps, use your google account and create them on <a href="https://www.google.ca/maps/about/mymaps/f">google maps</a>.

### To begin developing, follow the two steps below:

1. Clone the repository in VS Code
2. Setup a Node.js project by typing `npm init` into the terminal at the root of the cloned project folder
3. Install firebase import export by typing `npm install firestore-export-import` into the terminal

### To export data to firebase:

1. Store the relevant json file in `/upload_firestore/data`
2. Create or use a script in a similar format to `import.js` or `import_pop_routes.js` in the `/upload_firestore` folder
3. Navigate to `/upload_firestore` in the terminal and type `node file.js`, replacing `file.js` with the name of the script

To turn a csv file into json, install a google sheets add-on called <a href="https://workspace.google.com/marketplace/app/export_sheet_data/903838927001f">export sheet data</a>.

### To deploy the site:

1. Type `firebase deploy` in the terminal

If it asks you to assign a project to the app, then follow the steps and select the Vikings firebase project to associate with the code.

If it asks you if you would like to delete these indexes, please select "No" to continue the rest of the deployment.

### 3rd party APIs:
The APIs to download (order does not matter):
Google map API key: AIzaSyC_6aXL_PACxTA0BNnH3t97Z7jhTw3LbxI
Firebase API key: AIzaSyAnItMRdAhhWAhg2DmlPu6Li2vO952iEho

Instruction for downloading Google map API key:
To load the Maps JavaScript API inline in an HTML file, add a script tag as show below.

<script async
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
</script>


Instruction for downloading Firebase API key:
Link firebase_api.js into the bottom of your <body> tag, but before you use any Firebase services


## Testing Plan

https://docs.google.com/spreadsheets/d/10W77fkHyNKxPCpFfT9-ZwfgkHA0aP0CANFubDfCeIYg/edit#gid=0

Access our testing plan with the link above and see if there's anything to contribute!