/*global jQ*/
/*jslint browser: true*/

/*************************************************************
 *  This script looks for a JSON object in splunk events     *
 *  list and formats them with syntax highlighting.          *
 *************************************************************/


// ==UserScript==
// @name    Splunk JSON Formatter
// @version 0.1
// @match   http://splunk.corp.redhat.com/*
// @match   https://splunk.corp.redhat.com/*
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
            "   background-color: #365b7e;",
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
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }

        jQ('body').on('click', '.event', function () {
            var string = jQ(this).text();
            var json_string = string.slice(string.indexOf('{'));
            var json_obj = JSON.parse(json_string);
            var win = window.open();

            // write the content to the new window
            var content = '<pre>' + syntaxHighlight(json_obj) + '</pre>';
            content = content.replace( /"(https?:\/\/[^"]+)"/gi , '"<a target="_blank" href="$1">$1</a>"' );
            win.document.write(content);

            // write the css to the new window
            var style = win.document.createElement('style');
            style.type = "text/css";
            style.innerText = css;
            win.document.body.appendChild(style);
        });
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
