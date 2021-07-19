IMSC and webworkers

Parsing a TTML file can be CPU intensive - e.g. 3-400ms.  If you don't want this to impact your GUI thread, you can now run the parse in a webworker.
