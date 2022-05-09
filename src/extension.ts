import * as vscode from "vscode";
import * as cp from "child_process";
import { performance } from 'perf_hooks';
import _ = require("lodash");
import fs = require('fs');
import math = require("mathjs");
import moment = require("moment"); //lodash, mathjs & moment for vm & eval scripts
import vm = require('vm');
import util = require('util');
let codeBlock = ""; //code f or execution
let startCode = -1; //start line of code
let out: string = ""; //output from code execution
let out1: string = ""; //output from code execution
const swap = "=>>"; //3 char string to indicate pos for in-line result
let needSwap = false; //no swaps so leave code as is
let hePath = ""; //path to hover-exec extension files
let windows = process.platform.startsWith("win"); //os is windows
let slash = '/'; //to use between tempPath and tempName
if (windows) { slash = '\\'; }
let tempPath: string = ""; //  path for temp files (provided by vscode)
let tempFsPath: string = ""; //fsPath for temp files (provided by vscode)
let tempName: string = ""; //file name of temp file for current script
let outName: string = ""; //file name of temp file for current script output
let startTime: number = Date.now(); //time of last exec start
let cmdId = ""; //execution id for current script
let cmd = ""; //javascript to start current script execution
let shown = false; //progress message 1 showinf
let currentFile = ""; //path & name of current edit file
let currentFilePath = ""; //path of current edit file
let currentFsFile = ""; //path & name as os default string
let currentFsFilePath = ""; //path as os default string
let currentPath = ""; //folder containing current edit file
let currentFsPath = ""; //folder containing current edit file fsPath
let executing = false; //code is executing
let iexec = -1; //number of currently executing code (set to nexec)
let nexec = 0;  //provides number of currently executing code (auto incremented)
let oneLiner = false; //current script is a 'one-liner'
let edit = false; //open link in vscode editor
let quickmathResult = '';//result of math.evaluate
let inline = false; //if true disallows inline results
let noOutput = false; //if true ignore output
let ch: cp.ChildProcess; //child process executing current script
let repl: cp.ChildProcess; //current REPL
let chRepl: Array<[string, cp.ChildProcess]> = []; //array of active REPLs
let useRepl = false; //use REPL to execute code
let restartRepl = false; //force restart REPL
let cursLine: number = 0; //cursor line pos
let cursChar: number = 0; //cursor char pos
let showKey = false; //show key pressed (use when creating gif)
let replaceSel = new vscode.Selection(0, 0, 0, 0); //section in current editor which will be replaced
let config = vscode.workspace.getConfiguration("hover-exec"); //hover-exec settings
let opt = {}; //child process execution options
const log = console.log; //saves console.log address to allow reconfig
let vmDefault = {
  global, globalThis, config, vscode, //vm default context
  console, util, process, performance, abort, alert, delay,
  execShell, input, progress, status, readFile, writeFile,
  write, require: vmRequire, _, math, moment
};
let vmContext: vm.Context | undefined = undefined; //only shallow clone needed
const refStr =
  "*hover-exec:* predefined strings:\n" +
  " - %c `path/` of the current workspace folder\n" +
  " - %d `path/` of the current editor file\n" +
  " - %e `path/name.ext` of the current editor file\n" +
  " - %f `path/name.ext` of temporary file\n" +
  " - %g `path/` for temporary files\n" +
  " - %h `path/` of hover-exec's extension folder\n" +
  " - %n `name.ext` of temporary file\n" +
  " - The required ext can be specified by appending .ext, eg. %f.py\n" +
  " - %C,D,E,F,G,X use \ instead of /, windows is usually ok with either\n";
const msgDel =
  "[ [*command line vars %f etc*] ](vscode://rmzetti.hover-exec?ref) " +
  "[ [*delete block*] ](vscode://rmzetti.hover-exec?delete_output)\n\n";
