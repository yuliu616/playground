# electron-angular sandbox

## Components
- GUI
  - angular-app (html/js)
- thick-app
  - electron-app (node.js 8.x)
- express-app
  - for ease of debugging GUI

## Environment (assumption)

- GUI:
  - node.js 8.x / electron

## Configurations

### GUI
- set up command: `npm install`.
- config files:
  - angular-app/src/environments/environment.prod.ts
  - angular-app/src/environments/environment.`${env}`.ts

## Debugging

### start GUI (prod)
GUI is built by angular, output is static files,
no need to start.

### start GUI (debug mode)
```bash
cd angular-app
npm start
```

### start thick-app (prod)
it is built as single thick-client app using electron-builder,
double-click to start.

### start thick-app (debug mode)

```sh
cd electron-app
npm start
```

### express-app (for debugging)

```sh
cd express-app
npm start
```

## Building

### build GUI

> it will build to dir `/angular-app/dist/angular-app`.

```sh
cd angular-app
npm run build
```

### build thick-app

> it will build to dir `/electron-app/dist/electron-app`.

- Build ts code:
```sh
cd electron-app
npm run import-gui
npm run build
```

- Build into package.

> it will build to dir `/electron-app/dist/packaged`.

```sh
# for mac
npm run package-mac

#for win
npm run package-win

#for linux
npm run package-linux
```

## Entry points

GUI (in debug mode):
> http://127.0.0.1:4200/
