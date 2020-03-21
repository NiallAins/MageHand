# Mage Hand

### Live Implementation
- https://niallains.github.io/MageHand/dist

### Project Outline
- A Progressive Web App to help in playing Dungeons and Dragons
- UI to support combat, character sheets and item/spell lookup using DnD open API.
- Support for desktop, tablet and mobile
- All offline, localStorage only, no database connection needed.

### Tech
- Built with Vue.js and SCSS
- Uses VueCLI with single file components
- All icons created with CSS
- Hosted directly from git repo using GhPages
- Coded in Microsoft Visual Code

### Folder Structure Breakdown
- dist: fully rendered app auto-created from development files
- public: Native app icons and favicon, index launch page
- src/
    - assets: app images
    - components: reuseable UI components
    - views: page view components
    - App.vue: app parent component
    - main.js: point of entry for all code, catches PWA install call to defer until user button press
    - registerServiceWorker.js: creates service worker; necessary for PWA but not used
    - userData.js: service to load and save all data to localStorage
    - searchData.js: stores all autocomplete data locally to minimise API calls
    - global.scss: globally applicable styles
    - icon.scss: styles for all in-app icons
    - vars.scss: colour, width and typographic style variables
  - build.sh: script to build project files into dist folder and push changes live to git repo and ghPages server
  - package.json: stores project details, npm requirements and PWA manifest options

### To Run Locally
After pulling repo:
```
npm install
npm run serve
```

### To Build Project and Push Live
```
./build.sh
```

### Send Feedback
- niallainsworth@gmail.com
