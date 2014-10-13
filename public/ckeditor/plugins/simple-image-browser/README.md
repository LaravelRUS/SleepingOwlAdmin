CKEditor Simple Image Browser
=============================

This repository is for the simple image browser. A free plugin made for those who look to make it easy on the user to insert an image to their content. A simple click on the image and WHAM!

### How to install
You can build this together with CKEditor. You will need to configure this afterwards with the AJAX url. No other setup is required. You can set the config like so.

```
// Add this line if you haven't build CKEditor with this plugin.
CKEDITOR.config.extraPlugins = 'simple-image-browser';

// Add this line anyways. You need it to get your images.
CKEDITOR.config.simpleImageBrowserURL = <INSERT URL TO AJAX FILE HERE>;
```

### JSON Response
The JSON Response exists now only of the url to the file. Nothing more is needed and all your logic can go in the AJAX file. Here is a example of what the JSON response should look like.
```
// JSON Response Example
[{
    // File 1
    url: <URL TO FILE HERE>
},{
    // File 2
    url: <URL TO FILE HERE>
}]
```

### Roadmap
I want to add the following features in the future.

- Different listing types, not just thumbnails
- Hooks so you can further customize and control the user experience
