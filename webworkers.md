IMSC and webworkers

Parsing a TTML file can be CPU intensive - e.g. 3-400ms for a large one.  If you don't want this to impact your GUI thread, you can now run the parse in a webworker.

Two new master modules are defined:

webworkerworker.js - this is the code which is loaded into the webworker, and contains everything required to parse the TTML, and to produce ISDs.

webworkermain.js - this is the code you load into your UI thread.  It contains the code required to render an ISD.

These are browserified into single JS files in dist.

A sample usage is included in src/test/webapp/webworkersample.html



