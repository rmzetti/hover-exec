import * as vscode from "vscode";
import * as cp from "child_process";
import internal = require("stream");
import _=require("lodash");
import math=require("mathjs");
import moment=require("moment"); //lodash, mathjs & moment for vm & eval scripts
import vm = require('vm');
import { type } from "os";
let codeBlock = ""; //code f or execution
let startCode = 0; //start line of code
let out: string = ""; //output from code execution
const swap = "=>>"; //3 char string to indicate pos for in-line result
let needSwap = false; //no swaps so leave code as is
let windows = false; //os is windows
let tempPath: string = ""; //  path for temp files (provided by vscode)
let tempFsPath: string = ""; //fsPath for temp files (provided by vscode)
let tempName: string = ""; //file name of temp file for current script
let cmdId = ""; //execution id for current script
let cmd = ""; //javascript to start current script execution
let shown = false; //progress message 1 showinf
let currentFile = ""; //path & name of current edit file
let currentFsFile = ""; //path & name as os default string
let currentPath = ""; //folder containing current edit file
let currentFsPath = ""; //folder containing current edit file fsPath
let executing = false; //code is executing
let nexec = 0; //number of currently executing code (auto incremented)
let oneLiner = false; //current script is a 'one-liner'
let quickmath = false; //current script is 'quickmath' (executed by hover)
let quickmathResult='';//result of math.evaluate
let inline = false; //if true disallows inline results
let noOutput = false; //if true ignore output
let ch: cp.ChildProcess; //child process executing current script
let cursLine: number = 0; //cursor line pos
let cursChar: number = 0; //cursor char pos
let showKey=false; //show key pressed (use when creating gif)
let replaceSel = new vscode.Selection(0, 0, 0, 0); //section in current editor which will be replaced
let config = vscode.workspace.getConfiguration("hover-exec"); //hover-exec settings
const vmDefault={global,globalThis,config,process,vscode,abort,alert,delay,execShell,
  input,progress,status,readFile,writeFile,write,require:vmRequire,console,log,_,math,moment};
let vmContext:vm.Context | undefined=undefined; //only shallow clone needed
const hookSave=process.stdout.write; //to replace stdout after hook
const refStr =
  "*hover-exec:* predefined strings:\n" +
  " - %f `full_path/name.ext` of temp file\n" +
  " - %p `full_path/` for temporary files\n" +
  " - %c `full_path/` of the current folder\n" +
  " - %e `full_path/` of the editor file\n" +
  " - %n `name.ext` of temporary file\n" +
  " - The default ext is specified by appending .ext, eg. %f.py\n" +
  " - In windows, if needed, /%f etc produces /c:/linux/web/style/path/";
const msgDel =
  "[ [*ref*] ](vscode://rmzetti.hover-exec?ref) " +
  "[[*delete block*]](vscode://rmzetti.hover-exec?delete)\n\n";
const msgOut =
  "*hover-exec:*\n\n[output to text](vscode://rmzetti.hover-exec?remove)\n\n" +
  "[delete output](vscode://rmzetti.hover-exec?delete)"; //output delete hover
