"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const cp = require("child_process");
let codeBlock = ""; //code f or execution
let startCode = 0; //start line of code
let out = ''; //output from code execution
const swap = '=>>'; //3 char string to indicate pos for in-line result
let swapExp = ''; //expression in script language to produce in-line result
let needSwap = false; //no swaps so leave code as is
let windows = false; //os is windows
let tempPath = ''; //  path for temp files (provided by vscode)
let tempFsPath = ''; //fsPath for temp files (provided by vscode)
let tempFile = ''; //file name of temp file for current script
let cd = ''; //code default start line for current script
let cmdId = ''; //execution id for current script
let cmd = ''; //javascript to start current script execution
let msg = ''; //message for hover, derived from ``` line
let shown = false; //progress message 1 showinf
let currentFile = ''; //path & name of current edit file
let currentFsFile = ''; //path & name as os default string
let currentPath = ''; //folder containing current edit file
let currentFsPath = ''; //folder containing current edit file fsPath
let executing = false; //code is executing
let nexec = 0; //number of currently executing code (auto incremented)
let oneLiner = false; //current script is a 'one-liner'
let inline = false; //if true disallows inline results
let ch; //child process executing current script
let cursLine = 0; //cursor line pos
let cursChar = 0; //cursor char pos
let replaceSel = new vscode.Selection(0, 0, 0, 0); //section in current editor which will be replaced
let config = vscode.workspace.getConfiguration('hover-exec'); //hover-exec settings
let refStr = '*hover-exec:* predefined strings:\n' +
    ' - %n `name.ext` of temporary file\n' +
    ' - %f `full_path/name.ext` of temp file\n' +
    ' - %p `full_path/` for temporary files\n' +
    ' - %c `full_path/` of the current folder\n' +
    ' - %e `full_path/` of the editor file\n' +
    ' - (for windows, use /%f etc for /c:/linux/web/style path)\n' +
    ' =>> for in-line result (for *md-preview-enhanced* use // =>> etc)';
