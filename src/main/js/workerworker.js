/* 
 * Copyright (c) 2016, Pierre-Anthony Lemieux <pal@sandflow.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

 
exports.generateISD = require('./isd').generateISD;
exports.fromXML = require('./doc').fromXML;

self.currentDocs = {};

onmessage = function(oEvent) {
  var error; //===undefined
  switch(oEvent.data.cmd){
    case 'parse':{
      var doc;
      if (oEvent.data.tag){
        try{
          doc = self.currentDocs[oEvent.data.tag] = imsc.fromXML(oEvent.data.filetext);
        } catch (e) {
          error = e.toString();
        }
      } else {
        error = 'imsc worker parse needs a tag';
      }
      postMessage({
        cmd:'parsed', 
        times:doc?doc.getMediaTimeEvents():[], 
        tag:oEvent.data.tag, 
        error:error
      });
    } break;
    
    case 'isd':{
      var isd;
      if (oEvent.data.tag && self.currentDocs[oEvent.data.tag]){
        try {
          isd = imsc.generateISD(self.currentDocs[oEvent.data.tag], oEvent.data.time);
        } catch(e){
          error = e.toString();
        }
      } else {
        error = 'unknown tag '+oEvent.data.tag;
      }
      postMessage({cmd:'isd', tag:oEvent.data.tag, time: oEvent.data.time, isd:isd, error: error});
    } break;
    
    case 'releasetag':{
      if (oEvent.data.tag && self.currentDocs[oEvent.data.tag]){
        delete self.currentDocs[oEvent.data.tag];
      } else {
        error = 'unknown tag '+oEvent.data.tag;
      }
      postMessage({cmd:'releasetag', tag:oEvent.data.tag, error:error});
    } break;
    
    default:{
      error = 'imsc worker: unknown cmd:'+oEvent.data.cmd;
      postMessage({cmd:'error', tag:oEvent.data.tag, error:error});
    } break;
  }
};