let msg = "",cmda = "",mpe = "",comment = "",full = "";  //cmd line parse result

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerHoverProvider(
    "markdown",
    new (class implements vscode.HoverProvider {
      async provideHover(
        doc: vscode.TextDocument,
        pos: vscode.Position,
        token: vscode.CancellationToken
      ): Promise<vscode.Hover | null> {
        status(''); //clear status message
        let line = doc.lineAt(pos); //user is currently hovering over this line
        oneLiner = false; //one-liner
        quickmath=false;  //quick evaluate using mathjs
        if (!line.text.startsWith("```")) {
          oneLiner = line.text.startsWith("`") && line.text.slice(2).includes("`");
          quickmath=/`.+=`/.test(line.text);
          if (!(oneLiner || quickmath)) {
              return null;
          } //ignore if not a code block, oneLiner or quicki
        }
        if (executing) {
          //if already executing code block, show cancel option
          return new vscode.Hover(
            new vscode.MarkdownString(
              "*hover-exec:* executing...\n\n[cancel execution](vscode://rmzetti.hover-exec?abort)"
            )
          );
        }
        if(quickmath){ //evaluate math expressions like `44-2=` using mathjs
          let s=line.text;
          if(s[pos.character]==='`'){return null;} //have to over over the expression
          if(!s.slice(pos.character).includes('=`')){return null;}
          let s2=s.slice(pos.character); //there may be more than one expression in a line
          s2=s2.slice(0,s2.indexOf('=`'));
          let s1=s.slice(0,pos.character);
          if(!s1.includes('`')){return null;}
          s1=s1.slice(s1.lastIndexOf('`')+1)+s2;
          quickmathResult=''+math.evaluate(s1); //save result for copy to clipboard
          s1= "[ " + quickmathResult + " ](vscode://rmzetti.hover-exec?copyToClipboard)";;
          const contents = new vscode.MarkdownString("via mathjs:\n\n"+s1);
          status(quickmathResult);
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
        setExecParams(context, doc, pos, line); //reset basic exec parameters inc getSpecialPath
        parseLine(line.text);
        cursLine = 0; //do not reset cursor pos for hover click
        let script = config.get("scripts." + cmdId) as string; //undefined if not a 'built-in' script
        if (script) {
          //if predefined script engine
          cmd = replaceStrVars(script); //expand %f etc & get tempName
          let msgOpen = //to open last script & result
            "open: [ [*last script*] ](" +
            tempPath + tempName + ") " + "[ [*last result* ] ](" + tempPath + tempName + ".out.txt)\n\n";
          codeBlock = getCodeBlockAt(doc, pos); //save codeblock
          let url = "vscode://rmzetti.hover-exec?" + cmdId; //url for hover
          let msg =
            cmdId + "[ [*config*] ](" + url + "_config) " + //add hover info
            msgDel + msgOpen + "[" + cmdId + " " + comment + "](" + url + ")";
          const contents = new vscode.MarkdownString("hover-exec:" + msg);
          contents.isTrusted = true; //set hover links as trusted
          return new vscode.Hover(contents); //and return it
        } else if (cmdId === "output") {
          //create & return message & urls for output hover
          cmdId = "delete";
          return new vscode.Hover(new vscode.MarkdownString(msgOut));
        } else if (oneLiner) {
          //create & return hover-message and urls for one-liners
          cmd = replaceStrVars(full);
          cmdId = "oneliner";
          let url = "vscode://rmzetti.hover-exec?" + cmdId; //cmdId;//create hover message, declare as trusted, and return it
          const contents = new vscode.MarkdownString(
            "*hover-exec:* " + comment + "\n\n[" + cmd + "](" + url + ")"
          );
          contents.isTrusted = true; //set hover links as trusted
          return new vscode.Hover(contents); //return link string
        } else {
          //create and return hover message & urls for non-built-in commands
          //cmdId='other';
          cmd = replaceStrVars(full); //replace %f etc in full string
          codeBlock = getCodeBlockAt(doc, pos); //save codeblock
          let url = "vscode://rmzetti.hover-exec?"; //create hover message
          let msg =
            "&nbsp; [ [*config*] ](" + url + cmdId + "_config) " + "[ [*last script*] ](" +
            tempPath + tempName + ")" + "[ [*last result* ] ](" + tempPath + tempName +
            ".out.txt)\n\n" + "[" + pad(cmd + comment) + "](" + url + cmdId + ")";
          const contents = new vscode.MarkdownString(
            "hover-exec:" + cmdId + msg
          );
          contents.isTrusted = true; //set hover links as trusted
          return new vscode.Hover(contents); //and return it
        }
      }
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
        cursLine = pos.line;
        cursChar = pos.character; //when command was executed
        let n = getStartOfBlock(doc, pos); //get start of codeblock
        if (n < 0) {
          return null;
        } //if not in codeblock ignore
        pos = new vscode.Position(n, 0); //set position at start of block
        let line = doc.lineAt(pos); //get command line contents
        if (executing) {
          hUri.handleUri(vscode.Uri.parse("vscode://rmzetti.hover-exec?abort"));
          progress("previous exec aborted", 500);
          return; //if processing cancel job and ignore
        }
        setExecParams(context, doc, pos, line); //reset basic execute parameters
        parseLine(line.text);
        let url = "";
        let script = config.get("scripts." + cmdId); //json object if cmd1 is a 'built-in' script
        if (script) {
          //predefined script engine strings
          cmd = replaceStrVars(script as string); //expand %f etc & get tempName
          codeBlock = getCodeBlockAt(doc, pos); //save codeblock
          url = "vscode://rmzetti.hover-exec?" + cmdId; //url as for hover execute
        } else if (cmdId === "output") {
          url = "vscode://rmzetti.hover-exec?delete"; //cursor in output block: delete the block
        } else if (oneLiner) {
          cmd = full;
          cmd = replaceStrVars(cmd);
          cmdId = "oneliner"; //set command for exec by hUri.handleUri
          url = "vscode://rmzetti.hover-exec?oneLiner";
        } else {
          //other commands
          //cmdId='other';
          line = doc.lineAt(cursLine); //get line where command was executed
          cmd = replaceStrVars(full);
          codeBlock = getCodeBlockAt(doc, pos); //save codeblock
          url = "vscode://rmzetti.hover-exec?" + cmdId; //using url enables re-use of hover-execute code
        }
        hUri.handleUri(vscode.Uri.parse(url)); //execute codeblock via url
      }
    })
  );
  context.subscriptions.push( //onDidChangeConfigurations
    vscode.workspace.onDidChangeConfiguration((e) => {
      config = vscode.workspace.getConfiguration("hover-exec"); //update config if changed
    })
  );
  context.subscriptions.push(vscode.window.registerUriHandler(hUri));

  function setExecParams(
    context: vscode.ExtensionContext,
    doc: vscode.TextDocument,
    pos: vscode.Position,
    line: vscode.TextLine
  ) {
    currentFile = doc.uri.path; //current editor file full path /c:...
    currentFsFile = doc.uri.fsPath; //os specific currentFile c:\...  (%e)
    windows = currentFsFile.slice(1, 2) === ":"; //true if os is windows
    if (vscode.workspace.workspaceFolders) {
      currentPath = vscode.workspace.workspaceFolders[0].uri.path + "/";
      currentFsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
      if (windows) {
        currentFsPath += "\\";
      } else {
        currentFsPath += "/";
      }
    } else {
      alert("workspace undefined");
    }
    vscode.workspace.fs.createDirectory(context.globalStorageUri); //create temp folder if necessary
    cmd = "";
    cmda = "";
    cmdId = "";
    comment = "";
    full = "";
    mpe = ""; //reset start line parameters
    startCode = pos.line; //save start of code line number
    tempName = "temp.txt"; //temp file name, can be used as (%n)
    tempPath = context.globalStorageUri.path + "/"; //temp folder path
    tempFsPath = context.globalStorageUri.fsPath; //temp folder path, %p
    if (windows) {
      tempFsPath += "\\";
    } else {
      tempFsPath += "/";
    }
    // let s=doc.lineAt(pos.line+1).text;
    // if(/^\s*[/%#-][/%#-]?>/.test(s)){
    //   getSpecialPath(s); //get path in 1st code line
    // }
    needSwap = false; //set true if in-line swaps required
    noOutput = line.text.includes("`>");
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
      //find start of comment in command line
      let ipos = s.indexOf("<!--"); //using these comment indicators
      if (ipos <= 0) {
        ipos = s.replace("://", "xxx").indexOf("//");
      }
      if (ipos <= 0) {
        ipos = s.indexOf("#");
      }
      return ipos;
    }
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
    s = s.replace(/\s+/, " ").trim(); //collapse multiple spaces
    full = s; //save full command line minus comments & {..}
    if (/^\w/.test(s)) {
      cmda = s.replace(/^(\w*).*/, "$1");
      if (/^\w+\s?:\w/.test(s)) {
        cmdId = s.replace(/^\w*\s?:(\w*).*/, "$1");
                      //eg. for 'js:asdf' cmdId is 'asdf'
        if(cmdId==='vmdf'){vmContext=undefined;cmdId='vm';}
                      //for 'js:def' set default context & cmdId='vm'
        else if (cmdId==='vmin'){vmContext={write};cmdId='vm';}
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
    //alert(''+full.indexOf('<')+','+full.indexOf('>'));
    //alert(''+cmdId+'; '+cmd+';['+full+']; '+tempPath+'+'+tempName);
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
    while (
      n >= 0 &&
      !doc.lineAt(new vscode.Position(n, 0)).text.startsWith("```")
    ) {
      n -= 1;
    }
    if (doc.lineAt(new vscode.Position(n, 0)).text === "```") {
      return -1;
    } //if end line, return -1
    else {
      return n;
    } //normal start line return line number
  }

  function checkJsonVisible() {
    //ensure script & swapper strings visible in settings.json
    let s = { undefined: undefined };
    let scripts = config.get("scripts");
    let merge = Object.assign({}, scripts, s);
    config.update("scripts", merge, 1);
    scripts = config.get("swappers");
    merge = Object.assign({}, scripts, s);
    config.update("swappers", merge, 1);
  }

  checkJsonVisible();//ensures scripts & swappers available in settings.json
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 500);
  context.subscriptions.push(statusBarItem);
  status('ok');

} //end function activate

