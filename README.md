# AO - Frontend

[![build status](https://git.y-designs.com/ao/ao-frontend/badges/master/build.svg)](https://git.y-designs.com/ao/ao-frontend/commits/master)

Apologies in advance, the type checking is essentially non-existent. There are a few places that may have flow types defined but time was of the essence :/

# Build

Quick note on the build process, we have two entry points: `index.js` is the main app, `index-ico.js` is the static standalone ico page. Did not want to eject create-react-app so we are using seperate/custom webpack config.