## About

This is a node script extracting E-Books from Amazon Kindle Cloud Reader.
Useful e.g. for being able to read on devices where the Cloud Reader doesn't work and for having a copy in an open format.
Works with Chrome/Chromium. Other browsers use different formats for the WebSQL file where the E-Books are stored for offline use.

Code is from this gists:

 * 1: https://gist.github.com/yangchenyun/a1c123935d82f5e25d57
 * 2: https://gist.github.com/moodule/84140e557065ac3d73f669f120429ae1

I have just added minor usability improvements (e.g. cmdline switch for input file selection) and a package.json file.

## Usage

This was successfully tested with nodejs v6 and v8 (will print ugly warnings with v8).    
Doesn't work for me with nodejs v10 (and reportedly also not with v11).

<pre>
npm install
./main.js --help
</pre>

This generates HTML files with the book content in the directory you're in.

You just need to figure out the file to which the ebook was stored. As an example, in my case that was `~/.config/chromium/Default/databases/https_lesen.amazon.de_0/1`  
If you have installed the browser as snap package, you need to first check where that snap is mounted (e.g. with `mount | grep snap`).

Of course the ebook needs to first be downloaded for offline use:
Go to the `library` view in the cloud reader App, right click the cover, click `Download` (if you don't have that option, you may not have the cloud reader extension installed).  
If an ebook was opened in the browser, but not downloaded, the sqlite file will exist, but not contain the content necessary for export (and this script will thus fail).

## TODO

This is much better then nothing, but far from perfect.

* Generated files may become huge and cause troubles to some browsers. Storing images as standalone files may improve that.
* Page numbers should probably be included (optionally?).
* An option to extract only specific books would be useful for large libraries. Currently, it will extract all e-books found in the given file.
* The script could support the user in finding the right sqlite file.
