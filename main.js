#!/usr/bin/env node

/*
 * @fileoverview Program to free the content in kindle books as plain HTML.
 *
 * This is largely based on reverse engineering kindle cloud app
 * (https://read.amazon.com) to read book data from webSQL.
 *
 * Access to kindle library is required to download this book.
 */

// The Kindle Compression Module copied from http://read.amazon.com application
// The script reuses the same logic to decompress the fragments
var KindleCompression = function() {
    function h(a, c, g) {
        var f, g = g > 0 ? g : b;
        for (f in c)
            c[f] >= g && (g = c[f] + 1);
        f = g;
        for (var d in a)
            for (var g = a[d], e = 2; e <= g.length; e++) {
                var h = g.substr(0, e);
                c.hasOwnProperty(h) || (c[h] = f++)
            }
        return c
    }
    function j(c, e) {
        var l, h = b;
        l = "";
        for (var r = 0; r < e.length; ) {
            var o = e.charAt(r);
            r++;
            o.charCodeAt(0) <= d ? c.hasOwnProperty(l + o) ? l += o : (l.length > 0 && h < f && (c[l + o] = h,
            h++,
            h === a && (h = g)),
            l = o) : l = ""
        }
        return c
    }
    // This is called when lzExpandWithStaticDictionary doesn't have a dictionary passed in
    // in our case, we always construct the dictionary before decompress
    // function e() {
    //     if (defaultDictionary === void 0 || defaultDictionary === {})
    //         defaultDictionary = j({}, defaultDictionaryString);
    //     return defaultDictionary
    // }
    var d = 9983
      , c = d + 1
      , b = c + 100 + 1
      , f = 65533
      , a = 55295
      , g = 57344;
    return {
        lzCompress: function(k) {
            var e = {}, l = [], h, r = b, o, q, s;
            o = h = "";
            for (var t = 0; t < k.length; ) {
                var u = k.charAt(t);
                t++;
                if (u.charCodeAt(0) <= d) {
                    for (; o.length > 0; ) {
                        q = Math.min(100, o.length);
                        s = o.substr(0, q);
                        o = o.substr(q);
                        l.push(c + q);
                        for (q = 0; q < s.length; q++)
                            l.push(s.charCodeAt(q))
                    }
                    e.hasOwnProperty(h + u) ? h += u : (h.length > 0 && (l.push(h.length === 1 ? h.charCodeAt(0) : e[h]),
                    r < f && (e[h + u] = r,
                    r++,
                    r === a && (r = g))),
                    h = u)
                } else
                    h.length > 0 && (l.push(h.length === 1 ?
                    h.charCodeAt(0) : e[h]),
                    h = ""),
                    o += u
            }
            for (h.length > 0 && l.push(h.length === 1 ? h.charCodeAt(0) : e[h]); o.length > 0; ) {
                q = Math.min(100, o.length);
                s = o.substr(0, q);
                o = o.substr(q);
                l.push(c + q);
                for (q = 0; q < s.length; q++)
                    l.push(s.charCodeAt(q))
            }
            for (i = 0; i < l.length; i++)
                l[i] = String.fromCharCode(l[i]);
            return l.join("")
        },
        lzExpand: function(k) {
            for (var e = {}, l = [], h, r = b, o = "", q, s = 0; s < k.length; ) {
                h = k.charCodeAt(s);
                s++;
                if (h <= d)
                    h = String.fromCharCode(h);
                else if (h >= b)
                    (h = e[h]) || (h = o + q);
                else {
                    o = h - c;
                    l.push(k.substr(s, o));
                    s += o;
                    o = "";
                    continue
                }
                l.push(h);
                q = h.charAt(0);
                r < f && o.length > 0 && (e[r] = o + q,
                r++,
                r === a && (r = g));
                o = h
            }
            return l.join("")
        },
        lzBuildDictionary: j,
        lzGetDecompressionDictionary: function(a) {
            var b = [], c;
            for (c in a)
                b[a[c]] = c;
            return b
        },
        lzAddStringsToDictionary: h,
        lzAddNumbersToDictionary: function(a, b) {
            for (var c = [], g = 100; g < 1E3; g++)
                c.push("" + g);
            return h(c, a, b)
        },
        lzCompressWithStaticDictionary: function(a, b) {
            if (b === void 0 || b === {})
                b = e();
            var g = [], f, h, o, q;
            h = f = "";
            for (var s = 0; s < a.length; ) {
                var t = a.charAt(s);
                s++;
                if (t.charCodeAt(0) <= d) {
                    for (; h.length > 0; ) {
                        o = Math.min(100,
                        h.length);
                        q = h.substr(0, o);
                        h = h.substr(o);
                        g.push(c + o);
                        for (o = 0; o < q.length; o++)
                            g.push(q.charCodeAt(o))
                    }
                    b.hasOwnProperty(f + t) ? f += t : (f.length > 0 && g.push(f.length === 1 ? f.charCodeAt(0) : b[f]),
                    f = t)
                } else
                    f.length > 0 && (g.push(f.length === 1 ? f.charCodeAt(0) : b[f]),
                    f = ""),
                    h += t
            }
            for (f.length > 0 && g.push(f.length === 1 ? f.charCodeAt(0) : b[f]); h.length > 0; ) {
                o = Math.min(100, h.length);
                q = h.substr(0, o);
                h = h.substr(o);
                g.push(c + o);
                for (o = 0; o < q.length; o++)
                    g.push(q.charCodeAt(o))
            }
            for (i = 0; i < g.length; i++)
                g[i] = String.fromCharCode(g[i]);
            return g.join("")
        },
        lzExpandWithStaticDictionary: function(a, g, f) {
            // NOTE: g is always defined in our case
            // if (g === void 0 || g === []) {
            //     if (defaultDeDictionary === void 0 || defaultDeDictionary === []) {
            //         e();
            //         defaultDeDictionary = [];
            //         for (var h in defaultDictionary)
            //             defaultDeDictionary[defaultDictionary[h]] = h
            //     }
            //     g = defaultDeDictionary
            // }
            h = d;
            var r = b;
            f !== void 0 && (h = f - 1,
            r = f);
            for (var f = [], o = 0; o < a.length; ) {
                var q = a.charCodeAt(o);
                o++;
                q <= h ? f.push(String.fromCharCode(q)) : q >= r ? f.push(g[q]) : (q -= c,
                f.push(a.substr(o, q)),
                o += q)
            }
            return f.join("")
        }
    }
}()

