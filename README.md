# React Flux Boilerplate

![Banner](http://i.imgur.com/HbhtYSh.png)

A simple pages transition boilerplate using React + Flux

## Technologies

- Babel | ES2015
- React + Flux
- page.js
- GSAP - TweenMax
- dom-hand
- Webpack
- ESLint
- SCSS + Rucksack

## Install dependencies
```
$ npm i
```

## Launch the project
```
$ npm start
```
The project will be launched at http://localhost:3000

## Build for production
```
$ npm run build
```
### SEO
Go inside `./seo` and build the project `npm run build`.
It will create inside `dist/snapshots/` all the pages of the website as the seo optimized content of the website. 

## Routing
Add your routes in `client/data/index.js`. If you need nested routes, check out the articles exemple and update `client/app/desktop/index.js`.

Also update `client/components/PagesContainer.js`.

