/*global jQ*/
/*jslint browser: true*/

/*************************************************************
 *  This script looks for a JSON object in splunk events     *
 *  list and formats them with syntax highlighting.          *
 *************************************************************/

// Users!  Add your @match lines below so this script will run only at the URLs
// where your splunk instance is located.

// ==UserScript==
// @name    Splunk JSON Formatter
// @version 0.1
// @match   http://____.com/*
// @match   https://____.com/*
// ==/UserScript==
(function () {

    function main() {

        var css = [
            "pre {",
            "   padding: 17px;",
            "   margin: 5px;",
            "   background-color: #1f1f1f;",
            "   overflow-x: auto;",
            "   border-radius: 8px;",
            "   box-shadow: inset 2px 4px 14px 4px rgba(0,0,0,0.5);",
            "}",
            "body {",
            "   padding: 8px;",
            "   margin: 0;",
            "   background-color: #3F3F3F;",
            "   color: #d7d7d7;",
            "}",
            "a { color: #d75757; }",
            ".string { color: #cc9393; }",
            ".number { color: #8cd0d3; }",
            ".boolean { color: #f0dfaf; }",
            ".null { color: #dfdfbf; }",
            ".key { color: #7f9f7f; }"
        ].join('\n');

        function syntaxHighlight(json) {
            if (typeof json !== 'string') {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                var retval;
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                if (cls === 'key') {
                    retval = '<span class="' + cls + '">' + match.slice(0, match.length - 1) + '</span>:';
                } else {
                    retval = '<span class="' + cls + '">' + match + '</span>';
                }
                return retval;
            });
        }

        function draw_buttons () {
            var items = jQ('tr.shared-eventsviewer-list-body-row');
            items.each(function (index, el_tmp) {
                if (jQ(el_tmp).find('td._time button').length === 0) {
                var el = jQ(el_tmp).find('td._time'),
                    container,
                    format_button = jQ('<button>');
                format_button.text('Format JSON');
                format_button.addClass('json-splunk splIconicButton splButton-tertiary');
                //format_button.css('margin-top', '2px');
                //format_button.css('white-space', 'nowrap');
                //format_button.css('float', 'left');
                //format_button.css('position', 'relative');
                //format_button.css('left', '-35px');
                format_button.on('click', handle_json_button_click);
                el.append(format_button);
                }
            });
        }

        function handle_json_button_click (event) {
            var string = jQ(event.target).parentsUntil('tbody').last().find('div.raw-event').text();
            var json_string = string.substring(string.indexOf('{'), 1 + string.lastIndexOf('}'));
            var json_obj = JSON.parse(json_string);
            var win = window.open();

            // wrap syntax highlighted JSON in pre tags
            var content = '<pre>' + syntaxHighlight(json_obj) + '</pre>';

            // replace URL strings with actual hyperlinks
            content = content.replace( /"(https?:\/\/[^"]+)"/gi , '"<a target="_blank" href="$1">$1</a>"' );

            // write the content to the new window
            win.document.write(content);

            // write the css to the new window
            var style = win.document.createElement('style');
            style.setAttribute('type', "text/css");
            style.setAttribute('rel', 'stylesheet');
            style.textContent = css;
            win.document.head.appendChild(style);
        }

        // Try to draw the buttons every 400ms.  Previously, this was done by
        // creating a Splunk.Module.EventsViewer.prototype.onResultsRendered
        // function, but Splunk.Module is no longer defined in Splunk 6.0.2,
        // even though docs imply that it should be.  Not sure why the previous
        // approach no longer works, but this hacky interval will do until we
        // can figure out how to wire up the event again.
        setInterval(function() {
            draw_buttons();
        }.bind(this), 400);
    }

    // ==UserScript==
    // @name         jQuery For Chrome (A Cross Browser Example)
    // @namespace    jQueryForChromeExample
    // @include      *
    // @author       Erik Vergobbi Vold & Tyler G. Hicks-Wright
    // @description  This userscript is meant to be an example on how to use jQuery in a userscript on Google Chrome.
    // ==/UserScript==
    // a function that loads jQuery and calls a callback function when jQuery has finished loading
    function addJQuery(callback) {
        var jq_script = document.createElement("script");
        jq_script.setAttribute("src", "//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js");
        jq_script.addEventListener('load', function() {
            var nc_script = document.createElement("script");
            nc_script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
            document.body.appendChild(nc_script);
        }, false);
        document.body.appendChild(jq_script);
    }

    // load jQuery and execute the main function
    addJQuery(main);

}());
