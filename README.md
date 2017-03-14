## Overview
Displays information relevant to our daily standup

## How to Use

### Running the App

If you want to start using the app immediately, create an Custom HTML app on your Rally dashboard and copy and paste [this](https://raw.githubusercontent.com/robgura/OpenStoriesTasksAndDefects/master/deploy/App.html)

## Development

### Steps
    rake debug
    python -m SimpleHTTPServer
    
At this point you can point your browser at `http://{IP}:8000/App-debug.html`

### Rake Tasks

Available Rakefile tasks are:

rake task | description
---|---
rake build | Build a deployable app which includes all JavaScript and CSS resources inline
rake clean | Clean all generated output
rake debug | Build a debug version of the app, useful for local development
rake deploy | Deploy an app to a Rally server
rake deploy:debug | Deploy a debug app to a Rally server
rake deploy:info | Display deploy information
rake jslint | Run jslint on all JavaScript files used by this app, can be enabled by setting 

## License

OpenStoriesTasksAndDefects is released under the MIT license.  See the file [LICENSE](https://raw.github.com/RallyApps/OpenStoriesTasksAndDefects/master/LICENSE) for the full text.
