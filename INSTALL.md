# How to install drupal-patch-color locally ?

## Get the project
```
# Clone the repository and cd into.
git clone https://github.com/Keenegan/drupal-patch-color.git
cd drupal-patch-color

# Install the dependencies
npm install
```

## Enable the extension in your browser
*   In Firefox go to [about:debugging](about:debugging#/runtime/this-firefox)
*   Click on "Load Temporary Add-on"
*   Choose any file of the project

## web-ext
It's possible to use [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) to test the extension.
```
web-ext run
```


## Compile the scss
```
npm run scss
```