//all single char variables declared for persistence over several eval scripts
let a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z; //typescript reports unused
function activate(context) {
    vscode.languages.registerHoverProvider('markdown', new (class {
        provideHover(doc, pos, token) {
            return __awaiter(this, void 0, void 0, function* () {
                let line = doc.lineAt(pos); //user is currently hovering over this line
                oneLiner = false; //check for a one-liner
                if (!line.text.startsWith('```')) {
                    oneLiner = line.text.startsWith('`') && line.text.slice(2).includes('`');
                    if (!oneLiner) {
                        return null;
                    } //ignore if not a code block or oneLiner
                }
                if (executing) { //if already executing code block, show cancel option
                    return new vscode.Hover(new vscode.MarkdownString('*hover-exec:* executing...\n\n[cancel execution](vscode://rmzetti.hover-exec?abort)'));
                }
                if (line.text === '```') { //allow hover-exec from end of codeblock
                    let n = getStartOfBlock(doc, pos); //if at end, get start of block
                    if (n < 0) {
                        return null;
                    } //if can't find start ignore
                    pos = new vscode.Position(n, 0); //adjust pos and line
                    line = doc.lineAt(pos); //to refer to start of block
                }
                setExecParams(context, doc, pos, line); //reset basic exec parameters inc cmdId
                cursLine = 0; //do not reset cursor pos for hover click 
                let cmd1 = cmdId.replace(/\s.*/, ''); //check for predefined commands (no spaces)
                let script = config.get('scripts.' + cmd1); //is json object if cmd1 is a 'built-in' script
                msg = getmsg(line.text); //begin message for hover
                if (script) { //if predefined script engine
                    cmdId = cmd1;
                    getScriptSettings(script); //get predefined command strings (& expand %f etc)
                    if (!script) {
                        return null;
                    } //ignore if redirect (script.alt) didn't work
                    codeBlock = getCodeBlockAt(doc, pos); //save codeblock
                    let url = 'vscode://rmzetti.hover-exec?' + cmdId; //url for hover
                    msg = cmdId + ' [ \[*settings*\] ](' + url + '_settings) ' + //add hover info
                        '[ \[*ref*\] ](vscode://rmzetti.hover-exec?ref)\n\n' +
                        '[ \[*last script*\] ](' + tempPath + tempFile + ') ' + //create last script & result urls
                        '[ \[*last result*\] ](' + tempPath + tempFile + '.out.txt)\n\n' +
                        '[ ' + cmdId + msg + '](' + url + ')';
                    const contents = new vscode.MarkdownString('hover-exec:' + msg);
                    contents.isTrusted = true; //set hover links as trusted
                    return new vscode.Hover(contents); //and return it
                }
                else if (cmdId === 'output') { //create & return message & urls for output hover  
                    cmdId = 'delete'; //options:delete or remove codeblock & leave text
                    return new vscode.Hover(new vscode.MarkdownString('*hover-exec:*\n\n[output to text](vscode://rmzetti.hover-exec?remove)\n\n' +
                        '[delete output](vscode://rmzetti.hover-exec?delete)' //return output delete hover
                    ));
                }
                else if (cmdId === 'ref') {
                    const contents = new vscode.MarkdownString(refStr + '\n\n [*ref*](vscode://rmzetti.hover-exec?ref)');
                    contents.isTrusted = true; //set hover links as trusted
                    return new vscode.Hover(contents); //return link string
                }
                else if (oneLiner) { //create & return hover-message and urls for one-liners
                    cmd = line.text.slice(1).replace(/{.*}/, ''); //exec is start command, next line substitutes %f etc
                    cmd = replaceStrVars(cmd.slice(0, cmd.indexOf('`')).replace(/%20/mg, ' '));
                    cmdId = 'oneliner'; //command id
                    let url = 'vscode://rmzetti.hover-exec?' + cmdId; //create hover message, declare as trusted, and return it
                    const contents = new vscode.MarkdownString('*hover-exec:* ' + msg + '\n\n[' + cmd + '](' + url + ')');
                    contents.isTrusted = true; //set hover links as trusted
                    return new vscode.Hover(contents); //return link string
                }
                else if (cmdId === '{cmd}') { //use {cmd=...} for settings as in md preview enhanced
                    let s = line.text.slice(3, line.text.indexOf('}') + 1);
                    if (getEnhCmd(s) === '') {
                        return new vscode.Hover('not well formed:' + s);
                    }
                    codeBlock = getCodeBlockAt(doc, pos); //save codeblock
                    let url = 'vscode://rmzetti.hover-exec?cmd';
                    msg = '[ \[*last script*\] ](' + tempPath + tempFile + ') ' + //create last script & result urls
                        '[ \[*last result*\] ](' + tempPath + tempFile + '.out.txt)' +
                        '\n\n' + '[ ' + cmd + '](' + url + ')';
                    const contents = new vscode.MarkdownString('hover-exec: ' + msg);
                    contents.isTrusted = true; //set hover links as trusted
                    return new vscode.Hover(contents); //and return it
                }
                else { //create and return hover message & urls for non-built-in commands
                    cmd = (cmdId + ' "' + tempPath + tempFile + '"').replace(/%20/mg, ' ');
                    codeBlock = getCodeBlockAt(doc, pos); //save codeblock
                    let url = 'vscode://rmzetti.hover-exec?' + cmdId.replace(/\s/mg, '%20');
                    msg = '[' + cmdId + msg + '](' + url + ')'; //create hover message & url
                    msg = cmdId + ' [ \[*settings*\] ](' + url + '_settings) ' + //add hover info
                        '*[ \[last script\] ](' + tempPath + tempFile + ')*\n\n' + msg;
                    const contents = new vscode.MarkdownString('hover-exec:' + msg);
                    contents.isTrusted = true; //set hover links as trusted
                    return new vscode.Hover(contents); //and return it
                }
            });
        }
    })());
    context.subscriptions.push(vscode.commands.registerCommand("hover-exec.exec", () => {
        //preocess exec command (suggested shortcut Alt+/ ) -- find start of block and execute
        let editor = vscode.window.activeTextEditor;
        if (editor) {
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
                hUri.handleUri(vscode.Uri.parse('vscode://rmzetti.hover-exec?abort'));
                progress1('previous exec aborted', 500);
                return; //if processing cancel job and ignore
            }
            setExecParams(context, doc, pos, line); //reset basic execute parameters
            let url = '';
            let cmd1 = cmdId.replace(/\s.*/, ''); //check for predefined commands (nothing after a space)
            let script = config.get('scripts.' + cmd1); //json object if cmd1 is a 'built-in' script
            //let script=config.get(cmd1);    //array of strings (prev) if cmd1 is a 'built-in' script
            if (script) { //predefined script engine strings
                cmdId = cmd1;
                getScriptSettings(script); //get predefined command strings (& expand %f etc)
                if (!script) {
                    return null;
                } //redirect (script.alt) didn't work
                codeBlock = getCodeBlockAt(doc, pos); //save codeblock
                url = 'vscode://rmzetti.hover-exec?' + cmdId; //url as for hover-execute
            }
            else if (cmdId === '{cmd}') { //use {cmd=...} as in md preview enhanced
                let s = line.text.slice(3, line.text.indexOf('}') + 1);
                if (getEnhCmd(s) === '') {
                    return new vscode.Hover('not well formed:' + s);
                }
                codeBlock = getCodeBlockAt(doc, pos); //save codeblock
                url = 'vscode://rmzetti.hover-exec?cmd';
            }
            else if (cmdId === 'output') {
                deleteOutput(false); //cursor in output block: delete the block
                return;
            }
            else if (cmdId === 'ref') {
                url = 'vscode://rmzetti.hover-exec?ref';
            }
            else { //other commands and one-liners
                line = doc.lineAt(cursLine); //get line where command was executed  
                if (oneLiner) { //create exec string for one-liner
                    cmd = line.text.slice(1).replace(/{.*}/, ''); //remove {..} exec is start command, next line substitutes %f etc
                    cmd = replaceStrVars(cmd.slice(0, cmd.indexOf('`')).replace(/%20/mg, ' '));
                    cmdId = 'oneliner'; //set command for exec by hUri.handleUri
                }
                else {
                    cmd = line.text.slice(3).replace(/{.*}/, ''); //exec is start command, next line substitutes %f etc
                    cmd = replaceStrVars(cmd.slice(0, cmd.indexOf('```')).replace(/%20/mg, ' '));
                }
                url = 'vscode://rmzetti.hover-exec?ex'; //using url enables re-use of hover-execute code
            }
            hUri.handleUri(vscode.Uri.parse(url)); //execute codeblock via url
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        config = vscode.workspace.getConfiguration('hover-exec'); //update config if changed
    }));
    context.subscriptions.push(vscode.window.registerUriHandler(hUri));
} //end function activate
exports.activate = activate;
let hUri = new class MyUriHandler {
    //handle hover exec commands (command is in uri.query)
    handleUri(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            nexec += 1; //script exec number for check to ensure output is from latest script
            if (uri.query === 'abort') { //cancel has been clicked, kill executing task
                executing = false;
                ch.kill();
                return;
            }
            if (uri.query === 'delete') {
                deleteOutput(false); //delete output codeblock
                return;
            }
            if (uri.query === 'remove') {
                deleteOutput(true); //change output codeblock to text
                return;
            }
            if (uri.query === 'ref') {
                needSwap = false;
                paste(refStr); //paste into editor
                removeSelection();
                return;
            }
            if (uri.query.endsWith('_settings')) {
                //show current script settings in a script that can update them if required
                let s1 = uri.query.slice(0, uri.query.indexOf('_settings'));
                let s2 = "";
                if (config.get('scripts.' + s1)) {
                    s2 = JSON.stringify(config.get('scripts.' + s1)); //stringify for output
                }
                else {
                    s2 = JSON.stringify(config.get('scripts.test'));
                }
                out = "```output :eval noInline\n" + //output :eval is an exec script which will:
                    "let s=String.raw`" + s2 + "`;\n" + //1. use String.raw to avoid obscuring settings
                    "let scripts=config.get('scripts');\n" + //2. get current settings for all scripts
                    "scripts." + s1 + "=JSON.parse(s);\n" + //3. update settings for current script
                    "if(config.update('scripts',scripts,1)){}"; //4. finally update hover-exec config. 
                //writeFile(tempPath+tempFile+'.out.txt',out);//write to output file
                needSwap = false; //ignore anything that looks like it is a swap
                paste(out); //paste into editor as 'output :exec' script
                removeSelection();
                return;
            }
            let sCode = codeBlock;
            needSwap = inline && codeBlock.includes(swap);
            if (needSwap) {
                let re = new RegExp('(.+' + swap + ').*', 'mg'); //regex finds previous results
                codeBlock = codeBlock.replace(re, '$1'); //remove them
                re = new RegExp('[-#%/ ]*' + swap, 'mg'); //find any comment chars preceding the swap
                sCode = codeBlock.replace(re, swap); //remove them
                re = new RegExp('^(.+)' + swap, 'mg'); //regex finds swap lines, sets $1 to expr
                sCode = sCode.replace(re, swapExp); //replace all with swapExp (uses $1)
            }
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Window,
                title: 'Hover-exec' //title for progress display
            }, (progress) => __awaiter(this, void 0, void 0, function* () {
                executing = true; //set 'executing' flag
                let iexec = nexec; //& save exec number for this script
                out = ''; //reset output buffer
                progress.report({ message: 'executing' }); //start execution indicator
                writeFile(tempPath + tempFile, cd + sCode); //saves code in temp file for execution
                process.chdir(currentFsPath);
                if (cmdId !== '') {
                    if (cmd === '') { //use vscode internal js eval via eval
                        sCode = sCode.replace(/console.log/g, 'write'); //provide a console.log for eval
                        eval(sCode); //execute codeblock with eval
                    }
                    else if (cmdId === 'oneliner') { //execute one-liner
                        yield execShell(cmd); //cmd has one-liner
                        executing = false; //exec complete  
                        return; //one-liners do not produce output
                    }
                    else {
                        out = yield execShell(cmd); //execute all other commands
                        if (cmdId === 'buddvs') {
                            out = out.replace(/�/g, 'î');
                        } //for test scripter
                        if (oneLiner) {
                            startCode -= 1;
                        }
                    }
                }
                else {
                    out = uri.toString(); //no ex, return uri
                }
                executing = false; //execution finished
                //output to both output file and editor
                //todo: {output=none} option to output only to file
                if (iexec === nexec) { //only output if this is the latest result
                    writeFile(tempPath + tempFile + '.out.txt', out); //write to output file
                    out = out.replace(/\[object Promise\]\n*/g, ''); //remove in editor output
                    if (out !== '') {
                        paste(out); //paste into editor
                        removeSelection(); //deselect
                    }
                    progress1('ok', 500); //report successful completion
                    //todo: silence this with {quiet} option
                }
                ;
            }));
        });
    }
}; //end hUri=new class MyUriHandler
function setExecParams(context, doc, pos, line) {
    currentFile = doc.uri.path; //current editor file full path /c:...
    currentFsFile = doc.uri.fsPath; //os specific currentFile c:\...  (%e)
    windows = currentFsFile.slice(1, 2) === ':'; //true if os is windows
    if (vscode.workspace.workspaceFolders) {
        currentPath = vscode.workspace.workspaceFolders[0].uri.path + '/';
        currentFsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        if (windows) {
            currentFsPath += '\\';
        }
        else {
            currentFsPath += '/';
        }
    }
    else {
        alert('workspace undefined');
    }
    vscode.workspace.fs.createDirectory(context.globalStorageUri); //create temp folder if necessary
    cd = '';
    cmd = ''; //reset code default start line
    startCode = pos.line; //save start of code line number
    tempFile = 'temp.txt'; //temporary file name, can be used as (%n)
    tempPath = context.globalStorageUri.path + '/'; //temp folder path
    tempFsPath = context.globalStorageUri.fsPath; //temp folder path, %p
    if (windows) {
        tempFsPath += '\\';
    }
    else {
        tempFsPath += '/';
    }
    swapExp = ''; //default is empty string
    needSwap = false; //set true if in-line swaps required
    cmdId = getCmdId(line.text); //command id, performs {...} changes
} //end function setExecParams
function paste(text) {
    const { activeTextEditor } = vscode.window;
    if (activeTextEditor && startCode > 0) {
        //remove 'object promise' messages in editor
        //if(cmdId==='eval'){text=text.replace(/\[object Promise\]/g,'');}
        if (needSwap) { //if doing in-line output
            let re1 = new RegExp(swap + '$', 'm'); //indicator for any remaining swap string
            if (re1.test(codeBlock)) { //if there are any swap getScriptSettings
                //copy in-line results into the codeblock
                let re = new RegExp('{{.*}}\r?\n', ''); //regex to remove swapped output line was ('^.*{{.*}}$','m')
                while (re1.test(codeBlock)) { //while there is a swap string to replace
                    let i = text.indexOf('{{') + 2; //find the start and
                    let j = text.indexOf('}}\r'); //end of the next swappable {{output}}
                    if (j < 0) {
                        j = text.indexOf('}}\n');
                    } //allow for \n, \r & \r\n eols
                    if (i > 0 && j >= i) { //if inded there is a swappable line
                        let s = text.substring(i, j).replace(/\r?\n/, ' '); //remove newlines in in-line results
                        if (s === '') {
                            s = ';';
                        } //if the remainder is empty just provide ;
                        codeBlock = codeBlock.replace(swap + '\n', swap + s + '\n'); //do the swap
                        text = text.replace(re, ''); //remove the swapped output to clear for the next
                    }
                    else {
                        break;
                    } //break when done
                }
            }
        }
        text = text.replace(/^\s*[\r\n]/, '').trimEnd(); //remove start blank line if any
        text = text.replace(/^```/mg, ' ```'); //put a space in front of starting ```
        //if there is any output left, it will go into an ```output codeblock
        activeTextEditor.edit((selText) => {
            selectCodeblock(); //select codeblock to replace
            let lbl = "```output\n"; //can start output with ``` to replace ```output
            if (text.startsWith(' ```')) {
                text = text.slice(1);
                lbl = '';
            }
            if (text === '') { //no more output
                if (needSwap) {
                    selText.replace(replaceSel, codeBlock + "```\n");
                }
            }
            else if (oneLiner || !needSwap) { //only producing an output block
                selText.replace(replaceSel, lbl + text + "\n```\n");
            }
            else { //replace the codeblock text/output (ie. codeblock includes inline results)
                selText.replace(replaceSel, codeBlock + "```\n" + lbl + text + "\n```\n");
            }
        });
    }
} //end function paste
function write() {
    for (var i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ' ';
        }
        out += arguments[i];
    }
    out += '\n';
}
function getCmdId(s) {
    if (s.startsWith('```{')) {
        return '{cmd}';
    }
    inline = !s.toLowerCase().includes('noinline'); //allows normal use of =>>
    if (s.includes('temp=')) { //allow specification of the temp file name, eg {temp=temp.py}
        tempFile = s.replace(/.*temp=(.*?)[\s\,\}].*/, '$1').replace(/["']/g, '');
    }
    let s1 = s.replace(/\s+/, ' ').replace(/\s(?!:).*/, '');
    if (s1.includes(':')) { //check for command id switch, eg. ```js:eval
        s1 = s1.slice(s1.indexOf(':') + 1).replace(/.*?\W.*/, '');
        if (s1 !== '') {
            return s1;
        }
    }
    if (oneLiner) {
        s = s.slice(1);
    } //oneliners (only) start with single backticks
    else {
        s = s.slice(3);
    } //remove initial triple backtick
    if (s.startsWith('"')) { //return quoted bit as command
        return s.slice(1).replace(/".*/, '');
    }
    s = s.replace(/`.*/, ''); //remove end backticks (if on the start line) and all after
    let ipos = posComment(s); //find comment in cmd line (std comment formats)
    if (ipos > 0) {
        s = s.slice(0, ipos);
    } //and remove it
    cmdId = s.replace(/{.*}/, '').trim(); //return trimmed line as command
    return cmdId;
} //end function getCmdId
function getEnhCmd(s) {
    inline = false;
    cmd = s.replace(/.*cmd=(.+?)[,;}].*/, '$1');
    if (s.includes('temp=')) {
        s = s.replace(/.*temp=['"]+(.+?)['"]+[,;}].*/, '$1');
    }
    else {
        s = '';
    }
    if (cmd === '' || cmd.includes('=') || s.includes('=') ||
        s.includes('\\') || s.includes('/')) {
        return "";
    }
    if (s !== '') {
        tempFile = s;
    }
    cmd = replaceStrVars(cmd);
    return cmd;
    vscode.UIKind.Desktop;
} //end function getEnhCmd
function getmsg(s) {
    let msg = '';
    if (oneLiner) {
        s = s.slice(1).replace(/.*`/, '');
    } //oneliners use single backticks
    else {
        s = s.slice(3).replace(/.*```/, '');
    } //remove triple backticks
    let ipos = posComment(s); //find comment in command line
    if (ipos > 0) {
        msg = ' ' + s.substr(ipos);
    } //use comments in hover message
    return msg;
}
function posComment(s) {
    let ipos = s.indexOf('<!--'); //using any of these 'standard' comment indicators
    if (ipos <= 0) {
        ipos = s.indexOf('--');
    }
    if (ipos <= 0) {
        ipos = s.indexOf('//');
    }
    if (ipos <= 0) {
        ipos = s.indexOf('%%');
    }
    if (ipos <= 0) {
        ipos = s.indexOf('##');
    }
    return ipos;
}
function getScriptSettings(script) {
    if (script.alt) { //allow redirection of command
        script = config.get('scripts.' + script.alt); //redirect
        if (!script || script.alt) { //but only once
            return undefined;
        }
    }
    if (script.tempf) {
        tempFile = script.tempf;
    } //temp file name to use
    if (script.cmd) {
        cmd = replaceStrVars(script.cmd);
    } //js command to execute script processor
    if (script.start) {
        cd = replaceStrVars(script.start);
    }
    ; //script default start line, if needed
    if (cd !== '') {
        cd += '\n';
    } //if start line used, terminate line
    if (script.swap) {
        swapExp = script.swap;
    } // {{ put double curly brackets round line result, $1 }}
}
function replaceStrVars(s) {
    return s.replace(/\/%f/g, tempPath + tempFile) // /%f switches to /
        .replace(/\/%p/g, tempPath) // /%p switches to /
        .replace(/\/%c/g, currentPath) // /%c switches to /
        .replace(/\/%e/g, currentFile) // /%e switches to /
        .replace(/%f/g, tempFsPath + tempFile) //%f temp file path/name
        .replace(/%p/g, tempFsPath) //%p temp folder path
        .replace(/%c/g, currentFsPath) //%c current file path
        .replace(/%e/g, currentFsFile) //%e current file path/name
        .replace(/%n/g, tempFile); //%n temp file name only
}
function removeSelection() {
    const { activeTextEditor } = vscode.window;
    if (activeTextEditor) {
        if (cursLine === 0) {
            replaceSel = new vscode.Selection(startCode, 0, startCode, 0);
        }
        else {
            replaceSel = new vscode.Selection(cursLine, cursChar, cursLine, cursChar);
        }
        activeTextEditor.selection = replaceSel;
    }
}
const execShell = (cmd) => //execute shell command (to start scripts) 
 new Promise((resolve, reject) => {
    //alert('execshell '+cmd);
    ch = cp.exec(cmd, (err1, out1, stderr1) => {
        if (err1 && stderr1 === '') {
            return resolve(out1 + err1 + ',' + stderr1);
        }
        return resolve(out1 + stderr1);
    });
});
function writeFile(file, text) {
    return __awaiter(this, void 0, void 0, function* () {
        yield vscode.workspace.fs.writeFile(vscode.Uri.file(file), Buffer.from(text));
    });
}
function getStartOfBlock(//return start of codeblock containing ```, or -1
doc, pos) {
    let temptxt = doc.lineAt(pos).text;
    oneLiner = !temptxt.startsWith('```') && temptxt.startsWith('`') && temptxt.slice(2).includes('`');
    //oneliner is whole script in single line: uses single backtick at start of line & at end of command
    if (oneLiner || temptxt.startsWith('```') && temptxt.slice(3).trim().length > 0) {
        return pos.line; //if a oneliner or normal start line return line number
    }
    let n = pos.line - 1; //start here and look backwards for start line
    while (n >= 0 && !doc.lineAt(new vscode.Position(n, 0)).text.startsWith('```')) {
        n -= 1;
    }
    if (doc.lineAt(new vscode.Position(n, 0)).text === '```') {
        return -1;
    } //if end line, return -1
    else {
        return n;
    } //normal start line return line number
}
function getCodeBlockAt(//return code in code block depending on type
doc, pos) {
    const { activeTextEditor } = vscode.window;
    let s = '';
    startCode = 0;
    if (activeTextEditor) {
        let n = pos.line + 1;
        startCode = n;
        if (oneLiner) { //return all after first space up to backtick
            let s1 = doc.lineAt(pos).text.slice(1);
            s1 = replaceStrVars(s1.slice(s1.indexOf(' ') + 1, s1.indexOf('`'))); //.replace(/\\/g,'/');
            return s1;
        }
        if (doc.lineAt(pos).text.endsWith('```')) {
            return ''; //return empty string
        }
        while (n < doc.lineCount) {
            let a = doc.lineAt(new vscode.Position(n, 0)).text;
            n++;
            if (a.startsWith('```')) {
                break; //stop at line starting with ```
            }
            else { //add line to code buffer
                s = s + a + '\n';
            }
        }
    }
    return s;
} //end function getCodeBlockAt
function selectCodeblock() {
    const { activeTextEditor } = vscode.window;
    if (activeTextEditor && startCode > 0) {
        const doc = activeTextEditor.document;
        let n = startCode; //selection starts from startCode
        if (oneLiner) {
            n++;
            if (!(n === doc.lineCount) && doc.lineAt(new vscode.Position(n, 0)).text.startsWith('```output')) {
                let m = n;
                while (m < doc.lineCount) { //find the end of the output section
                    m++;
                    if (doc.lineAt(new vscode.Position(m, 0)).text.startsWith('```')) {
                        replaceSel = new vscode.Selection(n, 0, m + 1, 0);
                        activeTextEditor.selection = replaceSel;
                        break;
                    }
                }
            }
            else {
                replaceSel = new vscode.Selection(n, 0, n, 0);
                activeTextEditor.selection = replaceSel;
            }
        }
        else {
            let output = doc.lineAt(new vscode.Position(n, 0)).text.startsWith('```output');
            //records when an output line reached
            while (n < doc.lineCount) {
                n++; //work through the block 
                if (doc.lineAt(new vscode.Position(n, 0)).text.startsWith('```')) {
                    n++;
                    if (n < doc.lineCount &&
                        doc.lineAt(new vscode.Position(n, 0)).text.startsWith('```output')) {
                        if (!needSwap) {
                            startCode = n;
                            output = true;
                        }
                    }
                    else {
                        if (!needSwap && !output) {
                            startCode = n;
                        } //if no swapping & no output block, select starts here
                        if (oneLiner) {
                            startCode -= 1;
                        }
                        replaceSel = new vscode.Selection(startCode, 0, n, 0);
                        activeTextEditor.selection = replaceSel;
                        break;
                    }
                }
            }
        }
    }
    return;
} //end function selectCodeblock
function deleteOutput(asText) {
    const { activeTextEditor } = vscode.window;
    if (activeTextEditor) {
        selectCodeblock();
        if (asText) { //remove start and end lines, ie. with backticks
            let pos1 = activeTextEditor.selection.start.line + 1;
            let pos2 = activeTextEditor.selection.end.line - 1;
            ;
            let sel = new vscode.Selection(pos1, 0, pos2, 0);
            activeTextEditor.edit((selText) => {
                selText.replace(activeTextEditor.selection, activeTextEditor.document.getText(sel));
            });
        }
        else { //remove whole output block
            activeTextEditor.edit((selText) => {
                selText.replace(activeTextEditor.selection, '');
            });
        }
    }
}
function deactivate() {
}
exports.deactivate = deactivate;
function alert(s) {
    vscode.window.showInformationMessage(s);
}
function progress1(msg, timeout) {
    //show a 'progress' pop up for eval scripts, timeout in ms
    if (shown || msg === "") {
        return;
    }
    let p = vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "hover-exec", cancellable: false
    }, (progress) => {
        shown = true;
        progress.report({ increment: -1, message: msg });
        let p = new Promise(resolve => {
            setTimeout(() => {
                resolve();
                shown = false;
            }, timeout);
        });
        return p;
    });
    return p;
}
//# sourceMappingURL=extension.js.map