function s(metadata) { // a is bookinfo.metadata
    var b = {};

    if (metadata.cpr !== void 0) {
        KindleCompression.lzAddStringsToDictionary(metadata.cpr, b),
        KindleCompression.lzAddNumbersToDictionary(b);
        return KindleCompression.lzGetDecompressionDictionary(b);
    }

    if (metadata.cprJson !== void 0) {
        KindleCompression.lzAddStringsToDictionary(metadata.cprJson, b, 256),
        KindleCompression.lzAddNumbersToDictionary(b, 256);
        return KindleCompression.lzGetDecompressionDictionary(b);
    }
}

function usageExit(errCode = 0) {
    console.log('usage: ' + process.argv[1] + ' -f <file> [--only-title]');
    console.log('Converts kindle books in a given Chrome/Chromium WebSQL file to HTML file(s).');
    console.log(' -f: Name of an sqlite file created by kindle cloud reader.');
    console.log('     Example for a typical path: ~/.config/google-chrome/Default/databases/https_read.amazon.com_0/2');
    console.log('     If you are using Chromium, look at ~/.config/chromium/Default/databases/ instead');
    console.log('     You may also have a different profile name then "Default"');
    console.log('\nThis program will not work with other browsers (e.g. Firefox) because of different WebSQL file formats.');

    process.exit(errCode);
}

// improve readability
const css = `
<style>
body {
    margin: 0 auto;
    max-width: 50em;
    background: #FFFAFD;
    font-size:100%;
    line-height:1.5;
}

img {
    max-width: 100%;
}
</style>
`

var os = require('osenv');
var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();

var process = require('process');
//

// http://read.amazon.com stores the ebook with webSQL, which is a sqlite accessible in Chrome
// in this case, kindle cloud reader :
//  => was opened with google-chrome
//  => the os is linux
//var KINDLE_DB = os.home() + '/.config/google-chrome/Default/databases/https_read.amazon.com_0/2';

if(process.argv.indexOf('--help') != -1) {
    usageExit(0)
}

if(process.argv.indexOf('-f') != -1) {
    KINDLE_DB = process.argv[process.argv.indexOf('-f') + 1];
} else {
    usageExit(1);
}

var db = new sqlite3.Database(KINDLE_DB);

// regex to locate and replace javascript fragments in the generated html
var rawGotoRegex = /<a href="#" onclick="KindleContentInterface\.gotoPosition\(\d+,(\d+)\); return false;" class="filepos_src" tabindex="-?\d+" id="a:.{1,4}">/g;
var rawDestRegex = /<a name="(\d+)" class="filepos_dest" id="a:.{1,4}">/g;
var modifiedGoto = '<a href="#$1" class="filepos_src">';
var modifiedDest = '<a id="$1" class="filepos_dest">';

// The following hack is from reverse engineering how kindle cloud app reads data
db.all("select metadata from 'bookinfo'", function(err, rows) {
    if(! rows) {
        throw "no metadata found, probably not a valid file";
    }
    rows.forEach(function (row) {
        var metadata = JSON.parse(row.metadata);
        var title = metadata.title;
        var authors = metadata.authorList.join(',');
        // used for dictionary request at https://read.amazon.com/dict/getDefinition?asin=<asin>&word=<word>
        var asin = metadata.asin;
        var ca = s(metadata);

        console.log('starting to process book: ' + title);

        var HtmlHeader = '<html><head>' + css +
            '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' +
            '<meta name="author" content="' + authors + '">' +
            '</head><body id="' + asin + '">';
        //var HtmlFile = path.join(os.tmpdir(), title.replace(/\s+/g, '-') + '.html');
        var HtmlFile = title.replace(/\s+/g, '-') + '.html';

        fs.writeFileSync(HtmlFile, HtmlHeader);
        console.log("created the file with HTML headers.");

        db.all("select id, piece, other from 'fragments' where asin='" + asin + "' order by id", function(err, rows) {
            rows.forEach(function (row) {
                var id = row.id;
                var compressedFragmentData = row.piece;
                var uncompressedFragmentData;
                var imageDataMap = JSON.parse(row.other).imageData || {};
                uncompressedFragmentData = KindleCompression.lzExpandWithStaticDictionary(
                    row.piece, ca);
                // replace the javascript links with hard coded html anchors
                uncompressedFragmentData = uncompressedFragmentData.replace(rawGotoRegex, modifiedGoto);
                uncompressedFragmentData = uncompressedFragmentData.replace(rawDestRegex, modifiedDest);
                // replace image path with base64 encoded string
                for (var image in imageDataMap) {
                    uncompressedFragmentData = uncompressedFragmentData.replace(
                        'dataUrl="' + image + '"',
                        'src="' + imageDataMap[image] + '"');
                }
                fs.appendFileSync(HtmlFile, uncompressedFragmentData);
            });
        });

        fs.appendFileSync(HtmlFile, '</body></html>');
        console.log("created the file at: " + HtmlFile);
    });
});