let msg = "", cmda = "", mpe = "", comment = "", full = "";  //for cmd line parse
let os = 'win'; //set current os
if (!windows) {
  if (process.platform === 'darwin') { os = 'mac'; }
  else {
    os = 'lnx';
    if (process.env.VSCODE_WSL_EXT_LOCATION !== undefined) { os = 'wsl'; }
  }
}

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerHoverProvider(
    "markdown",
    new (class implements vscode.HoverProvider {
      async provideHover(
        doc: vscode.TextDocument,
        pos: vscode.Position,
        token: vscode.CancellationToken
      ): Promise<vscode.Hover | null> {
        if (executing) {
          //if already executing code block, show cancel option
          return new vscode.Hover(
            new vscode.MarkdownString(
              "*hover-exec:* executing...\n\n[cancel execution](vscode://rmzetti.hover-exec?abort)"
            )
          );
        }
        status(''); //clear status message
        let line = doc.lineAt(pos); //user is currently hovering over this line
        let quickmath = false; //current script is 'quickmath' (executed by hover)
        edit = false; //current script is not 'edit' (executed by hover)
        oneLiner = false; //one-liner
        quickmath = false;  //quick evaluate using mathjs, or a regex search
        let includeHere = false;    //an 'inhere' (include) line
        setExecParams(context, doc); //reset basic exec parameters
        if (!line.text.startsWith("```")) { //check for oneLiner, quickmath, includeHere
          oneLiner = line.text.startsWith("`") && line.text.slice(2).includes("`");
          quickmath = /`.+=`/.test(line.text) || /`\/.+\/`/.test(line.text); //allow eg. `1+2=` or `/1+2/`
          edit = line.text.includes("`edit");
          includeHere = /#inhere.*#\w+/.test(line.text);
          if (!oneLiner && !quickmath && !includeHere && !edit) {
            return null;
          } //ignore if not a code block, oneLiner, edit or quickmath
        }
        if (includeHere) { //show tagged content
          return new vscode.Hover(new vscode.MarkdownString(
            "[" + (await inHere(line.text)).replace(/\n/g, ' ') + "](vscode://rmzetti.hover-exec?copyToClipboard)"
          ));
        }
        else if (quickmath) { //evaluate math expressions like `44-2=` using mathjs
          //also evaluate re eg. `/($speed << EOD.*EOD)/`
          return await doQuickmath();
        }
        else if (edit) { //open in vscode editor
          [cmd,cmda] = getFileToEdit(line.text,pos.character);
          if (cmd==="") { return null; }
          cmdId="edit";
          let url = "vscode://rmzetti.hover-exec?" + cmdId; //cmdId;//create hover message, declare as trusted, and return it
          const contents = new vscode.MarkdownString(
            "*hover-exec:* edit in vsCode " + "\n\n**[" + cmd + " =>>](" + url + ")**"
          );
          contents.isTrusted = true; //set hover links as trusted
          return new vscode.Hover(contents); //return link string
        }
        if (line.text === "```") {
          //allow hover-exec from end of code block
          let n = getStartOfBlock(doc, pos); //if at end, get start of block
          if (n < 0) {
            return null;
          } //if can't find start ignore
          pos = new vscode.Position(n, 0); //adjust pos and line
          line = doc.lineAt(pos); //to refer to start of block
        }
        startCode = pos.line; //save start of code line number
        parseLine(line.text);
        cursLine = 0; //do not reset cursor pos for hover click
        let script = config.get("scripts." + cmdId) as string; //undefined if not a 'built-in' script
        if (script) {
          //if predefined script engine
          cmd = replaceStrVars(script); //expand %f etc & get tempName
          codeBlock = getCodeBlockAt(doc, pos); //save code block
          let url = "vscode://rmzetti.hover-exec?" + cmdId; //url for hover
          if (comment !== '') {
            comment = ' *' + comment + '*';
          }
          let msg = comment + "\n\n";
          comment
          if (oneLiner) {
            msg += "**[" + replaceStrVars(full) + " =>>](" + url + ")**";
          } else {
            let msgOpen = //to open last script & result
              "[ [*clear output*]  ](vscode://rmzetti.hover-exec?clear_all) " +
              "[ [*open last script*] ](" + vscode.Uri.file(tempPath + '/' + tempName) + ") " +
              "[ [*open last result*] ](" + vscode.Uri.file(tempPath + '/' + tempName + ".out.md") + ")\n\n";
            msg +=
              "[ [*config*] ](" + url + "_config) " + //add hover info
              msgDel + msgOpen + "**[ exec: " + cmdId + " =>> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ](" + url + ")**";
          }
          const contents = new vscode.MarkdownString("hover-exec: " + msg);
          contents.isTrusted = true; //set hover links as trusted
          return new vscode.Hover(contents); //and return it
        } else if (cmdId === "output") {
          //create & return message & urls for output hover
          cmdId = "delete";
          let msgOut = "*hover-exec:*\n\n[output block to text](vscode://rmzetti.hover-exec?text_output)\n\n";
          if (iexec === nexec) msgOut += "[all output to text](vscode://rmzetti.hover-exec?full_output)\n\n";
          msgOut += "[delete output block](vscode://rmzetti.hover-exec?delete_output)"; //hover for output delete
          return new vscode.Hover(new vscode.MarkdownString(msgOut));
        } else if (oneLiner) {
          //create & return hover-message and urls for one-liners
          cmd = replaceStrVars(full);
          cmdId = "oneliner";
          let url = "vscode://rmzetti.hover-exec?" + cmdId; //cmdId;//create hover message, declare as trusted, and return it
          const contents = new vscode.MarkdownString(
            "*hover-exec:* " + comment + "\n\n**[" + cmd + " =>>](" + url + ")**"
          );
          contents.isTrusted = true; //set hover links as trusted
          return new vscode.Hover(contents); //return link string
        } else {
          //create and return hover message & urls for non-built-in commands
          cmd = replaceStrVars(full); //replace %f etc in full string
          codeBlock = getCodeBlockAt(doc, pos); //save code block
          let url = "vscode://rmzetti.hover-exec?"; //create hover message
          let msg =
            "&nbsp; [ [*config*] ](" + url + cmdId + "_config) " + "[ [*last script*] ](" +
            vscode.Uri.file(tempPath + '/' + tempName) + ")" + "[ [*last result* ] ](" +
            vscode.Uri.file(tempPath + '/' + tempName) +
            ".out.md)\n\n" + "**[" + pad(cmd + comment) + " =>>](" + url + cmdId + ")**";
          const contents = new vscode.MarkdownString(
            "hover-exec:" + cmdId + msg
          );
          contents.isTrusted = true; //set hover links as trusted
          return new vscode.Hover(contents); //and return it
        }
        async function doQuickmath() {
          let s = line.text;
          if (s[pos.character] === '`') { return null; } //hover over the expression not backticks
          let s1 = s.slice(0, pos.character);//there may be more than one expression in a line
          let s2 = s.slice(pos.character);  //so isolate parts before & after hover pos
          if (!s1.includes('`') || !s2.includes('`')) { return null; }
          s2 = s2.slice(0, s2.indexOf('`'));
          quickmath = s2.endsWith('='); //otherwise regex
          let f = '';
          if (!quickmath) { // then if an inhere line get the file name if present
            f = s1.replace(/.*#inhere (.*?)`.*/, '$1').trim();
            if (f === '') {
              f = doc.getText();
            }
            else {
              //f=fs.readFileSync(replaceStrVars(f),'utf-8');
              f = await readFile(replaceStrVars(f));
            }
            status('ok');
          }
          s1 = s1.slice(s1.lastIndexOf('`') + 1);
          if (!quickmath) { s1 = s1.slice(1); }
          s2 = s2.slice(0, s2.length - 1);
          s1 = s1 + s2;
          if (quickmath) {
            s2 = 'hover-exec via mathjs';
            quickmathResult = '' + math.evaluate(s1);
          } else { //evaluate 'simplified' regex on file contents
            //which specifies what is being looked for, & interprets . as [\s\S] 
            s2 = 'hover-exec via regex:\n';
            s1 = s1.replace(/\./g, '[\\s\\S]'); //make . mean all chars
            s1 = s1.replace(/[*]([^?])/g, '*?$1');   //make * not greedy
            let re = new RegExp('[\\s\\S]*?(' + s1 + ')[\\s\\S]*', "m");
            quickmathResult = f.replace(re, '$1');
          } //save result for copy to clipboard
          if (quickmathResult === '') { return null; }
          s1 = "[ " + quickmathResult + " ](vscode://rmzetti.hover-exec?copyToClipboard)";
          const contents = new vscode.MarkdownString(s2 + ":\n\n" + s1);
          if (quickmath) { status(quickmathResult); }
          return new vscode.Hover(contents);
        }
      };
    })()
  );

  context.subscriptions.push( //register exec command
    vscode.commands.registerCommand("hover-exec.exec", () => {
      //process exec command (default shortcut Alt+/ ) -- find start of block and execute
      status(''); //clear status message
      let editor = vscode.window.activeTextEditor;
      if (editor) {
        if (showKey) {
          progress("\u00A0\u00A0\u00A0\u00A0 Alt + /", 1);
        }
        let doc = editor.document; //get document
        let pos = editor.selection.active; //and position
        let s = doc.lineAt(pos).text; //get current line text
        let h='';
        if (s.includes('`edit')) { //possibly an edit command
          [cmd,cmda]=getFileToEdit(s, pos.character); 
          if(cmd!==""){ //if it is an edit command
            hUri.handleUri(vscode.Uri.parse("vscode://rmzetti.hover-exec?edit"));
            return;
          }
        }
        cursLine = pos.line;
        cursChar = pos.character; //when command was executed
        let n = getStartOfBlock(doc, pos); //get start of code block
        if (n < 0) {
          return null;
        } //if not in code block ignore
        setExecParams(context, doc); //reset basic execute parameters
        pos = new vscode.Position(n, 0); //set position at start of block
        let line = doc.lineAt(pos); //get command line contents
        if (executing) {
          hUri.handleUri(vscode.Uri.parse("vscode://rmzetti.hover-exec?abort"));
          progress("previous exec aborted", 500);
          return; //if processing cancel job and ignore
        }
        startCode = pos.line; //save start of code line number
        parseLine(line.text);
        let url = "";
        let script = config.get("scripts." + cmdId); //json object if cmdId is a 'built-in' script
        if (script) {
          //predefined script engine strings
          cmd = replaceStrVars(script as string); //expand %f etc & get tempName
          codeBlock = getCodeBlockAt(doc, pos); //save code block
          url = "vscode://rmzetti.hover-exec?" + cmdId; //url as for hover execute
        } else if (cmdId === "output") {
          url = "vscode://rmzetti.hover-exec?delete_output"; //cursor in output block: delete the block
        } else if (oneLiner) {
          cmd = full;
          cmd = replaceStrVars(cmd);
          cmdId = "oneliner"; //set command for exec by hUri.handleUri
          url = "vscode://rmzetti.hover-exec?oneLiner";
        } else {
          //other commands
          line = doc.lineAt(cursLine); //get line where command was executed
          cmd = replaceStrVars(full);
          codeBlock = getCodeBlockAt(doc, pos); //save code block
          url = "vscode://rmzetti.hover-exec?" + cmdId; //using url enables re-use of hover-execute code
        }
        hUri.handleUri(vscode.Uri.parse(url)); //execute code block via url
      }
    })
  );

  context.subscriptions.push(vscode.window.registerUriHandler(hUri));

  context.subscriptions.push( //register readme command
    vscode.commands.registerCommand("hover-exec.readme", () => {
      vscode.commands.executeCommand("vscode.open", vscode.Uri.file(context.extensionPath + "/README.md"));
    })
  );

  function setExecParams(
    context: vscode.ExtensionContext,
    doc: vscode.TextDocument
  ) {
    cmd = ""; //reset start line parameters
    cmda = "";
    cmdId = "";
    comment = "";
    full = "";
    mpe = "";
    needSwap = false; //set true if in-line swaps required
    codeBlock = "";
    //reset paths and names
    currentFile = doc.uri.path; //current editor file full path /c:...
    currentFilePath = currentFile.slice(0, currentFile.lastIndexOf('/'));
    if (windows) { //remove starting / for windows
      currentFile = currentFile.replace(/^\//, '');
      currentFilePath = currentFilePath.replace(/^\//, '');
    } 
    currentFsFile = doc.uri.fsPath; //os specific currentFile c:\...  (%e)
    if (windows) {
      currentFsFilePath = currentFsFile.slice(0, currentFsFile.lastIndexOf('\\'));
    } else {
      currentFsFilePath = currentFsFile.slice(0, currentFsFile.lastIndexOf('/'));
    }
    if (vscode.workspace.workspaceFolders) { //if workspace open
      currentPath = vscode.workspace.workspaceFolders[0].uri.path;
      if (windows) { currentPath = currentPath.replace(/^\//, ''); } //remove starting / for windows
      currentFsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    } else { //if no workspace open use current file path
      currentPath = currentFilePath;
      currentFsPath = currentFsFilePath;
    }
    vscode.workspace.fs.createDirectory(context.globalStorageUri); //create temp folder if necessary
    tempPath = context.globalStorageUri.path; //temp folder path %g
    tempFsPath = context.globalStorageUri.fsPath; //temp folder path
    tempName = "temp.md"; //temp file name, can be used as (%n)
    if (windows) {
      tempPath = tempPath.replace(/^\//, ""); //remove starting / for windows
    }
  } //end function setExecParams

  function getSpecialPath(s: string) {
    //special path/name in command line
    s = replaceStrVars(s); //special path can include %f %g etc
    if (s.includes("/")) {
      tempName = s.slice(s.lastIndexOf("/") + 1);
      tempPath = s.slice(0, s.lastIndexOf("/"));
      tempFsPath = tempPath;
      if (windows) { //remove starting / and use \ for tempFsPath
        tempPath = tempPath.replace(/^\//, "");
        tempFsPath = tempPath.replace(/\//g, "\\");
      }
    } else { //this usually windows
      tempName = s.slice(s.lastIndexOf("\\") + 1);
      tempFsPath = s.slice(0, s.lastIndexOf("\\"));
      tempPath = tempFsPath.replace(/\\/g, "/").replace(/\/\//g, "/");
    }
  }

  function parseLine(s: string) {
    function posComment(s: string) {
      //find start of comment in command line <!--,//,# only
      let ipos = s.indexOf("<!--"); // find <!--
      if (ipos <= 0) { // find // but exclude ://, ie. allow links in the line
        ipos = s.replace("://", "xxx").indexOf("//");
      }
      if (ipos <= 0) { // find #
        ipos = s.indexOf("#");
      }
      return ipos;
    }
    noOutput = s.includes("`>"); //in a one-liner, appending > suppresses output
    inline = !s.toLowerCase().includes("noinline"); //allows normal use of =>>
    s = s.replace(/noInline|noinline/, "");
    let ipos = posComment(s); //find comment in cmd line <!--,//,#
    if (ipos > 0) {
      comment = s.slice(ipos); //save comment as msg for hover
      s = s.slice(0, ipos); //and remove
    }
    if (oneLiner) { //get backtick content
      s = s.replace(/^`(.*?)`.*/, "$1");
    }
    else { //remove initial triple backtick
      s = s.slice(3);
    }
    if (/{.*}/.test(s)) { //for markdown preview enhanced
      mpe = s.replace(/.*({.*}).*/, "$1"); //save bracket
      s = s.replace(/{.*}/, ""); //and remove
    }
    s = s.replace(/\s+/g, " ").trim(); //collapse multiple spaces
    full = s;        //save full command line minus comments & {..}
    if (/^\w/.test(s)) { //if starts with an id determine cmdId
      cmda = s.replace(/^(\w*).*/, "$1");
      useRepl = /^\w+\s?:\s?\w*:/.test(s); //allow spaces either side of :
      if (useRepl) { //check for repl restart
        restartRepl = /^\w+\s?:\s?\w*:restart/.test(s);
      }
      if (/^\w+\s?:\s?\w/.test(s)) { //if `id1:id2 is used, set cmdId=id2
        cmdId = s.replace(/^\w*\s?:\s?(\w*).*/, "$1");
        //eg. for 'js:eval' cmdId is 'eval'
        //for vmdf and cmin set cmdId to vm and set vmContext appropriately
        if (cmdId === 'vmdf') { vmContext = undefined; cmdId = 'vm'; }
        //for 'js:def' set default context & cmdId='vm'
        else if (cmdId === 'vmin') { vmContext = { write }; cmdId = 'vm'; }
        //for 'js:min' set min context & cmdId='vm'
      } else { //otherwise set cmdId=id1
        cmdId = cmda; //eg. for 'js asdf' cmdId is 'js'
      }
    }
    if ( //check for special paths: >path/to/file.abc, >'path/to/fi le.abc', & ".."
      full.indexOf(">") > 0 && //if there's a > with no preceding < (ignores <..>)
      (full.indexOf("<") === -1 || full.indexOf("<") >  full.indexOf(">"))
    ) {
      full += " ";
      //getSpecialPath(full.replace(/(\s>.*?)[\s,;].*/, "$1")); //if special path included, use it
      //full = full.replace(/>.*?[\s,;]+/, "").trim(); //& remove from full
      getSpecialPath(full.replace(/.*?>"(.*?)".*/,'$1')  //if special path included, use it
        .replace(/.*?>'(.*?)'.*/,'$1')
        .replace(/.*?>([^\s]*?)\s.*/,'$1'));
      full=full.replace(/>".*?"/,'').replace(/>'.*?'/,'').replace(/>[^\s]*?\s/,''); //& remove it
    }
  }

  function getFileToEdit(s :string, n:number) {
    if (s[n] === '`') { n-=1; } //hover over the expression not backticks
    let s1 = s.slice(0, n);//there may be more than one expression in a line
    let s2 = s.slice(n);  //so isolate parts before & after hover pos
    if (!s1.includes('`') || !s2.includes('`')) { return ""; }
    s1 = s1.slice(s1.lastIndexOf('`') + 1);
    s2 = s2.slice(0,s2.indexOf('`'));
    s1 = s1 + s2;
    if(!s1.startsWith('edit')) { return ""; } //not edit command
    s1=replaceStrVars(s1.slice(5)); //allow use of %cdefgh
    let m=s1.indexOf('#');
    let h='';
    if(m>0) { 
      h=s1.slice(m+1);
      s1=s1.slice(0,m);
    } //remove comment
    if(!/\.[^\/]*$/.test(s1)) { s1+='.md'; } //no .ext, default is .md
    return [s1,h];
  }
  
  function pad(s: string) {
    if (s.includes("&emsp;")) {
      //remove previous padding
      s = s.slice(0, s.indexOf("&emsp;"));
    } // pad out to 16 ch with em spaces (for bottom line of hover)
    for (let i = s.length; i < 16; i++) {
      s += "&emsp;";
    }
    return s;
  }

  function getCodeBlockAt(doc: vscode.TextDocument, pos: vscode.Position) { //return code in code block depending on type
    const { activeTextEditor } = vscode.window;
    let s = "";
    if (activeTextEditor) {
      let n = pos.line + 1;
      if (oneLiner) {
        //return all after first space up to backtick
        //this is a oneliner with valid script id
        let s1 = doc.lineAt(pos).text.slice(1);
        s1 = replaceStrVars(s1.slice(s1.indexOf(" ") + 1, s1.indexOf("`"))); //.replace(/\\/g,'/');
        return s1;
      }
      if (doc.lineAt(pos).text.endsWith("```")) {
        return ""; //return empty string
      }
      while (n < doc.lineCount) {
        let a = doc.lineAt(new vscode.Position(n, 0)).text;
        n++;
        if (a.startsWith("```")) {
          break; //stop at line starting with ```
        } else {
          //add line to code buffer
          s = s + a + "\n";
        }
      }
    }
    return s;
  } //end function getCodeBlockAt

  function getStartOfBlock(doc: vscode.TextDocument, pos: vscode.Position) { 
    //return start of code block containing ```, or -1
    let temptxt = doc.lineAt(pos).text;
    oneLiner =
      !temptxt.startsWith("```") &&
      temptxt.startsWith("`") &&
      temptxt.slice(2).includes("`");
    //oneliner is whole script in single line: uses single backtick at start of line & at end of command
    if (
      oneLiner ||
      (temptxt.startsWith("```") && temptxt.slice(3).trim().length > 0)
    ) {
      return pos.line; //if a oneliner or normal start line return line number
    }
    let n = pos.line - 1; //start here and look backwards for start line
    while (n >= 0 && !doc.lineAt(new vscode.Position(n, 0)).text
      .startsWith("```")) { n -= 1; }
    if (doc.lineAt(new vscode.Position(n, 0)).text === "```") {
      return -1;
    } //if end line, return -1
    else {
      return n;
    } //normal start line return line number
  }

  async function checkJsonVisible() {
    // ensure script, swapper and repls visible in settings.json
    let s = { undefined: undefined };
    let temp = config.get("scripts");
    let merge = Object.assign({}, temp, s);
    await config.update("scripts", merge, 1);
    temp = config.get("swappers");
    merge = Object.assign({}, temp, s);
    await config.update("swappers", merge, 1);
    temp = config.get("repls");
    merge = Object.assign({}, temp, s);
    await config.update("repls", merge, 1);
    config = vscode.workspace.getConfiguration("hover-exec");
  }

  let checkit = false;
  async function checkConfig() {
    async function checkOS(section: string) {
      let scripts = config.get(section);
      if (config.get(section + ".os") === "") {
        let k = Object.keys(scripts as object);
        let merge = {};
        merge = Object.assign(merge, { "os": os + " (auto)" });
        for (let a in k) {
          let s = config.get(section + '.' + k[a] + '_' + os);
          if (s !== undefined && s !== "") {
            merge = Object.assign(merge, { [k[a]]: s });
          }
        }
        await config.update(section, merge, 1);
        config = vscode.workspace.getConfiguration("hover-exec");
      }
    }
    config = vscode.workspace.getConfiguration("hover-exec");
    await checkOS('scripts'); //changes default scripts to match os if provided
    await checkOS('repls');   //changes default repls to match os if provided
    await checkJsonVisible(); //ensures settings visible in settings.json
    vmDefault = {
      global, globalThis, config, vscode, console, util, process, performance, abort, alert, delay,
      execShell, input, progress, status, readFile, writeFile, write, require: vmRequire, _, math, moment
    };
    vmContext = { ...vmDefault };
    opt = {};
    let s = (config.get("scripts.os") as string).replace(/.*\((.*)\).*/, '$1');
    if (s === 'auto') {
      if (process.platform === 'darwin' || process.platform === 'linux') {
        opt = { shell: '/bin/bash' };
      } else {
        opt = { shell: true };
      }
    } else {
      opt = { shell: s };
    }
    checkit = true;
  }

  context.subscriptions.push( //onDidChangeConfigurations
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (checkit) {
        checkit = false;
        await checkConfig(); //ensures scripts, repls & swappers available in settings.json
      }
    })
  );

  checkConfig(); //set default configs (only) to their os values (if provided)
  hePath = context.extensionPath.replace(/\\/g, '/'); //path to hover-exec extension files
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 500);
  context.subscriptions.push(statusBarItem); //setup status bar item & show h-e version
  status(os + ' v' + vscode.extensions.getExtension('rmzetti.hover-exec')?.packageJSON.version);

} //end function activate

const hUri = new (class MyUriHandler implements vscode.UriHandler {
  //handle hover exec commands (command is in uri.query)
  async handleUri(uri: vscode.Uri): Promise<void | null | undefined> {
    if (uri.query === "abort") {
      //cancel has been clicked, kill executing task
      executing = false;
      ch.kill();
      repl.kill();
      return;
    }
    if(uri.query === "edit" && vscode.window.activeTextEditor) {
      await vscode.window.showTextDocument(vscode.Uri.file(cmd));
      let f = vscode.window.activeTextEditor.document.getText();
      let myRe = new RegExp('^#* '+cmda,'mi');
      let m=vscode.window.activeTextEditor.document.positionAt(f.search(myRe)).line;
      vscode.window.activeTextEditor.revealRange(new vscode.Selection(m, 0, m+30, 0));
      vscode.window.activeTextEditor.selection = new vscode.Selection(m, 0, m, 0);
      return;      
    }
    if (uri.query === "delete_output" || uri.query === "text_output" ||
      uri.query === "full_output") {
      await deleteOutput(uri.query); //full to text
      return;
    }
    if (uri.query === "ref") {
      const value = await vscode.window.showQuickPick(
        ["%c     workspace folder 'path/': " + replaceStrVars('%c'),
        "%d     this file 'path/': " + replaceStrVars('%d'),
        "%e     this file 'path/name.ext': " + replaceStrVars('%e'),
        "%f.ext temp file 'path/name.ext': " + replaceStrVars('%f.ext'),
        "%g     temp folder 'path/': " + replaceStrVars('%g'),
        "%n.ext temp file 'name.ext': " + replaceStrVars('%n.ext'),
        "%h     h-e extension folder 'path/': " + replaceStrVars('%h')],
        { placeHolder: "Predefined paths reference (can add .ext, eg. python temp file is %f.py)" });
      if (value) {
        await vscode.env.clipboard.writeText(value);
      }
      return;
    }
    if (uri.query === "clear_all") {
      needSwap = true; await clear();
      removeSelection();
      return;
    }
    if (uri.query === "copyToClipboard") {
      status('copied ' + quickmathResult);
      await vscode.env.clipboard.writeText(quickmathResult);
      return;
    }
    if (uri.query.endsWith("_config")) {
      //show current script config
      if (useRepl) {
        vscode.commands.executeCommand('workbench.action.openSettingsJson');
        return;
      }
      let d = await vscode.window.showInputBox({
        placeHolder: "config",
        prompt: 'id= ' + cmdId + ', just enter to open settings.json ',
        value: config.get('scripts.' + cmdId)
      });
      if (d !== undefined) {
        let scripts = config.get('scripts');
        let id = config.get('scripts.' + cmdId);
        if (d === id || (d === '' && id === undefined)) {
          vscode.commands.executeCommand('workbench.action.openSettingsJson');
        } else {
          if (d === 'undefine' || d === 'undefined' || d === '') { d = undefined; }
          let merge = {};
          merge = Object.assign(merge, scripts, { [cmdId]: d });
          await config.update('scripts', merge, 1);
          config = vscode.workspace.getConfiguration("hover-exec");
        }
      }
      return;
    }
    nexec += 1; //script exec number for check to ensure output is from latest script
    startTime = Date.now();//record script start time
    needSwap = inline && codeBlock.includes(swap);
    let code = codeBlock; //code will contain the code for execution
    if (needSwap) {
      let re = new RegExp("(.+" + swap + ").*", "mg"); //regex to find previous results
      codeBlock = codeBlock.replace(re, "$1");         //& remove from codeBlock
      code = codeBlock.replace(/^\s*(--|#|%|\/\/).*=>>$/mg, ''); //remove commented lines with swap
      //disable swap in fully commented lines by appending a space
      codeBlock = codeBlock.replace(/^(\s*(--|#|%|\/\/).*=>>)$/mg, '$1 ');

      re = new RegExp("\\s*(--|#|%|\/\/)*\\s*" + swap + '$', "mg"); //find any comment chars directly preceding a swap
      code = code.replace(re, swap); //remove them -- note \\s required in re, not just \s
      re = new RegExp("^(.+)" + swap, "mg"); //regex finds swap lines, sets $1 to expr
      let re1 = new RegExp("[`]=>>", "");//new RegExp("[`'\"]=>>", "");
      let swapper = config.get("swappers." + cmdId) as string;
      if (swapper && !re1.test(code)) {
        //replace all with swapper (uses $1)
        code = code.replace(re, swapper);
      } else {
        //if no swapper defined replace all with $1
        code = code.replace(re, "$1");
      }
    }
    vscode.window.withProgress({
      //set up status bar progress indicator
      location: vscode.ProgressLocation.Window,
      title: "Hover-exec", //title for progress display
    },
      async (prog) => {
        executing = true; //set 'executing' flag
        iexec = nexec; //& save exec number for this script
        out = ""; //reset output buffer
        prog.report({ message: "executing " + cmdId }); //progress report; 
        if (config.clearPrevious) {
          await clear(); removeSelection();
        } else {
          await delay(10); //ensure progress report is visible
        }
        code = hrefSrcReplace(code);
        code = await inHere(code); //replace #inhere       
        if (code !== '') { writeFile(tempPath + '/' + tempName, code); } //saves code in temp file for execution
        process.chdir(currentFsPath);
        if (cmd !== '') {
          if (cmd === 'eval' || cmd === 'vm') { //use vscode internal js
            //reassign console.log to write to view logs in output
            //wrap with an async function to allow use of await (eg for input, delays,etc) 
            //code=`async function __main(){console.log=write;`+code+`};__main();`;
            code = `async function __main(){` + code.replace(/console\.log/g, 'write') + `};__main();`;
            try {
              if (cmd === 'eval') {
                await eval(code);//execute, out produced by 'write'
              } else {
                if (vmContext === undefined) {
                  vmContext = { ...vmDefault }; //context undefined, use default (only shallow copy needed)
                }
                let vcContext = vm.createContext(vmContext);//prepare context 
                let script = new vm.Script(code);//syntax check
                await script.runInContext(vcContext);//execute, out produced by 'write'
              }
            } catch (e) {      //if syntax error
              needSwap = false;  //then don't do swap
              out = 'error ' + e;  //report error in output block
            }
          } else {
            if (useRepl) {//repl parameters from config
              let rp = config.get("repls." + cmdId) as Array<string | Array<string>>;
              let chitem = chRepl.find((el) => el[0] === cmdId);
              if (chitem === undefined || restartRepl) {
                if (chitem !== undefined) { //restart the repl
                  chRepl.splice(chRepl.findIndex((el) => el[0] === cmdId), 1);
                }
                execRepl(rp[0] as string, rp[1] as Array<string>);
                chRepl.push([cmdId, repl]);
                await delay(1000);
              } else {
                repl = chitem[1];
              }
              out1 = ''; //used by stdio for replOutput 
              code = "\n" + code + "\n" + rp[2] + "\n"; //script to output formfeed to indicate completion
              if (rp[3] !== []) { //preprocessing eg. handle python indents
                let i = 0;
                while (i < rp[3].length - 1) {
                  let re = new RegExp(rp[3][i], "mg");
                  code = code.replace(re, rp[3][i + 1]);
                  i += 2;
                }
              }
              repl.stdin?.write(code);
              out = await replOutput();
              if (rp[4] !== "") { //postprocessing (eg. lua,node)
                //rp[4] has one or more regexp
                let i = 0;
                while (i < rp[4].length - 1) {
                  let re = new RegExp(rp[4][i], "mg");
                  out = out.replace(re, rp[4][i + 1]);
                  i += 2;
                }
              }
            } else {
              out = await execShell(cmd); //execute all other commands
              if (cmdId === "buddvs") {   //local script tester
                out = out.replace(/�/g, "î");
              }
            }
          }
        } else {
          out = uri.toString(); //no ex, return uri
        }
        executing = false;     //execution finished
        if (iexec === nexec && Date.now() > startTime) { //only output if this is the latest result
          outName = tempFsPath + slash + tempName + ".out.md";
          writeFile(outName, out);//write to output file
          out = out.replace(/\[object Promise\]\n*/g, ""); //remove this for editor output
          if (!noOutput) {
            if (tempName.endsWith('.html')) { out = ''; }
            await selectCodeblock(false);
            await paste(out);   //paste into editor
            removeSelection(); //deselect
          }
          if (config.showOk) { //report successful completion
            progress("ok", 500);
          }
        }
      }
    );
  }
})(); //end hUri=new class MyUriHandler

function hrefSrcReplace(s: string) { //allow use of command line vars in href and src
  s=s.replace(/(<[^>]*(href|src)[^>]*)%c/g,'$1'+currentPath);
  s=s.replace(/(<[^>]*(href|src)[^>]*)%d/g,'$1'+currentFilePath);
  s=s.replace(/(<[^>]*(href|src)[^>]*)%g/g,'$1'+tempPath);
  s=s.replace(/(<[^>]*(href|src)[^>]*)%h/g,'$1'+hePath);
  return s;
}

function replaceStrVars(s: string) {
  if (cmdId === 'eval' || cmdId === 'js' || cmdId === 'vm') { tempName = 'temp.js'; }
  //if .ext is included with %f or %g change tempName to include it
  if (/%[fg]\.\w/.test(s)) {  //provides for %f.ext notation in %f, %g and %h
    tempName = "temp." + s.replace(/.*?%[fg]\.(\w*).*/, "$1"); // \W? before last .
    s = s.replace(/(%[fg])\.\w*/, "$1"); //remove .ext // (\W?) after * and add $2
  }
  //replace %n, %c-h, %C-H with the appropriate string
  s = s
    .replace(/\\%/g, '%`') //where \% used, escape %
    .replace(/%n/g, tempName) //%n temp file name only
    .replace(/%c/g, currentPath) // %c workspace folder path
    .replace(/%d/g, currentFilePath) // %d current file path
    .replace(/%e/g, currentFile)
    .replace(/%f/g, tempPath + '/' + tempName)
    .replace(/%g/g, tempPath)
    .replace(/%h/g, hePath) // %h hover-exec path for readme etc.
    //the following are for windows, although mostly the previous will work ok
    .replace(/%C/g, currentFsPath) // %C uses FsPath
    .replace(/%D/g, currentFsFilePath) // %D uses FsFilePath
    .replace(/%E/g, currentFsFile) // %E uses Fs file path & name
    .replace(/%F/g, tempFsPath + slash + tempName) // %F uses FsPath
    .replace(/%G/g, tempFsPath) // %G uses FsPath
    .replace(/%H/g, hePath.replace(/\//g, slash)) // %H hover-exec fsPath
    .replace(/%`/g, '%'); //unescape %
  return s;
}

async function inHere(s: string): Promise<string> {
  //#inhere path/name `#tag`
  //        %e etc can be used in the path/name
  //'#inhere' from `#` will be replaced by the result
  if (vscode.window.activeTextEditor) {
    let n = (s.match(/#inhere /g) || []).length;
    if (n === 0) { return s; }
    let re1 = new RegExp("^([\\s\\S]*?)#inhere(.*?)\\s`(#\\w+)`([\\s\\S]*)$", 'm');
    for (let i = 0; i < n; i++) {
      let f = s.replace(re1, '$2').trim(); //file name or ''
      if (f === '') { f = vscode.window.activeTextEditor.document.getText(); }
      else { f = fs.readFileSync(replaceStrVars(f), 'utf8'); }
      let tag = s.replace(re1, '$3');      //tag is #tag was s1
      let re = new RegExp('[\\s\\S]*?' + tag + '($[\\s\\S]*?)' + tag + '[\\s\\S]*', "m");
      let s1 = f.replace(re, '$1').trim(); //s1 is now string to copy to inhere
      s = s.replace(re1, '$1' + s1 + '$4');
    }
  };
  return s;
}

async function clear() {
  //paste into editor
  //needs to be async otherwise vm & eval don't work (get ahead of editor)
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && startCode >= 0) {
    let temp = '';
    if (needSwap) {
      temp = codeBlock.replace(/=>>.*?(\r?\n)/mg, '=>> $1');
    }
    await activeTextEditor.edit((selText) => {
      selectCodeblock(false); //select code block to replace
      if (needSwap) {
        selText.replace(replaceSel, temp + "```\n");
      } else {
        selText.replace(replaceSel, '');
      }
      removeSelection(); //deselect
    });
  }
} //end function clear

async function paste(text: string) {
  //paste into editor
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && startCode >= 0) {
    //remove 'object promise' messages in editor
    //if(cmdId==='eval'){text=text.replace(/\[object Promise\]/g,'');}
    if (needSwap) {
      //if doing in-line output
      let re1 = new RegExp(swap + "\r?\n", "g"); //allows checking for swaps
      if (re1.test(codeBlock)) {
        //if there are any swaps
        //copy in-line results into the code block
        let re = new RegExp("=>>.*?\r?\n", ""); //regex to remove swapped output line
        let n = (codeBlock.match(re1) || []).length;
        for (let i1 = 0; i1 < n; i1++) {
          //while (re1.test(codeBlock)) {
          //while there is a swap string to replace
          let i = text.indexOf("=>>"); //check if there is a swappable line
          if (i >= 0) {
            //if so
            let s = text.slice(i + 3).replace(/\n[\s\S]*/, "");
            if (s === "") { //if the remainder is empty just provide ' '
              s = " ";
            } 
            codeBlock = codeBlock.replace(/=>>$/m, "=>>" + s); //do the swap
            text = text.replace(re, ""); //remove the swapped output to clear for the next
          } else {
            break;
          } //break when done
        }
      }
    }
    text = text.replace(/.[\b]/g, ''); //remove any character followed by a backspace
    text = text.replace(/^\s*[\r\n]/, "").trimEnd(); //remove blank line if any
    //following 3 lines allow for explicitly specifying the output block label
    text = text.replace(/^output([\s:])/, '```output$1'); //if output is first word the first line becomes the label
    text = text.replace(/^[\s\S]*?\n`+output/, '```output'); //a `+output line removes preceding text & becomes the label
    text = text.replace(/^`+/, " ```"); //set one or more starting ` to ``` & temporarily mark with leading space
    text = text.replace(/^```/mg, "'''"); //don't allow displayed lines to start with ``` (would end the code block)
    text = text.replace(/\[\d\d?m/g,""); //remove in-text color codes (mostly pwsh)
    //if there is any output left, it will go into an ```output code block
    await selectCodeblock(false); //select code block to replace
    activeTextEditor.edit((selText) => {
      let lbl = "```output\n"; //normal output block label
      if (text.startsWith(" ```")) {
        // " ```" indicates that the output block label was produced during script execution
        text = text.slice(1);
        lbl = "";
      }
      if (text === "") {
        //no more output
        if (needSwap) {
          selText.replace(replaceSel, codeBlock + "```\n");
        } else {
          selText.replace(replaceSel, '');
        }
      } else if (oneLiner || !needSwap) {
        //only producing an output block
        if (activeTextEditor.document.lineCount === activeTextEditor.selection.end.line) {
          lbl = "\n" + lbl;
        }
        selText.replace(replaceSel, lbl + text + "\n```\n");
      } else {
        //replace code block (has inline results) & output
        selText.replace(
          replaceSel,
          codeBlock + "```\n" + lbl + text + "\n```\n"
        );
      }
    });
  }
} //end function paste

function removeSelection() {
  //deselect current selection
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor) {
    if (cursLine === 0) {
      replaceSel = new vscode.Selection(startCode, 0, startCode, 0);
    } else {
      replaceSel = new vscode.Selection(cursLine, cursChar, cursLine, cursChar);
    }
    activeTextEditor.selection = replaceSel;
  }
}

async function selectCodeblock(force: boolean) {
  //select code block appropriately depending on type
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && startCode >= 0) {
    const doc = activeTextEditor.document;
    let m = startCode; //selection will be from lines m to n
    if (oneLiner) {
      m++; //oneliner selection begins at 1st line after the command line
      if (
        m < doc.lineCount &&
        doc.lineAt(new vscode.Position(m, 0)).text.startsWith("```output")
      ) {
        let n = m; //if there is a following output section
        while (n < doc.lineCount) {
          //find the end of it
          n++;
          if (doc.lineAt(new vscode.Position(n, 0)).text.startsWith("```")) {
            replaceSel = new vscode.Selection(m, 0, n + 1, 0);
            break;
          } else if (n === doc.lineCount) {
            replaceSel = new vscode.Selection(m, 0, n, 0);
          }
        }
      } else {
        replaceSel = new vscode.Selection(m, 0, m, 0);
      }
      activeTextEditor.selection = replaceSel;
    } else {
      let t1 = '';
      //not a one-liner
      let output = doc
        .lineAt(new vscode.Position(m, 0))
        .text === "```output"; //simple ```output line
      //records when an output line reached
      let n = 0;
      if (force || output) {
        n = m + 1; //output block selection starts at command line
      } else {
        m += 1;
        n = m; //otherwise at the line after
      }
      while (n < doc.lineCount) {
        //work through the block and look for end
        t1 = t1 + n + ':' + doc.lineAt(new vscode.Position(n, 0)).text + ';';
        if (doc.lineAt(new vscode.Position(n, 0)).text.startsWith("```")) {
          if (
            n + 1 < doc.lineCount &&
            doc
              .lineAt(new vscode.Position(n + 1, 0))
              .text.startsWith("```output") //allows composite output lines
          ) {
            output = true;
            n++; //skip output line
            if (!needSwap) {
              m = n;
            }
          } else {
            //not an output block start, so it is the end of the block
            n++; //move to the next line  //if no swap & not output then
            if (!needSwap && !output && !force) {
              m = n;
            } //select pos just after block end
            break;
          }
        }
        n++;
      }
      replaceSel = new vscode.Selection(m, 0, n, 0);
      activeTextEditor.selection = replaceSel;
    }
  }
  return;
} //end function selectCodeblock

async function deleteOutput(mode: string) {
  //delete output code block, or leave as text
  const { activeTextEditor } = vscode.window;
  let s = ''; 
  if (mode === 'full_output') {
    s = '' + fs.statSync(outName).mtime; //output file modified date as first line
    s = '> ' + s.replace(/.*?\s/, '').replace(/(.*?\s.*?\s.*?\s.*?\s).*/, '$1') + '\n';
    s += await readFile(outName);
  }
  if (activeTextEditor) {
    await selectCodeblock(true);
    if (mode !== 'delete_output') {
      //remove start and end lines, ie. the lines with backticks
      let pos1 = activeTextEditor.selection.start.line + 1;
      let pos2 = activeTextEditor.selection.end.line - 1;
      let sel = new vscode.Selection(pos1, 0, pos2, 0);
      activeTextEditor.edit((selText) => {
        if (mode === 'text_output') { //replace output block with the text
          selText.replace(
            activeTextEditor.selection,
            activeTextEditor.document.getText(sel));
        }
        else { //replace output block with full output
          selText.replace(activeTextEditor.selection, s);
        }
      });
    } else {
      //remove whole output block
      activeTextEditor.edit((selText) => {
        selText.replace(activeTextEditor.selection, "");
      });
    }
  }
}

function execRepl(cmd: string, args: string[]) {
  repl = cp.spawn(cmd, args, opt);
  if (repl === null) { return; }
  repl.stdout?.on('data', (data) => {
    let s = '' + data;
    console.log(`stdout rm: ${s}`, s.includes('\f'));
    out1 += s;
    executing = executing && !s.includes('\f');
  });
  repl.stderr?.on('data', (data) => {
    console.error(`stderr rm: ${data}`);
  });
  repl.stdin?.on('data', (data) => {
    console.log(`stdin rm: ${data}`);
  });
  repl.on('close', (code) => {
    //eg when repl.kill()
    executing = false;
    chRepl.splice(chRepl.findIndex((el) => el[1] === repl), 1);
    console.log(`repl exit rm, code ${code}`);
  });
}

async function replOutput() {
  while (executing) {
    await delay(100);
  }
  return out1.replace(/\f.*/, '');
}

async function execShell(cmd: string) {
  //execute shell command (to start scripts, run audio etc.)
  return new Promise<string>((resolve, reject) => {
    // let opt={};
    // let s=(config.get("scripts.os") as string).replace(/.*\((.*)\).*/,'$1');
    // if(s!=='auto'){ opt={shell:s};}
    ch = cp.exec(cmd, opt, (err1, out1, stderr1) => {
      if (err1 && stderr1 !== "") {
        needSwap = false; //turn off swaps for errors
        console.log(out1 + err1 + "," + stderr1);   //see this in developer tools
        return resolve(out1 + err1 + "," + stderr1);//return to out buffer
      }
      console.log('\n' + out1 + stderr1);//see this in developer tools
      return resolve(out1 + stderr1);  //return to out buffer
    });
  });
}

async function writeFile(path: string, text: string) {
  //write a file in vm & eval. Usage: await writeFile(path,text)
  //`text` is written to the file at path (full path)
  path = path.replace(/^['"]|['"]$/g, ''); //remove any start or end quotes
  await vscode.workspace.fs.writeFile(vscode.Uri.file(path), Buffer.from(text));
}

function utf8ArrayToStr(array: Uint8Array) {
  var out, i, len, c;
  var char2, char3;
  out = "";
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
    }
  }
  return out;
}

async function readFile1(path: string) {
  //read a file in vm & eval. Usage: await readFile(path)
  path = path.replace(/^['"]|['"]$/g, '');
  try {
    return utf8ArrayToStr(await vscode.workspace.fs.readFile(vscode.Uri.file(path)));
  } catch {
    return '';
  }
}

async function readFile(path: string) {
  return fs.readFileSync(path, 'utf8');
  // path=path.replace(/^['"]|['"]$/g,'');
  // try {
  // fs.readFile('file://' + path, (err, data) => {
  //     if (err) { return ''; }
  //     else { return utf8ArrayToStr(data); }
  //   });
  // } catch {}
  // return '';
}


function vmRequire(src: string) {
  //provide a 'require' for vm blocks
  //note: just use 'require', the context will link to this
  return eval('require("' + src + '")');
}

function write(...args: any) {
  out += util.format(...args) + '\n';
  log(...args);
  return false;
}
let statusBarItem: vscode.StatusBarItem;
async function status(s: string): Promise<void> {
  //put a string in the status bar for vm & eval
  if (s !== undefined && s !== '') {
    statusBarItem.text = `=>>` + s;
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
  await (delay(1));
}

function alert(s: string) {
  //provide an alert function for vm & eval scripts
  vscode.window.showInformationMessage(s);
}

function abort() {
  //allows to abort vm & eval scripts when 'cancel' is clicked
  //eg.  while (true) do {..; ..; ..; if(abort()){break;} };
  return !executing;
}

async function input(s: string) {
  //provide a simple input box for vm & eval scripts
  //eg. d=await('how many items?')/1
  //    where /1 converts the string response to a number
  let what = await vscode.window.showInputBox({ placeHolder: s });
  return what;
}

async function delay(msec: number) {
  //provide a delay in the script, eg. await delay(4000) //4 sec
  await new Promise(res => setTimeout(res, msec));
}

function progress(msg: string, timeout: number) {
  //show a 'progress' pop up for eval scripts, timeout in ms
  if (shown || msg === "") {
    return;
  }
  let p = vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "hover-exec ",
      cancellable: false,
    },
    (progress) => {
      shown = true;
      progress.report({ increment: -1, message: msg });
      let p = new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
          shown = false;
        }, timeout);
      });
      return p;
    }
  );
  return p;
}

export function deactivate() { }

