Splunk JSON Formatter
=====================

This is a Chrome user script I wrote to pretty print JSON objects located inside Splunk events.

Here's a demo of installing and running the script.  Installation and usage instructions below.

![Animated gif of the tool](https://raw.github.com/mwcz/splunk-json-formatter/master/demo.gif)

Installation
------------

 1. Clone this repo, or just download [the user
    script](https://github.com/mwcz/splunk-json-formatter/raw/master/splunk-json.user.js)
    directly.
 2. Open it in your text editor and find the two `@match ...` lines.  Change
    them to be the URLs you want this extension to run on.  For example, if
    your Splunk is running on `https://splunk.company.com`, you'll need one
    line to read `https://splunk.company.com/*` and the other can be removed
    Feel free to add more `@match` lines if you want this extension to run on more URLs.
 3. Install the extension by dragging the file into the Extensions tab in
    Chrome.  Google has [in-depth
    instructions](https://support.google.com/chrome/answer/167997?hl=en).

Usage
-----

Once the script is installed, navigate to any Splunk page and click on the JSON
string.  A window will pop up with the JSON object syntax-highlighted, 

### Usage notes ###

 1. You may have to click on some whitespace instead of on the text itself,
    because Splunk adds "helpful" filtering links to the text.
 2. This tool expects the JSON object to be the last thing in the log message,
    which allows standard timestamps, class identifiers, etc to be prefixed.

Bugs, Feedback, and Contributions
---------------------------------

Open issues here if you find any bugs or have ideas for improvements.  Pull
requests welcome.  Tweet [@mwcz](https://twitter.com/mwcz) if you have
feedback!

Credits
-------

 - [Pumbaa80](http://stackoverflow.com/users/27862/pumbaa80) for the [syntax highlighting](http://stackoverflow.com/questions/4810841/json-pretty-print-using-javascript/7220510#7220510)
 - [Sean Patrick Floyd](http://stackoverflow.com/users/342852/sean-patrick-floyd) for the [Anchor tag regex](http://stackoverflow.com/a/4563827/215148)
 - [Jani Nurminen](http://slinky.imukuppi.org/) for creating the [Zenburn colorscheme](http://slinky.imukuppi.org/zenburnpage/) which I used in this project