const hUri = new (class MyUriHandler implements vscode.UriHandler {
  //handle hover exec commands (command is in uri.query)
  async handleUri(uri: vscode.Uri): Promise<void | null | undefined> {
    nexec += 1; //script exec number for check to ensure output is from latest script
    if (uri.query === "abort") {
      //cancel has been clicked, kill executing task
      executing = false;
      ch.kill();
      return;
    }
    if (uri.query === "delete") {
      deleteOutput(false); //delete output codeblock
      return;
    }
    if (uri.query === "remove") {
      deleteOutput(true); //change output codeblock to text
      return;
    }
    if (uri.query === "ref") {
      needSwap = false;
      let s = replaceStrVars(
        "\nCurrently:\n% f = %f\n% p = %p\n% c = %c\n% e = %e\n% n = %n"
      );
      paste(refStr + s); //paste into editor
      removeSelection();
      return;
    }
    if (uri.query === "copyToClipboard") {
      status('copied '+quickmathResult);
      await vscode.env.clipboard.writeText(quickmathResult);
      return;
    }
    if (uri.query.endsWith("_config")) {
      //show current script config in a script that can update it if required
      let s1 = cmdId;
      let s2 = "";
      if (config.get("scripts." + s1)) {
        s2 = JSON.stringify(config.get("scripts." + s1)); //stringify for output
      } else {
        s2 = '"put_start_command_here %f.txt"';
      }
      out =
        "```js :vm noInline\n" + //output :eval is an exec script which will:
        "//this script can change, add or undefine a config setting\n" + 
        'let s={"' + s1 + '":' + s2 + "};\n" + //1. show current config, or an example
        '//s={"' + s1 + '":undefined}; //uncomment this to undefine ' + s1 + "\n" +
        "let scripts=config.get('scripts');\n" + //2. get current settings for all scripts
        "let merge=Object.assign({},scripts,s);\n" + //3. update settings for current script
        "if(await config.update('scripts',merge,1)){}\n"+ //4. finally update hover-exec config
        "console.log('new config:',config.get('scripts."+s1+"'))";
      needSwap = false; //ignore anything that looks like it is a swap
      paste(out); //paste into editor as 'output :exec' script
      removeSelection();
      return;
    }
    let sCode = codeBlock;
    needSwap = inline && codeBlock.includes(swap);
    if (needSwap) {
      let re = new RegExp("(.+" + swap + ").*", "mg"); //regex finds previous results
      codeBlock = codeBlock.replace(re, "$1"); //remove them
      re = new RegExp("[-#%/ ]*" + swap, "mg"); //find any comment chars directly preceding the swap
      sCode = codeBlock.replace(re, swap); //remove them
      re = new RegExp("^(.+)" + swap, "mg"); //regex finds swap lines, sets $1 to expr
      let re1 = new RegExp("[`'\"]=>>", "");
      let swapper = config.get("swappers." + cmdId) as string;
      if (swapper && !re1.test(sCode)) {
        //replace all with swapper (uses $1)
        sCode = sCode.replace(re, swapper);
      } else {
        //if no swapper defined replace all with $1
        sCode = sCode.replace(re, "$1");
      }
    }
    process.stdout.write=hookSave;
    vscode.window.withProgress({
        //set up status bar exec indicator
        location: vscode.ProgressLocation.Window,
        title: "Hover-exec", //title for progress display
      },
      async (prog) => {
        executing = true; //set 'executing' flag
        let iexec = nexec; //& save exec number for this script
        out = ""; //reset output buffer
        prog.report({ message: "executing" }); //start execution indicator
        sCode=hrefSrcRepl(sCode);
        writeFile(tempPath + tempName, sCode); //saves code in temp file for execution
        process.chdir(currentFsPath);
        if (cmd !== '') {
          if (cmd === 'eval' || cmd === 'vm') { //use vscode internal js
            //sCode = sCode.replace(/console.log/g, "log"); //provide a console.log for vm
            //hookStdout(()=>{out+='x ';});
            hookStdout(); //hook stdout to also view in editor
            //wrap with an async function to allow use of await (eg for input, delays,etc) 
            sCode=`async function __main(){`+sCode+`};__main();`;
            try {
              if(cmd === 'eval'){
                status('using eval');
                await eval(sCode);
              } else {
                status('using vm');
                if(vmContext===undefined){
                  vmContext={...vmDefault}; //context undefined, use default (only shallow copy needed)
                }
                let vcContext=vm.createContext(vmContext);//prepare context 
                let script=new vm.Script(sCode);//syntax check
                await script.runInContext(vcContext);//execute, out produced by 'write'
              }
            } catch (e) {      //if syntax error
              needSwap=false;  //then don't do swap
              out='error '+e;  //report error in output block
            }
            process.stdout.write=hookSave; //replace normal stdout
          } else {
            if (config.clearPrevious){
              clear();
              removeSelection();
            }
            out = await execShell(cmd); //execute all other commands
            if (cmdId === "buddvs") {   //local script tester
              out = out.replace(/�/g, "î");
            }
          }
        } else {
          out = uri.toString(); //no ex, return uri
        }
        executing = false;     //execution finished
        if (iexec === nexec) { //only output if this is the latest result
          writeFile(tempPath + tempName + ".out.txt", out);//write to output file
          out = out.replace(/\[object Promise\]\n*/g, ""); //remove in editor output
          if (!noOutput) {
            if(tempName.endsWith('.html')){out='';}
            paste(out);   //paste into editor
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

let iHooknum=0; //only interested in second call of process.stdout.write
function hookStdout() {
  // @ts-ignore
  process.stdout.write = (() => {
      return function() {
          iHooknum+=1;
          if(iHooknum===2){out+=arguments[0];}
          if(iHooknum>=3){iHooknum=0;}
      };
  })();
}

function hrefSrcRepl(s:string) {
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
  //s=s.replace(/\\/g,'\\\\'); //replace single \ with \\
  if (/%[fp]\.\w/.test(s)) {
    //this allows %f.ext notation to replace ext in %f etc
    tempName= "temp." + s.replace(/.*?%[fp]\.(\w*).*/, "$1"); // \W? before last .
    s= s.replace(/(%[fp])\.\w*/, "$1"); //remove .ext // (\W?) after * and add $2
  }
  s= s
    .replace(/\/%f/g, tempPath + tempName) // '/%f' uses /
    .replace(/\/%p/g, tempPath) // '/%p' uses /
    .replace(/\/%c/g, currentPath) // '/%c' uses /
    .replace(/\/%e/g, currentFile) // '/%e' uses /
    .replace(/%f/g, tempFsPath + tempName) //%f temp file path/name
    .replace(/%p/g, tempFsPath) //%p temp folder path
    .replace(/%c/g, currentFsPath) //%c current file path
    .replace(/%e/g, currentFsFile) //%e current file path/name
    .replace(/%n/g, tempName); //%n temp file name only
  return s;
}

function clear(){
  //paste into editor
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && startCode > 0) {
    let temp='';
    if (needSwap) {
      temp = codeBlock.replace(/=>>.*?(\r?\n)/mg,'=>> $1');
    }
    activeTextEditor.edit((selText) => {
      selectCodeblock(false); //select codeblock to replace
      if (needSwap) {
        selText.replace(replaceSel, temp + "```\n");
      } else {
        selText.replace(replaceSel, '');  
      }
    });
  }  
  //not able to use clear() when using js:vm or js:eval
  //the final paste seems to do all the right things,
  //and the output is in the file, but doesn't appear in the editor
} //end function clear

function paste(text: string) {
  //paste into editor
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && startCode > 0) {
    //remove 'object promise' messages in editor
    //if(cmdId==='eval'){text=text.replace(/\[object Promise\]/g,'');}
    if (needSwap) {
      //if doing in-line output
      let re1 = new RegExp(swap + "\r?\n", ""); //allows checking for swaps
      if (re1.test(codeBlock)) {
        //if there are any swaps
        //copy in-line results into the codeblock
        let re = new RegExp("=>>.*?\r?\n", ""); //regex to remove swapped output line
        while (re1.test(codeBlock)) {
          //while there is a swap string to replace
          let i = text.indexOf("=>>") + 3; //check if there is a swappable line
          if (i > 0) {
            //if so
            let s = text.slice(i).replace(/\n[\s\S]*/, "");
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
    text = text.replace(/^\s*[\r\n]/, "").trimEnd(); //remove start blank line if any
    text = text.replace(/^[\s\S]*?\n```output/,'```output');
    text = text.replace(/^```/gm, " ```"); //put a space in front of starting ```
    //if there is any output left, it will go into an ```output codeblock
    activeTextEditor.edit((selText) => {
      selectCodeblock(false); //select codeblock to replace
      let lbl = "```output\n"; //can start output with ``` to replace ```output
      if (text.startsWith(" ```")) {
        text = text.slice(1);
        lbl = "";
      }
      if (text === "") {
        //no more output
        if (needSwap) {
          selText.replace(replaceSel, codeBlock + "```\n");
        } else {
          selText.replace(replaceSel, '');//lbl + text + "\n```\n");  
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

function selectCodeblock(force: boolean) {
  //select codeblock appropriately depending on type
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && startCode > 0) {
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

function deleteOutput(asText: boolean) {
  //delete output code block, or leave as text
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor) {
    selectCodeblock(true);
    if (asText) {
      //remove start and end lines, ie. the lines with backticks
      let pos1 = activeTextEditor.selection.start.line + 1;
      let pos2 = activeTextEditor.selection.end.line - 1;
      let sel = new vscode.Selection(pos1, 0, pos2, 0);
      activeTextEditor.edit((selText) => {
        selText.replace(
          activeTextEditor.selection,
          activeTextEditor.document.getText(sel)
        );
      });
    } else {
      //remove whole output block
      activeTextEditor.edit((selText) => {
        selText.replace(activeTextEditor.selection, "");
      });
    }
  }
}

async function execShell(cmd: string){
  //execute shell command (to start scripts, run audio etc.)
  return new Promise<string>((resolve, reject) => {
    ch = cp.exec(cmd, (err1, out1, stderr1) => {
      if (err1 && stderr1 !== "") {
        //alert('1. '+err1+',<'+stderr1+'>')
        needSwap=false;
        return resolve(out1 + err1 + "," + stderr1);
      }
      return resolve(out1 + stderr1);
    });
  });
}

async function writeFile(path: string, text: string) {
  //write a file in vm & eval. Usage: await writeFile(path,text)
  //`text` is written to the file at path (full path)
  await vscode.workspace.fs.writeFile(vscode.Uri.file(path), Buffer.from(text));
}

function utf8ArrayToStr(array:Uint8Array) {
  var out, i, len, c;
  var char2, char3;
  out = "";
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

async function readFile(path:string){
  //read a file in vm & eval. Usage: await readFile(path)
  return utf8ArrayToStr(await vscode.workspace.fs.readFile(vscode.Uri.file(path)));
}

function vmRequire(src:string){
  //provide a 'require' for vm blocks
  //note: just use 'require', the context will link to this
  return eval('require("'+src+'")');
}

function write(...args: any[]) {
  for (var i = 0; i < args.length; i++) {
    if (i > 0) {
      out += " ";
    }
    out += args[i];
  }
  out += "\n";
}

function log() {
  //provide a visible console.log() for vm & eval blocks
  console.log(arguments); //do normal console.log
  write(...arguments);  //plus write to output block via 'out'
}

let statusBarItem: vscode.StatusBarItem;
function status(s:string): void {
  //put a string in the status bar for vm & eval
  if(s!==undefined && s!==''){
    statusBarItem.text = `=>>`+s;
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
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
