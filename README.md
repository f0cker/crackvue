# Crackvue - The Vue JS GUI for CrackQ

## Project setup
```
npm install
```

### Compiles development env
```
npm run serve
```
This requires modifications to the source of both CrackQ and Crackvue to add a cross origin source (CORS) 
and bypass CSRF restrictions when accessing the API from the locally served GUI

Fist uncomment these 3 lines:
https://github.com/f0cker/crackq/blob/master/crackq/__init__.py#L29-L31

Then disable CSRF requirement by commenting out this line:
https://github.com/f0cker/crackq/blob/master/crackq/__init__.py#L44

Then uncomment line 21 in main.js to include this line of code:

Also add an entry in your local hosts file to point crackq.org to the IP where the CrackQ API is running.

```
axios.defaults.withCredentials = true;
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

When compiled the /dist directory can be copied to the root crackq directory and then follow the steps 
to rebuild the crackq containers/images
