IMSC and webworkers

Parsing a TTML file can be CPU intensive - e.g. 3-400ms.  If you don't want this to impact your GUI thread, you can now run the parse in a webworker.

Two new master module are defined:

webworkerworker.js - this is the code which is loaded into the webworker, and contains everything required to parse the TTML, and to produce ISDs.

webworkermain.js - this is the code you load into your UI thread.  It contains the code required to render an ISD.


