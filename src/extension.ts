import * as vscode from "vscode";
import * as cp from "child_process";
import { performance } from 'perf_hooks'; 
import _=require("lodash");
import fs=require('fs');
import math=require("mathjs");
import moment=require("moment"); //lodash, mathjs & moment for vm & eval scripts
import vm = require('vm');
import util = require('util');
let codeBlock = ""; //code f or execution
let startCode = -1; //start line of code
let out: string = ""; //output from code execution
let out1: string = ""; //output from code execution
const swap = "=>>"; //3 char string to indicate pos for in-line result
let needSwap = false; //no swaps so leave code as is
let hePath = ""; //path to hover-exec files
let windows = process.platform.startsWith("win"); //os is windows
let tempPath: string = ""; //  path for temp files (provided by vscode)
let tempFsPath: string = ""; //fsPath for temp files (provided by vscode)
let tempName: string = ""; //file name of temp file for current script
let outName: string = ""; //file name of temp file for current script output
let startTime: number = Date.now(); //time of last exec start
let cmdId = ""; //execution id for current script
let cmd = ""; //javascript to start current script execution
let shown = false; //progress message 1 showinf
let currentFile = ""; //path & name of current edit file
let currentFsFile = ""; //path & name as os default string
let currentPath = ""; //folder containing current edit file
let currentFsPath = ""; //folder containing current edit file fsPath
let executing = false; //code is executing
let iexec = -1; //number of currently executing code (set to nexec)
let nexec = 0;  //provides number of currently executing code (auto incremented)
let oneLiner = false; //current script is a 'one-liner'
let quickmathResult='';//result of math.evaluate
let inline = false; //if true disallows inline results
let noOutput = false; //if true ignore output
let ch: cp.ChildProcess; //child process executing current script
let repl:cp.ChildProcess; //current REPL
let chRepl:Array<[string,cp.ChildProcess]>=[]; //array of active REPLs
let useRepl=false; //use REPL to execute code
let restartRepl=false; //force restart REPL
let cursLine: number = 0; //cursor line pos
let cursChar: number = 0; //cursor char pos
let showKey=false; //show key pressed (use when creating gif)
let replaceSel = new vscode.Selection(0, 0, 0, 0); //section in current editor which will be replaced
let config = vscode.workspace.getConfiguration("hover-exec"); //hover-exec settings
let opt={}; //child process execution options
const log=console.log; //saves console.log address to allow reconfig
let vmDefault={global,globalThis,config,vscode, //vm default context
  console,util,process,performance,abort,alert,delay,
  execShell,input,progress,status,readFile,writeFile,
  write,require:vmRequire,_,math,moment};
let vmContext:vm.Context | undefined=undefined; //only shallow clone needed
const refStr =
  "*hover-exec:* predefined strings:\n" +
  " - %f `full_path/name.ext` of temp file\n" +
  " - %p `full_path/` for temporary files\n" +
  " - %c `full_path/` of the current folder\n" +
  " - %e `full_path/` of the editor file\n" +
  " - %x `full_path/` of hover-exec's extension folder\n" +
  " - %n `name.ext` of temporary file\n" +
  " - The default ext is specified by appending .ext, eg. %f.py\n" +
  " - In windows, if needed, /%f etc produces /c:/linux/web/style/path/";
const msgDel =
  "[ [*command variables %f..*] ](vscode://rmzetti.hover-exec?ref) " +
  "[ [*delete block*] ](vscode://rmzetti.hover-exec?delete_output)\n\n";
