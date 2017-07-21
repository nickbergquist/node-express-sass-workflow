# nabapp

A [Node](https://nodejs.org/en/) web application served with [Express](https://expressjs.com/) and [Pug](https://pugjs.org/) template views. This is an extension on the application build provided by the Express  ```express-generator tool``` available at [https://expressjs.com/en/starter/generator.html](https://expressjs.com/en/starter/generator.html) for creating alternate builds that run in either ```NODE_ENV``` **development** or **production** environments. The build process and starting of the application is handled with [Gulp](http://gulpjs.com/). There is also a full SASS integration included with some basic styling.

## Install dependencies

Assuming Node is installed; if Gulp is not then run the following to install: 

```npm install -g gulp```

Run ```npm install``` in a CLI opened in the directory in which the repository is cloned to install project dependencies.

## Building the application

Pre-compiled resource files are located in ```assets/``` and the gulp build processes deploy all output files to ```build/``` or ```dist/``` for **development** and **production** builds respectively.

### Gulp default task

To work on a **development** build run ```gulp``` at the CLI. To publish a **production** build run ```npm start``` which executes the command specified in the 'start' property of the 'scripts' object in the **package.json** file.

In **gulpfile.js**:
```JavaScript
// gulp default tasks
if(process.env.NODE_ENV === 'production'){
    gulp.task('default', ['clean', 'publish']);
} else {
    gulp.task('default', ['clean', 'build', 'watch']);
}
```

### Gulp task - development build

The ```build``` task applies SASS linting and compiles all SASS files into one CSS file adding source-maps and incorporating post-processing tasks. It also processes all CSS/JS into the ```build/``` directory detailed above and runs the gulp ```watch``` task so that changes to any of the SASS or main JS files will result in automated independent builds of the SASS or JS.

There are static Javascript files used for script media-query detection that are also copied across from ```assets/javascripts/static/``` to the ```build/``` directory unaltered in the **development** build. One of these files, ```enquire.js``` - [https://www.npmjs.com/package/enquire.js](https://www.npmjs.com/package/enquire.js), is now available as a dependency via npm; this is an alternative source. If you choose to install this dependency using npm and the Javascript file, **enquire.js** remains in ```node_modules/``` the ```express.static``` middleware should be used to serve this static file in **app.js**. If a virtual prefix is created then the actual path to this file will be protected over HTTP requests, i.e.,

In **app.js**:
```
app.use('/enquire', express.static(path.join(__dirname, '/node_modules/enquire.js/dist/')));
```

And in **assets/views/layout.pug**:

```
script(src='/enquire/enquire.min.js')
```

The gulp ```build``` task provides a **development** build; there is no file minification.

### Gulp task - production build

Running the ```publish``` task performs the same build process except that the file destination is the ```dist/``` directory, there is no linting, source-maps are excluded from the generated CSS and the latter is minified. The Javascript static files and the main Javascript file are concatenated and minified.

The filenames of the files generated reflect the **production** build i.e., ```main.min.css``` and ```site.min.js```

**Note**:
In both **development** and **production** builds the pug view templates are copied across from the ```assets/``` directory to the ```views/``` directory. At present the only processing of these view templates is switching the filename of the processed CSS resource in **layout.pug** to add the '.min' suffix. This is done using a 'HTML build block processor, namely the module [```gulp-processjade```](https://www.npmjs.com/package/gulp-processjade). Just for comparison this process has not been extended to management of the path to the Javascript files in **layout.pug**, instead a pug conditional block has been used.

### Gulp clean task

Use the ```gulp clean``` command to clean out all **development** or **production** build files and directories.