let msg = "",cmda = "",mpe = "",comment = "",full = "";  //for cmd line parse
let os='win'; //set current os
if (!windows){
    if (process.platform==='darwin') {os='mac';}
    else {
      os='lnx';
      if(process.env.VSCODE_WSL_EXT_LOCATION!==undefined){os='wsl';}
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
        oneLiner = false; //one-liner
        quickmath=false;  //quick evaluate using mathjs, or a regex search
        let includeHere=false;    //an 'inhere' (include) line
        setExecParams(context,doc); //reset basic exec parameters
        if (!line.text.startsWith("```")) { //check for oneLiner, quickmath, includeHere
          oneLiner = line.text.startsWith("`") && line.text.slice(2).includes("`");
          quickmath=/`.+=`/.test(line.text) || /`\/.+\/`/.test(line.text);
          includeHere=/#inhere.*#\w+/.test(line.text);
          if (!oneLiner && !quickmath && !includeHere) {
              return null;
          } //ignore if not a code block, oneLiner or quickmath
        }
        if(includeHere){ //show tagged content
          return new vscode.Hover(new vscode.MarkdownString(
            "["+(await inHere(line.text)).replace(/\n/g,' ') +"](vscode://rmzetti.hover-exec?copyToClipboard)"
          ));
        }
        else if(quickmath){ //evaluate math expressions like `44-2=` using mathjs
                       //also evaluate re eg. `/($speed << EOD.*EOD)/`
          let s=line.text;
          if(s[pos.character]==='`'){return null;} //hover over the expression not backticks
          let s1=s.slice(0,pos.character);//there may be more than one expression in a line
          let s2=s.slice(pos.character);  //so isolate parts before & after hover pos
          if(!s1.includes('`') || !s2.includes('`')){return null;}
          s2=s2.slice(0,s2.indexOf('`'));
          quickmath=s2.endsWith('='); //otherwise regex
          let f='';
          if(!quickmath){ // then if an inhere line get the file name if present
            f=s1.replace(/.*#inhere (.*?)`.*/,'$1').trim();
            if(f===''){
              f=doc.getText();
            }
            else {
              //f=fs.readFileSync(replaceStrVars(f),'utf-8');
              f=await readFile(replaceStrVars(f));
            }
            status('ok');
          }
          s1=s1.slice(s1.lastIndexOf('`')+1);
          if(!quickmath){s1=s1.slice(1);}
          s2=s2.slice(0,s2.length-1);
          s1=s1+s2;
          if(quickmath){
            s2='hover-exec via mathjs';
            quickmathResult=''+math.evaluate(s1);
          } else { //evaluate 'simplified' regex on file contents
            //which specifies what is being looked for, & interprets . as [\s\S] 
            s2='hover-exec via regex:\n';
            s1=s1.replace(/\./g,'[\\s\\S]'); //make . mean all chars
            s1=s1.replace(/[*]([^?])/g,'*?$1');   //make * not greedy
            let re = new RegExp('[\\s\\S]*?('+s1+')[\\s\\S]*',"m");
            quickmathResult=f.replace(re,'$1');
          } //save result for copy to clipboard
          if(quickmathResult===''){return null;}
          s1= "[ " + quickmathResult + " ](vscode://rmzetti.hover-exec?copyToClipboard)";
          const contents = new vscode.MarkdownString(s2+":\n\n"+s1);
          if(quickmath){status(quickmathResult);}
          return new vscode.Hover(contents);
        }
        if (line.text === "```") {
          //allow hover-exec from end of codeblock
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
          codeBlock = getCodeBlockAt(doc, pos); //save codeblock
          let url = "vscode://rmzetti.hover-exec?" + cmdId; //url for hover
          if (comment!=='') {
            comment=' *'+comment+'*';
          }
          let msg=comment+"\n\n";
          comment
          if (oneLiner) {
            msg += "**[" + replaceStrVars(full) + " =>>](" + url + ")**";
          } else {
            let msgOpen = //to open last script & result
              "[ [*clear output*]  ](vscode://rmzetti.hover-exec?clear_all) " +
              "[ [*open last script*] ]("+vscode.Uri.file(tempPath+tempName)+") "+
              "[ [*open last result*] ]("+vscode.Uri.file(tempPath+tempName+".out.txt")+")\n\n";
            msg +=
              "[ [*config*] ](" + url + "_config) " + //add hover info
              msgDel + msgOpen + "**[ exec: " + cmdId+" =>> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ](" + url + ")**";
          }
          const contents = new vscode.MarkdownString("hover-exec: " + msg);
          contents.isTrusted = true; //set hover links as trusted
          return new vscode.Hover(contents); //and return it
        } else if (cmdId === "output") {
          //create & return message & urls for output hover
          cmdId = "delete";
          let msgOut = "*hover-exec:*\n\n[output block to text](vscode://rmzetti.hover-exec?text_output)\n\n";
          if(iexec===nexec) msgOut+="[all output to text](vscode://rmzetti.hover-exec?full_output)\n\n";
          msgOut+="[delete output block](vscode://rmzetti.hover-exec?delete_output)"; //hover for output delete
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
          codeBlock = getCodeBlockAt(doc, pos); //save codeblock
          let url = "vscode://rmzetti.hover-exec?"; //create hover message
          let msg =
            "&nbsp; [ [*config*] ](" + url + cmdId + "_config) " + "[ [*last script*] ](" +
            vscode.Uri.file(tempPath+tempName) + ")" + "[ [*last result* ] ](" + 
            vscode.Uri.file(tempPath+tempName) +
            ".out.txt)\n\n" + "**[" + pad(cmd + comment) + " =>>](" + url + cmdId + ")**";
          const contents = new vscode.MarkdownString(
            "hover-exec:" + cmdId + msg
          );
          contents.isTrusted = true; //set hover links as trusted
          return new vscode.Hover(contents); //and return it
        }
      }
    })()
  );
  
  context.subscriptions.push( //register readme command
    vscode.commands.registerCommand("hover-exec.readme", () => {
      vscode.commands.executeCommand("vscode.open", vscode.Uri.file(context.extensionPath + "/README.md"));
    })
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
        cursLine = pos.line;
        cursChar = pos.character; //when command was executed
        let n = getStartOfBlock(doc, pos); //get start of codeblock
        if (n < 0) {
          return null;
        } //if not in codeblock ignore
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
        let script = config.get("scripts." + cmdId); //json object if cmd1 is a 'built-in' script
        if (script) {
          //predefined script engine strings
          cmd = replaceStrVars(script as string); //expand %f etc & get tempName
          codeBlock = getCodeBlockAt(doc, pos); //save codeblock
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
          codeBlock = getCodeBlockAt(doc, pos); //save codeblock
          url = "vscode://rmzetti.hover-exec?" + cmdId; //using url enables re-use of hover-execute code
        }
        hUri.handleUri(vscode.Uri.parse(url)); //execute codeblock via url
      }
    })
  );
  
  context.subscriptions.push(vscode.window.registerUriHandler(hUri));

  function setExecParams(
    context: vscode.ExtensionContext,
    doc: vscode.TextDocument
  ) {
    currentFile = doc.uri.path; //current editor file full path /c:...
    currentFsFile = doc.uri.fsPath; //os specific currentFile c:\...  (%e)
    if (vscode.workspace.workspaceFolders) {
      currentPath = vscode.workspace.workspaceFolders[0].uri.path + "/";
      currentFsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    } else {
      currentPath = currentFile.slice(0,currentFile.lastIndexOf('/'));
      if(windows){
        currentFsPath = currentFsFile.slice(0,currentFsFile.lastIndexOf('\\'));
      } else {
        currentFsPath = currentFsFile.slice(0,currentFsFile.lastIndexOf('/'));
      }
    }
    if (windows) {
      currentFsPath += "\\";
    } else {
      currentFsPath += "/";
    }
    vscode.workspace.fs.createDirectory(context.globalStorageUri); //create temp folder if necessary
    cmd = "";
    cmda = "";
    cmdId = "";
    comment = "";
    full = "";
    mpe = ""; //reset start line parameters
    tempName = "temp.txt"; //temp file name, can be used as (%n)
    tempPath = context.globalStorageUri.path + "/"; //temp folder path
    tempFsPath = context.globalStorageUri.fsPath; //temp folder path, %p
    if (windows) {
      tempFsPath += "\\";
    } else {
      tempFsPath += "/";
    }
    needSwap = false; //set true if in-line swaps required
    codeBlock = "";
  } //end function setExecParams

  function getSpecialPath(s: string) {
    //special path/name in command line or first line comment
    let v = s.slice(s.indexOf(">") + 1);
    v = replaceStrVars(v);
    if (v.includes("/")) {
      tempName = v.slice(v.lastIndexOf("/") + 1);
      tempPath = v.slice(0, v.lastIndexOf("/") + 1);
      tempFsPath = tempPath.replace(/\//g, "\\");
      if (tempPath.startsWith("/")) {
        tempFsPath = tempFsPath.slice(1);
      }
    } else {
      tempName = v.slice(v.lastIndexOf("\\") + 1);
      tempFsPath = v.slice(0, v.lastIndexOf("\\") + 1);
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
    noOutput = s.includes("`>");    
    inline = !s.toLowerCase().includes("noinline"); //allows normal use of =>>
    if (!inline) {
      s = s.replace(/noInline|noinline/, "");
    }
    let ipos = posComment(s); //find comment in cmd line <!--,//,#
    if (ipos > 0) {
      comment = s.slice(ipos); //save comment as msg for hover
      s = s.slice(0, ipos); //and remove
    }
    if (oneLiner) {
      s = s.replace(/^`(.*?)`.*/, "$1");
    } //get backtick content
    else {
      s = s.slice(3);
    } //or remove initial triple backtick
    if (/{.*}/.test(s)) {
      //check for markdown preview enhanced bracket
      mpe = s.replace(/.*({.*}).*/, "$1"); //save it
      s = s.replace(/{.*}/, ""); //and remove
    }
    s = s.replace(/\s+/g, " ").trim(); //collapse multiple spaces
    full = s;        //save full command line minus comments & {..}
    if (/^\w/.test(s)) {
      cmda = s.replace(/^(\w*).*/, "$1");
      useRepl=/^\w+\s?:\s?\w*:/.test(s); //allow spaces either side of :
      if(useRepl){
        restartRepl=/^\w+\s?:\s?\w*:restart/.test(s);
      }
      if (/^\w+\s?:\s?\w/.test(s)) {
        cmdId = s.replace(/^\w*\s?:\s?(\w*).*/, "$1");
                      //eg. for 'js:asdf' cmdId is 'asdf'
        if(cmdId==='vmdf'){vmContext=undefined;cmdId = 'vm';}
                      //for 'js:def' set default context & cmdId='vm'
        else if (cmdId==='vmin'){vmContext={write};cmdId = 'vm';}
                      //for 'js:min' set min context & cmdId='vm'
      } else {
        cmdId = cmda; //eg. for 'js asdf' cmdId is 'js'
      }
    }
    if (
      full.indexOf(">") > 0 &&
      (full.indexOf("<") === -1 || full.indexOf("<") > full.indexOf(">"))
    ) {
      full += " ";
      getSpecialPath(full.replace(/(\s>.*?)[\s,;].*/, "$1")); //if special path included, use it
      full = full.replace(/>.*?[\s,;]+/, "").trim(); //& remove from full
    }
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

  function getStartOfBlock(doc: vscode.TextDocument, pos: vscode.Position) { //return start of codeblock containing ```, or -1
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
    while ( n >= 0 && !doc.lineAt(new vscode.Position(n, 0)).text
            .startsWith("```")) { n -= 1;}
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

  let checkit=false;
  async function checkConfig(){
    async function checkOS(section: string) {
      let scripts=config.get(section);
      if(config.get(section+".os")===""){
        let k=Object.keys(scripts as object);
        let merge={};
        merge=Object.assign(merge,{"os":os+" (auto)"});
        for (let a in k) {
          let s=config.get(section+'.'+k[a]+'_'+os);
          if (s!==undefined && s!=="") {
            merge=Object.assign(merge,{[k[a]]:s});
          }
        }
        await config.update(section,merge,1);
        config = vscode.workspace.getConfiguration("hover-exec");
      }
    }
    config = vscode.workspace.getConfiguration("hover-exec");
    await checkOS('scripts'); //changes default scripts to match os if provided
    await checkOS('repls');   //changes default repls to match os if provided
    await checkJsonVisible(); //ensures settings visible in settings.json
    vmDefault={global,globalThis,config,vscode,console,util,process,performance,abort,alert,delay,
      execShell,input,progress,status,readFile,writeFile,write,require:vmRequire,_,math,moment};
    vmContext={...vmDefault};
    opt={};
    let s=(config.get("scripts.os") as string).replace(/.*\((.*)\).*/,'$1');
    if(s==='auto') {
      if(process.platform==='darwin'||process.platform==='linux') {
        opt={shell:'/bin/bash'};
      } else {
        opt={shell:true};
      }
    } else { 
      opt={shell:s};
    }
    checkit=true;
  }

  context.subscriptions.push( //onDidChangeConfigurations
    vscode.workspace.onDidChangeConfiguration( async (e) => {
      if (checkit) {
        checkit=false;
        await checkConfig(); //ensures scripts, repls & swappers available in settings.json
      }
    })
  );

  checkConfig(); //set default configs (only) to their os values (if provided)

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 500);
  context.subscriptions.push(statusBarItem);
  status(os+' v'+vscode.extensions.getExtension('rmzetti.hover-exec')?.packageJSON.version);
  hePath=context.extensionPath;
  if(windows){
    hePath=hePath.replace(/\\/g,'/');
  }
  hePath=hePath+'/';
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
    if (uri.query === "delete_output" || uri.query === "text_output" || 
        uri.query === "full_output") {
      await deleteOutput(uri.query); //full to text
      return;
    }
    if (uri.query === "ref") {
      const value = await vscode.window.showQuickPick(
        ["%f.ext temp file 'path/name.ext': "+replaceStrVars('%f.ext'), 
         "%p     temp folder 'path/': "+replaceStrVars('%p'), 
         "%c     this folder 'path/': "+replaceStrVars('%c'), 
         "%e     this file 'path/': "+replaceStrVars('%e'), 
         "%n.ext temp file 'name.ext': "+replaceStrVars('%n.ext')], 
         {placeHolder: "Predefined paths reference (can add .ext, eg. python temp file is %f.py)"});
      if(value){
         await vscode.env.clipboard.writeText(value);
      }
      return;
    }
    if (uri.query === "clear_all") {
         needSwap=true;await clear();
         removeSelection();
      return;
    }
    if (uri.query === "copyToClipboard") {
      status('copied '+quickmathResult);
      await vscode.env.clipboard.writeText(quickmathResult);
      return;
    }
    if (uri.query.endsWith("_config")) {
      //show current script config
      if(useRepl){
        vscode.commands.executeCommand('workbench.action.openSettingsJson');
        return;
      }
      let d = await vscode.window.showInputBox({
        placeHolder: "config",
        prompt: 'id= '+cmdId+', just enter to open settings.json ',
        value: config.get('scripts.'+cmdId)
      });
      if (d!==undefined){
        let scripts=config.get('scripts');
        let id=config.get('scripts.'+cmdId);
        if(d===id || (d==='' && id===undefined)){
          vscode.commands.executeCommand('workbench.action.openSettingsJson');
        } else {
          if(d==='undefine'||d==='undefined'||d===''){d=undefined;}
          let merge={};
          merge=Object.assign(merge,scripts,{[cmdId]:d});
          await config.update('scripts',merge,1);
          config = vscode.workspace.getConfiguration("hover-exec");
        }
      }
      return;      
    }
    nexec += 1; //script exec number for check to ensure output is from latest script
    startTime=Date.now();//record script start time
    needSwap = inline && codeBlock.includes(swap);
    let code = codeBlock; //code will contain the code for execution
    if (needSwap) {
      let re = new RegExp("(.+" + swap + ").*", "mg"); //regex to find previous results
      codeBlock = codeBlock.replace(re, "$1");         //& remove from codeBlock
      code = codeBlock.replace(/^\s*(--|#|%|\/\/).*=>>$/mg,''); //remove commented lines with swap
      //disable swap in fully commented lines by appending a space
      codeBlock = codeBlock.replace(/^(\s*(--|#|%|\/\/).*=>>)$/mg,'$1 ');
      re = new RegExp(";?\\s*(--|#|%|\/\/)*\\s*" + swap+'$', "mg"); //find any comment chars directly preceding a swap
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
        out=""; //reset output buffer
        prog.report({ message: "executing "+cmdId }); //progress report; 
        if (config.clearPrevious){
          await clear();removeSelection();
        } else {
          await delay(10); //ensure progress report is visible
        }
        code=hrefSrcReplace(code);
        code=await inHere(code); //replace #inhere       
        if(code!==''){writeFile(tempPath + tempName, code);} //saves code in temp file for execution
        process.chdir(currentFsPath);
        if (cmd !== '') {
          if (cmd === 'eval' || cmd === 'vm') { //use vscode internal js
            //reassign console.log to write to view logs in output
            //wrap with an async function to allow use of await (eg for input, delays,etc) 
            //code=`async function __main(){console.log=write;`+code+`};__main();`;
            code=`async function __main(){`+code.replace(/console\.log/g,'write')+`};__main();`;
            try {
              if(cmd === 'eval'){
                await eval(code);//execute, out produced by 'write'
              } else {
                if(vmContext===undefined){
                  vmContext={...vmDefault}; //context undefined, use default (only shallow copy needed)
                }
                let vcContext=vm.createContext(vmContext);//prepare context 
                let script=new vm.Script(code);//syntax check
                await script.runInContext(vcContext);//execute, out produced by 'write'
              }
            } catch (e) {      //if syntax error
              needSwap=false;  //then don't do swap
              out='error '+e;  //report error in output block
            }
          } else {
            if(useRepl){//repl parameters from config
              let rp = config.get("repls."+cmdId) as Array<string|Array<string>>; 
              let chitem=chRepl.find((el) => el[0]===cmdId);
              if(chitem===undefined || restartRepl){
                if(chitem!==undefined){ //restart the repl
                  chRepl.splice(chRepl.findIndex((el) => el[0]===cmdId),1);
                }
                execRepl(rp[0] as string,rp[1] as Array<string>);
                chRepl.push([cmdId,repl]);
                await delay(1000);
              } else {
                repl=chitem[1];
              }
              out1=''; //used by stdio for replOutput 
              code="\n"+code+"\n"+rp[2]+"\n"; //script to output formfeed to indicate completion
              if(rp[3]!==[]){ //preprocessing eg. handle python indents
                let i=0;
                while(i<rp[3].length-1){
                  let re=new RegExp(rp[3][i],"mg");
                  code=code.replace(re,rp[3][i+1]);
                  i+=2;
                }
              }
              repl.stdin?.write(code);
              out=await replOutput();
              if(rp[4]!==""){ //postprocessing (eg. lua,node)
                //rp[4] has one or more regexp
                let i=0;
                while(i<rp[4].length-1){
                  let re=new RegExp(rp[4][i],"mg");
                  out=out.replace(re,rp[4][i+1]);
                  i+=2;
                }
              } 
            } else {
              out=await execShell(cmd); //execute all other commands
              if (cmdId === "buddvs") {   //local script tester
                out=out.replace(/�/g, "î");
              }
            }
          }
        } else {
          out=uri.toString(); //no ex, return uri
        }
        executing = false;     //execution finished
        if (iexec === nexec && Date.now()>startTime) { //only output if this is the latest result
          outName=tempFsPath + tempName + ".out.txt";
          writeFile(outName, out);//write to output file
          out=out.replace(/\[object Promise\]\n*/g, ""); //remove this for editor output
          if (!noOutput) {
            if(tempName.endsWith('.html')){out='';}
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

function hrefSrcReplace(s:string) {
  s=s.replace(/(href\s*=\s*['"`]\s*)(https?:)/g,'$1:$2'); //avoid http in href
  s=s.replace(/(href\s*=\s*['"`]\s*)(\w)/g,'$1'+currentFsPath+'$2');//add path to direct href
  s=s.replace(/(href\s*=\s*['"`]\s*):(https?:)/g,'$1$2'); //replace http
  s=s.replace(/(src\s*=\s*['"`]\s*)(https?:)/g,'$1:$2');  //avoid http in src
  s=s.replace(/(src\s*=\s*['"`]\s*)(\w)/g,'$1'+currentFsPath+'$2'); //add path to direct src
  s=s.replace(/(src\s*=\s*['"`]\s*):(https?:)/g,'$1$2');  //replace http
  s=s.replace(/(href\s*=\s*['"`]\s*)\.\./g,'$1'+currentFsPath+'..'); //replace ".." in href
  s=s.replace(/(href\s*=\s*['"`]\s*)\./g,'$1'+currentFsPath); //replace "." in href
  s=s.replace(/(src\s*=\s*['"`]\s*)\.\./g,'$1'+currentFsPath+'..'); //replace ".." in src
  s=s.replace(/(src\s*=\s*['"`]\s*)\./g,'$1'+currentFsPath);  //replace "." in src
  return s;
}

function replaceStrVars(s: string) {
  if(cmdId==='eval' || cmdId==='js' || cmdId==='vm'){tempName='temp.js';}
  //replace %f etc with the appropriate string
  if (/%[fp]\.\w/.test(s)) {  //provides for %f.ext notation in %f, %p and %x
    tempName= "temp." + s.replace(/.*?%[fp]\.(\w*).*/, "$1"); // \W? before last .
    s= s.replace(/(%[fp])\.\w*/, "$1"); //remove .ext // (\W?) after * and add $2
  }
  s= s
    .replace(/%n/g, tempName) //%n temp file name only
    .replace(/%x/g, hePath) //%h hover-exec path for readme etc.

    .replace(/%f/g, tempPath + tempName) // '/%f' uses /
    .replace(/%p/g, tempPath) // '/%p' uses /
    .replace(/%c/g, currentPath) // '/%c' uses /
    .replace(/%e/g, currentFile) // '/%e' uses /

    // .replace(/\/%f/g, tempPath + tempName) // '/%f' uses /
    // .replace(/\/%p/g, tempPath) // '/%p' uses /
    // .replace(/\/%c/g, currentPath) // '/%c' uses /
    // .replace(/\/%e/g, currentFile) // '/%e' uses /
    
    // .replace(/%f/g, tempFsPath + tempName) //%f temp file path/name
    // .replace(/%p/g, tempFsPath) //%p temp folder path
    // .replace(/%c/g, currentFsPath) //%c current file path
    // .replace(/%e/g, currentFsFile) //%e current file path/name
  return s;
}

async function inHere(s: string): Promise<string> {
  //#inhere path/name `#tag`
  //        %e etc can be used in the path/name
  //'#inhere' from `#` will be replaced by the result
  if(vscode.window.activeTextEditor){ 
    let n=(s.match(/#inhere /g) || []).length;
    if(n===0){return s;}
    let re1=new RegExp("^([\\s\\S]*?)#inhere(.*?)\\s`(#\\w+)`([\\s\\S]*)$",'m');
    for (let i=0;i<n;i++){
      let f=s.replace(re1,'$2').trim(); //file name or ''
      if (f==='') {f=vscode.window.activeTextEditor.document.getText();}
      else { f=fs.readFileSync(replaceStrVars(f),'utf8');}
      let tag=s.replace(re1,'$3');      //tag is #tag was s1
      let re = new RegExp('[\\s\\S]*?'+tag+'($[\\s\\S]*?)'+tag+'[\\s\\S]*',"m");
      let s1=f.replace(re,'$1').trim(); //s1 is now string to copy to inhere
      s = s.replace(re1,'$1'+s1+'$4');
    }
  };
  return s;
}

async function clear(){
  //paste into editor
  //needs to be async otherwise vm & eval don't work (get ahead of editor)
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && startCode >= 0) {
    let temp='';
    if (needSwap) {
      temp = codeBlock.replace(/=>>.*?(\r?\n)/mg,'=>> $1');
    }
    await activeTextEditor.edit((selText) => {
      selectCodeblock(false); //select codeblock to replace
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
        //copy in-line results into the codeblock
        let re = new RegExp("=>>.*?\r?\n", ""); //regex to remove swapped output line
        let n=(codeBlock.match(re1) || []).length;
        for (let i1=0;i1<n;i1++){
          //while (re1.test(codeBlock)) {
          //while there is a swap string to replace
          let i = text.indexOf("=>>"); //check if there is a swappable line
          if (i >= 0) {
            //if so
            let s = text.slice(i+3).replace(/\n[\s\S]*/, "");
            if (s === "") {
              s = ";";
            } //if the remainder is empty just provide ';'
            codeBlock = codeBlock.replace(/=>>$/m, "=>>" + s); //do the swap
            text = text.replace(re, ""); //remove the swapped output to clear for the next
          } else {
            break;
          } //break when done
        }
      }
    }
    text = text.replace(/.[\b]/g,''); //remove any character followed by a backspace
    text = text.replace(/^\s*[\r\n]/, "").trimEnd(); //remove blank line if any
    //following 3 lines allow for explicitly specifying the output block label
    text = text.replace(/^output([\s:])/,'```output$1'); //if output is first word the first line becomes the label
    text = text.replace(/^[\s\S]*?\n`+output/,'```output'); //a `+output line removes preceding text & becomes the label
    text = text.replace(/^`+/, " ```"); //set all starting ` to ``` & temporarily mark with leading space
    text = text.replace(/^```/mg, "'''"); //don't allow displayed lines to start with ``` (would end the code block)
    text = text.replace(/^\[.+?m(.*)\[0m$/gm, "$1"); //remove color codes (mostly pwsh)
    //if there is any output left, it will go into an ```output codeblock
    await selectCodeblock(false); //select codeblock to replace
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
        selText.replace(replaceSel, lbl + text + "\n```\n");
      } else {
        //replace codeblock (has inline results) & output
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
  //select codeblock appropriately depending on type
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
      let t1='';
      //not a one-liner
      let output = doc
        .lineAt(new vscode.Position(m, 0))
        .text==="```output"; //simple ```output line
      //records when an output line reached
      let n=0;
      if (force || output) {
        n = m + 1; //output block selection starts at command line
      } else {
        m += 1;
        n = m; //otherwise at the line after
      }
      while (n < doc.lineCount) {
        //work through the block and look for end
        t1=t1+n+':'+doc.lineAt(new vscode.Position(n, 0)).text+';';
        if (doc.lineAt(new vscode.Position(n, 0)).text.startsWith("```")) {
          if (
            n+1 < doc.lineCount &&
            doc
              .lineAt(new vscode.Position(n+1, 0))
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

async function deleteOutput(mode:string) {
  //delete output code block, or leave as text
  const { activeTextEditor } = vscode.window;
  let s='';
  if(mode==='full_output') {
    s=''+ fs.statSync(outName).mtime; //output file modified date as first line
    s='> '+s.replace(/.*?\s/,'').replace(/(.*?\s.*?\s.*?\s.*?\s).*/,'$1')+'\n';
    s+=await readFile(outName);
  }
  if (activeTextEditor) {
    await selectCodeblock(true);
    if (mode!=='delete_output') {
      //remove start and end lines, ie. the lines with backticks
      let pos1 = activeTextEditor.selection.start.line + 1;
      let pos2 = activeTextEditor.selection.end.line - 1;
      let sel = new vscode.Selection(pos1, 0, pos2, 0);
      activeTextEditor.edit((selText) => {
        if(mode==='text_output'){ //replace output block with the text
          selText.replace(
            activeTextEditor.selection,
            activeTextEditor.document.getText(sel));
        }
        else { //replace output block with full output
          selText.replace(activeTextEditor.selection,s);
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

function execRepl(cmd: string,args:string[]){
  repl=cp.spawn(cmd, args, opt);
  if(repl===null){return;}
  repl.stdout?.on('data', (data) => {
    let s=''+data;
    console.log(`stdout rm: ${s}`,s.includes('\f'));
    out1+=s;
    executing=executing && !s.includes('\f');
  });
  repl.stderr?.on('data', (data) => {
    console.error(`stderr rm: ${data}`);
  });
  repl.stdin?.on('data',(data)=>{
    console.log(`stdin rm: ${data}`);
  });
  repl.on('close', (code) => {
    //eg when repl.kill()
    executing=false;
    chRepl.splice(chRepl.findIndex((el) => el[1]===repl),1);
    console.log(`repl exit rm, code ${code}`);
  });
}

async function replOutput(){
  while (executing){
    await delay(100);
  }
  return out1.replace(/\f.*/,'');
} 

async function execShell(cmd: string){
  //execute shell command (to start scripts, run audio etc.)
  return new Promise<string>((resolve, reject) => {
    // let opt={};
    // let s=(config.get("scripts.os") as string).replace(/.*\((.*)\).*/,'$1');
    // if(s!=='auto'){ opt={shell:s};}
    ch = cp.exec(cmd, opt, (err1, out1, stderr1) => {
      if (err1 && stderr1 !== "") {
        needSwap=false; //turn off swaps for errors
        console.log(out1+err1+","+stderr1);   //see this in developer tools
        return resolve(out1+err1+","+stderr1);//return to out buffer
      }
      console.log('\n'+out1+stderr1);//see this in developer tools
      return resolve(out1+stderr1);  //return to out buffer
    });
  });
}

async function writeFile(path: string, text: string) {
  //write a file in vm & eval. Usage: await writeFile(path,text)
  //`text` is written to the file at path (full path)
  path=path.replace(/^['"]|['"]$/g,''); //remove any start or end quotes
  await vscode.workspace.fs.writeFile(vscode.Uri.file(path), Buffer.from(text));
}

function utf8ArrayToStr(array:Uint8Array) {
  var out, i, len, c;
  var char2, char3;
  out="";
  len = array.length;
  i = 0;
  while(i < len) {
    c = array[i++];
    switch(c >> 4) { 
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

async function readFile1(path:string){
  //read a file in vm & eval. Usage: await readFile(path)
  path=path.replace(/^['"]|['"]$/g,'');
  try {
    return utf8ArrayToStr(await vscode.workspace.fs.readFile(vscode.Uri.file(path)));
  } catch {
    return '';
  }
}

async function readFile(path: string) {
  return  fs.readFileSync(path,'utf8');
  // path=path.replace(/^['"]|['"]$/g,'');
  // try {
  // fs.readFile('file://' + path, (err, data) => {
  //     if (err) { return ''; }
  //     else { return utf8ArrayToStr(data); }
  //   });
  // } catch {}
  // return '';
}


function vmRequire(src:string){
  //provide a 'require' for vm blocks
  //note: just use 'require', the context will link to this
  return eval('require("'+src+'")');
}

function write(...args:any) {
  out+=util.format(...args)+'\n';
  log(...args);
  return false;
}
let statusBarItem: vscode.StatusBarItem;
async function status(s:string): Promise<void> {
  //put a string in the status bar for vm & eval
  if(s!==undefined && s!==''){
    statusBarItem.text = `=>>`+s;
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
  await(delay(1));
}

function alert(s: string) {
  //provide an alert function for vm & eval scripts
  vscode.window.showInformationMessage(s);
}

function abort(){
  //allows to abort vm & eval scripts when 'cancel' is clicked
  //eg.  while (true) do {..; ..; ..; if(abort()){break;} };
  return !executing;
}

async function input(s:string) {
  //provide a simple input box for vm & eval scripts
  //eg. d=await('how many items?')/1
  //    where /1 converts the string response to a number
  let what = await vscode.window.showInputBox({ placeHolder: s });
  return what;
}

async function delay(msec: number){
  //provide a delay in the script, eg. await delay(4000) //4 sec
  await new Promise(res => setTimeout(res,msec));
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

export function deactivate() {}

