(()=>{"use strict";var __webpack_modules__={112:function(__unused_webpack_module,exports,__webpack_require__){eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.deactivate = exports.activate = void 0;\r\nconst vscode = __webpack_require__(549);\r\nconst cp = __webpack_require__(129);\r\nlet codeBlock = \"\"; //code f or execution\r\nlet startCode = 0; //start line of code\r\nlet out = ''; //output from code execution\r\nconst swap = '=>>'; //3 char string to indicate pos for in-line result\r\nlet swapExp = ''; //expression in script language to produce in-line result\r\nlet needSwap = false; //no swaps so leave code as is\r\nlet windows = false; //os is windows\r\nlet tempPath = ''; //  path for temp files (provided by vscode)\r\nlet tempFsPath = ''; //fsPath for temp files (provided by vscode)\r\nlet tempName = ''; //file name of temp file for current script\r\nlet cd = ''; //code default start line for current script\r\nlet cmdId = ''; //execution id for current script\r\nlet cmd = ''; //javascript to start current script execution\r\nlet msg = ''; //message for hover, derived from ``` line\r\nlet shown = false; //progress message 1 showinf\r\nlet currentFile = ''; //path & name of current edit file\r\nlet currentFsFile = ''; //path & name as os default string\r\nlet currentPath = ''; //folder containing current edit file\r\nlet currentFsPath = ''; //folder containing current edit file fsPath\r\nlet executing = false; //code is executing\r\nlet nexec = 0; //number of currently executing code (auto incremented)\r\nlet oneLiner = false; //current script is a 'one-liner'\r\nlet inline = false; //if true disallows inline results\r\nlet ch; //child process executing current script\r\nlet cursLine = 0; //cursor line pos\r\nlet cursChar = 0; //cursor char pos\r\nlet replaceSel = new vscode.Selection(0, 0, 0, 0); //section in current editor which will be replaced\r\nlet config = vscode.workspace.getConfiguration('hover-exec'); //hover-exec settings\r\nlet refStr = '*hover-exec:* predefined strings:\\n' +\r\n    ' - %n `name.ext` of temporary file\\n' +\r\n    ' - %f `full_path/name.ext` of temp file\\n' +\r\n    ' - %p `full_path/` for temporary files\\n' +\r\n    ' - %c `full_path/` of the current folder\\n' +\r\n    ' - %e `full_path/` of the editor file\\n' +\r\n    ' - (for windows, use /%f etc for /c:/linux/web/style path)\\n' +\r\n    ' =>> for in-line result (for *md-preview-enhanced* use // =>> etc)';\r\n//all single char variables declared for persistence over several eval scripts\r\nlet a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z; //typescript reports unused\r\nfunction activate(context) {\r\n    vscode.languages.registerHoverProvider('markdown', new (class {\r\n        provideHover(doc, pos, token) {\r\n            return __awaiter(this, void 0, void 0, function* () {\r\n                let line = doc.lineAt(pos); //user is currently hovering over this line\r\n                oneLiner = false; //check for a one-liner\r\n                if (!line.text.startsWith('```')) {\r\n                    oneLiner = line.text.startsWith('`') && line.text.slice(2).includes('`');\r\n                    if (!oneLiner) {\r\n                        return null;\r\n                    } //ignore if not a code block or oneLiner\r\n                }\r\n                if (executing) { //if already executing code block, show cancel option\r\n                    return new vscode.Hover(new vscode.MarkdownString('*hover-exec:* executing...\\n\\n[cancel execution](vscode://rmzetti.hover-exec?abort)'));\r\n                }\r\n                let output = line.text.startsWith('```output'); //will include 'delete' in options\r\n                if (line.text === '```') { //allow hover-exec from end of codeblock\r\n                    let n = getStartOfBlock(doc, pos); //if at end, get start of block\r\n                    if (n < 0) {\r\n                        return null;\r\n                    } //if can't find start ignore\r\n                    pos = new vscode.Position(n, 0); //adjust pos and line\r\n                    line = doc.lineAt(pos); //to refer to start of block\r\n                }\r\n                setExecParams(context, doc, pos, line); //reset basic exec parameters inc cmdId\r\n                cursLine = 0; //do not reset cursor pos for hover click \r\n                let cmd1 = cmdId.replace(/\\s.*/, ''); //check for predefined commands (no spaces)\r\n                let script = config.get('scripts.' + cmd1); //is json object if cmd1 is a 'built-in' script\r\n                msg = getmsg(line.text); //begin message for hover\r\n                if (script) { //if predefined script engine\r\n                    cmdId = cmd1;\r\n                    getScriptSettings(script); //get predefined command strings (& expand %f etc)\r\n                    if (!script) { //eg. redirect (script.alt) didn't work\r\n                        return new vscode.Hover(new vscode.MarkdownString('*hover-exec:*\\n\\n' + cmdId + ' script config problem'));\r\n                    }\r\n                    codeBlock = getCodeBlockAt(doc, pos); //save codeblock\r\n                    let url = 'vscode://rmzetti.hover-exec?' + cmdId; //url for hover\r\n                    msg = cmdId + '[ \\[*config*\\] ](' + url + '_config) ' + //add hover info\r\n                        '[ \\[*ref*\\] ](vscode://rmzetti.hover-exec?ref)\\n\\n';\r\n                    if (output) {\r\n                        msg += '[delete \\[*output*\\] ](vscode://rmzetti.hover-exec?delete)';\r\n                    }\r\n                    msg += 'open: [ \\[*last script*\\] ](' + tempPath + tempName + ') ' + //create last script & result urls\r\n                        '[ \\[*last result*\\ ] ](' + tempPath + tempName + '.out.txt)\\n\\n' +\r\n                        '[' + cmdId + getmsg(line.text) + '](' + url + ')';\r\n                    const contents = new vscode.MarkdownString('hover-exec:' + msg);\r\n                    contents.isTrusted = true; //set hover links as trusted\r\n                    return new vscode.Hover(contents); //and return it\r\n                }\r\n                else if (cmdId === 'output') { //create & return message & urls for output hover  \r\n                    cmdId = 'delete'; //options:delete or remove codeblock & leave text\r\n                    return new vscode.Hover(new vscode.MarkdownString('*hover-exec:*\\n\\n[output to text](vscode://rmzetti.hover-exec?remove)\\n\\n' +\r\n                        '[delete output](vscode://rmzetti.hover-exec?delete)' //return output delete hover\r\n                    ));\r\n                }\r\n                else if (oneLiner) { //create & return hover-message and urls for one-liners\r\n                    cmd = line.text.slice(1).replace(/{.*}/, ''); //exec is start command, next line substitutes %f etc\r\n                    cmd = replaceStrVars(cmd.slice(0, cmd.indexOf('`')).replace(/%20/mg, ' '));\r\n                    cmdId = 'oneliner'; //command id\r\n                    let url = 'vscode://rmzetti.hover-exec?' + cmdId; //create hover message, declare as trusted, and return it\r\n                    const contents = new vscode.MarkdownString('*hover-exec:* ' + msg + '\\n\\n[' + cmd + '](' + url + ')');\r\n                    contents.isTrusted = true; //set hover links as trusted\r\n                    return new vscode.Hover(contents); //return link string\r\n                }\r\n                else { //create and return hover message & urls for non-built-in commands\r\n                    cmd = replaceStrVars(cmdId);\r\n                    codeBlock = getCodeBlockAt(doc, pos); //save codeblock\r\n                    let url = 'vscode://rmzetti.hover-exec?other'; //+cmdId.replace(/\\s/mg,'%20');\r\n                    msg = '[' + cmd + '](' + url + ')'; //create hover message & url\r\n                    msg = cmdId + ' [ \\[*config*\\] ](' + url + '_config) ' + //add hover info\r\n                        '*[ \\[last script\\] ](' + tempPath + tempName + ')*\\n\\n' + msg;\r\n                    const contents = new vscode.MarkdownString('hover-exec:' + msg);\r\n                    contents.isTrusted = true; //set hover links as trusted\r\n                    return new vscode.Hover(contents); //and return it\r\n                }\r\n            });\r\n        }\r\n    })());\r\n    context.subscriptions.push(vscode.commands.registerCommand(\"hover-exec.exec\", () => {\r\n        //preocess exec command (suggested shortcut Alt+/ ) -- find start of block and execute\r\n        let editor = vscode.window.activeTextEditor;\r\n        if (editor) {\r\n            let doc = editor.document; //get document\r\n            let pos = editor.selection.active; //and position\r\n            cursLine = pos.line;\r\n            cursChar = pos.character; //when command was executed\r\n            let n = getStartOfBlock(doc, pos); //get start of codeblock\r\n            if (n < 0) {\r\n                return null;\r\n            } //if not in codeblock ignore\r\n            pos = new vscode.Position(n, 0); //set position at start of block\r\n            let line = doc.lineAt(pos); //get command line contents\r\n            if (executing) {\r\n                hUri.handleUri(vscode.Uri.parse('vscode://rmzetti.hover-exec?abort'));\r\n                progress1('previous exec aborted', 500);\r\n                return; //if processing cancel job and ignore\r\n            }\r\n            setExecParams(context, doc, pos, line); //reset basic execute parameters\r\n            let url = '';\r\n            let cmd1 = cmdId.replace(/\\s.*/, ''); //check for predefined commands (nothing after a space)\r\n            let script = config.get('scripts.' + cmd1); //json object if cmd1 is a 'built-in' script\r\n            //let script=config.get(cmd1);    //array of strings (prev) if cmd1 is a 'built-in' script\r\n            if (script) { //predefined script engine strings\r\n                cmdId = cmd1;\r\n                getScriptSettings(script); //get predefined command strings (& expand %f etc)\r\n                if (!script) {\r\n                    return null;\r\n                } //redirect (script.alt) didn't work\r\n                codeBlock = getCodeBlockAt(doc, pos); //save codeblock\r\n                url = 'vscode://rmzetti.hover-exec?' + cmdId; //url as for hover-execute\r\n            }\r\n            else if (cmdId === 'output') {\r\n                deleteOutput(false); //cursor in output block: delete the block\r\n                return;\r\n            }\r\n            else if (oneLiner) {\r\n                cmd = line.text.slice(1).replace(/{.*}/, ''); //remove {..} exec is start command, next line substitutes %f etc\r\n                cmd = replaceStrVars(cmd.slice(0, cmd.indexOf('`')).replace(/%20/mg, ' '));\r\n                cmdId = 'oneliner'; //set command for exec by hUri.handleUri\r\n                url = 'vscode://rmzetti.hover-exec?oneLiner';\r\n            }\r\n            else { //other commands and one-liners\r\n                line = doc.lineAt(cursLine); //get line where command was executed  \r\n                cmd = replaceStrVars(cmdId);\r\n                codeBlock = getCodeBlockAt(doc, pos); //save codeblock\r\n                url = 'vscode://rmzetti.hover-exec?ex'; //using url enables re-use of hover-execute code\r\n            }\r\n            hUri.handleUri(vscode.Uri.parse(url)); //execute codeblock via url\r\n        }\r\n    }));\r\n    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {\r\n        config = vscode.workspace.getConfiguration('hover-exec'); //update config if changed\r\n    }));\r\n    context.subscriptions.push(vscode.window.registerUriHandler(hUri));\r\n} //end function activate\r\nexports.activate = activate;\r\nlet hUri = new class MyUriHandler {\r\n    //handle hover exec commands (command is in uri.query)\r\n    handleUri(uri) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            nexec += 1; //script exec number for check to ensure output is from latest script\r\n            if (uri.query === 'abort') { //cancel has been clicked, kill executing task\r\n                executing = false;\r\n                ch.kill();\r\n                return;\r\n            }\r\n            if (uri.query === 'delete') {\r\n                deleteOutput(false); //delete output codeblock\r\n                return;\r\n            }\r\n            if (uri.query === 'remove') {\r\n                deleteOutput(true); //change output codeblock to text\r\n                return;\r\n            }\r\n            if (uri.query === 'ref') {\r\n                needSwap = false;\r\n                paste(refStr); //paste into editor\r\n                removeSelection();\r\n                return;\r\n            }\r\n            if (uri.query.endsWith('_config')) {\r\n                //show current script config in a script that can update it if required\r\n                let s1 = uri.query.slice(0, uri.query.indexOf('_config'));\r\n                let s2 = \"\";\r\n                if (config.get('scripts.' + s1)) {\r\n                    s2 = JSON.stringify(config.get('scripts.' + s1)); //stringify for output\r\n                }\r\n                else {\r\n                    s2 = '{\"cmd\":\"change_this_sample! \\\\\"%f\\\\\" \"}';\r\n                }\r\n                out = '```js :eval noInline\\n' + //output :eval is an exec script which will:\r\n                    'let s={\"' + s1 + '\":' + s2 + '};\\n' + //1. show current config, or an example\r\n                    '//let s={\"' + s1 + '\":undefined}; //will undefine ' + s1 + ' completely\\n' +\r\n                    \"let scripts=config.get('scripts');\\n\" + //2. get current settings for all scripts\r\n                    \"let merge=Object.assign({},scripts,s)\\n\" + //3. update settings for current script\r\n                    \"if(config.update('scripts',merge,1)){}\"; //4. finally update hover-exec config. \r\n                needSwap = false; //ignore anything that looks like it is a swap\r\n                paste(out); //paste into editor as 'output :exec' script\r\n                removeSelection();\r\n                return;\r\n            }\r\n            let sCode = codeBlock;\r\n            needSwap = inline && codeBlock.includes(swap);\r\n            if (needSwap) {\r\n                let re = new RegExp('(.+' + swap + ').*', 'mg'); //regex finds previous results\r\n                codeBlock = codeBlock.replace(re, '$1'); //remove them\r\n                re = new RegExp('[-#%/ ]*' + swap, 'mg'); //find any comment chars preceding the swap\r\n                sCode = codeBlock.replace(re, swap); //remove them\r\n                re = new RegExp('^(.+)' + swap, 'mg'); //regex finds swap lines, sets $1 to expr\r\n                sCode = sCode.replace(re, swapExp); //replace all with swapExp (uses $1)\r\n            }\r\n            vscode.window.withProgress({\r\n                location: vscode.ProgressLocation.Window,\r\n                title: 'Hover-exec' //title for progress display\r\n            }, (progress) => __awaiter(this, void 0, void 0, function* () {\r\n                executing = true; //set 'executing' flag\r\n                let iexec = nexec; //& save exec number for this script\r\n                out = ''; //reset output buffer\r\n                progress.report({ message: 'executing' }); //start execution indicator\r\n                writeFile(tempPath + tempName, cd + sCode); //saves code in temp file for execution\r\n                process.chdir(currentFsPath);\r\n                if (cmdId !== '') {\r\n                    if (cmd === '') { //eval: use vscode internal js\r\n                        sCode = sCode.replace(/console.log/g, 'write'); //provide a console.log for eval\r\n                        eval(sCode); //execute codeblock with eval\r\n                    }\r\n                    else if (cmdId === 'oneliner') { //execute one-liner\r\n                        yield execShell(cmd); //cmd is one-liner\r\n                        executing = false; //exec complete  \r\n                        return; //one-liners do not produce output\r\n                    }\r\n                    else { // getCmdId\r\n                        out = yield execShell(cmd); //execute all other commands\r\n                        if (cmdId === 'buddvs') {\r\n                            out = out.replace(/�/g, 'î');\r\n                        } //for test scripter\r\n                    }\r\n                }\r\n                else {\r\n                    out = uri.toString(); //no ex, return uri\r\n                }\r\n                executing = false; //execution finished\r\n                //output to both output file and editor\r\n                //todo: {output=none} option to output only to file\r\n                if (iexec === nexec) { //only output if this is the latest result\r\n                    writeFile(tempPath + tempName + '.out.txt', out); //write to output file\r\n                    out = out.replace(/\\[object Promise\\]\\n*/g, ''); //remove in editor output\r\n                    if (out !== '') {\r\n                        paste(out); //paste into editor\r\n                        removeSelection(); //deselect\r\n                    }\r\n                    progress1('ok', 500); //report successful completion\r\n                    //todo: silence this with {quiet} option\r\n                }\r\n                ;\r\n            }));\r\n        });\r\n    }\r\n}; //end hUri=new class MyUriHandler\r\nfunction setExecParams(context, doc, pos, line) {\r\n    currentFile = doc.uri.path; //current editor file full path /c:...\r\n    currentFsFile = doc.uri.fsPath; //os specific currentFile c:\\...  (%e)\r\n    windows = currentFsFile.slice(1, 2) === ':'; //true if os is windows\r\n    if (vscode.workspace.workspaceFolders) {\r\n        currentPath = vscode.workspace.workspaceFolders[0].uri.path + '/';\r\n        currentFsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;\r\n        if (windows) {\r\n            currentFsPath += '\\\\';\r\n        }\r\n        else {\r\n            currentFsPath += '/';\r\n        }\r\n    }\r\n    else {\r\n        alert('workspace undefined');\r\n    }\r\n    vscode.workspace.fs.createDirectory(context.globalStorageUri); //create temp folder if necessary\r\n    cd = '';\r\n    cmd = ''; //reset code default start line\r\n    startCode = pos.line; //save start of code line number\r\n    tempName = 'temp.txt'; //temporary file name, can be used as (%n)\r\n    tempPath = context.globalStorageUri.path + '/'; //temp folder path\r\n    tempFsPath = context.globalStorageUri.fsPath; //temp folder path, %p\r\n    if (windows) {\r\n        tempFsPath += '\\\\';\r\n    }\r\n    else {\r\n        tempFsPath += '/';\r\n    }\r\n    swapExp = ''; //default is empty string\r\n    needSwap = false; //set true if in-line swaps required\r\n    cmdId = getCmdId(line.text); //command id, performs {...} changes\r\n} //end function setExecParams\r\nfunction paste(text) {\r\n    const { activeTextEditor } = vscode.window;\r\n    if (activeTextEditor && startCode > 0) {\r\n        //remove 'object promise' messages in editor\r\n        //if(cmdId==='eval'){text=text.replace(/\\[object Promise\\]/g,'');}\r\n        if (needSwap) { //if doing in-line output\r\n            let re1 = new RegExp(swap + '$', 'm'); //indicator for any remaining swap string\r\n            if (re1.test(codeBlock)) { //if there are any swap getScriptSettings\r\n                //copy in-line results into the codeblock\r\n                let re = new RegExp('{{.*}}\\r?\\n', ''); //regex to remove swapped output line was ('^.*{{.*}}$','m')\r\n                while (re1.test(codeBlock)) { //while there is a swap string to replace\r\n                    let i = text.indexOf('{{') + 2; //find the start and\r\n                    let j = text.indexOf('}}\\r'); //end of the next swappable {{output}}\r\n                    if (j < 0) {\r\n                        j = text.indexOf('}}\\n');\r\n                    } //allow for \\n, \\r & \\r\\n eols\r\n                    if (i > 0 && j >= i) { //if inded there is a swappable line\r\n                        let s = text.substring(i, j).replace(/\\r?\\n/, ' '); //remove newlines in in-line results\r\n                        if (s === '') {\r\n                            s = ';';\r\n                        } //if the remainder is empty just provide ;\r\n                        codeBlock = codeBlock.replace(swap + '\\n', swap + s + '\\n'); //do the swap\r\n                        text = text.replace(re, ''); //remove the swapped output to clear for the next\r\n                    }\r\n                    else {\r\n                        break;\r\n                    } //break when done\r\n                }\r\n            }\r\n        }\r\n        text = text.replace(/^\\s*[\\r\\n]/, '').trimEnd(); //remove start blank line if any\r\n        text = text.replace(/^```/mg, ' ```'); //put a space in front of starting ```\r\n        //if there is any output left, it will go into an ```output codeblock\r\n        activeTextEditor.edit((selText) => {\r\n            selectCodeblock(); //select codeblock to replace\r\n            let lbl = \"```output\\n\"; //can start output with ``` to replace ```output\r\n            if (text.startsWith(' ```')) {\r\n                text = text.slice(1);\r\n                lbl = '';\r\n            }\r\n            if (text === '') { //no more output\r\n                if (needSwap) {\r\n                    selText.replace(replaceSel, codeBlock + \"```\\n\");\r\n                }\r\n            }\r\n            else if (oneLiner || !needSwap) { //only producing an output block\r\n                selText.replace(replaceSel, lbl + text + \"\\n```\\n\");\r\n            }\r\n            else { //replace the codeblock text/output (ie. codeblock includes inline results)\r\n                selText.replace(replaceSel, codeBlock + \"```\\n\" + lbl + text + \"\\n```\\n\");\r\n            }\r\n        });\r\n    }\r\n} //end function paste\r\nfunction write() {\r\n    for (var i = 0; i < arguments.length; i++) {\r\n        if (i > 0) {\r\n            out += ' ';\r\n        }\r\n        out += arguments[i];\r\n    }\r\n    out += '\\n';\r\n}\r\nfunction getCmdId(s) {\r\n    inline = !s.toLowerCase().includes('noinline'); //allows normal use of =>>\r\n    if (s.includes('temp=')) { //allow specification of the temp file name, eg {temp=temp.py}\r\n        tempName = s.slice(s.indexOf('temp=') + 5)\r\n            .replace(/(.*?)[, }].*/, '$1') //get chars until space, comma or }\r\n            .replace(/[\"']/g, ''); //remove quotes\r\n    }\r\n    if (oneLiner) {\r\n        s = s.replace(/^`(.*?)`.*/, '$1');\r\n    } //get backtick content\r\n    else {\r\n        s = s.slice(3);\r\n    } //or remove initial triple backtick\r\n    //first check for switched cmdId (leave s for later)\r\n    let s1 = s.replace(/\\s+/, ' ') // collapse spaces\r\n        .replace(/\\s(?!:).*/, ''); // remove \\s(not followed by :).*\r\n    if (s1.includes(':')) { //check for command id switch, eg. ```js:eval\r\n        s1 = s1.slice(s1.indexOf(':') + 1)\r\n            .replace(/.*?\\W.*/, '');\r\n        if (s1 !== '' && config.get('scripts.' + s1)) {\r\n            return s1; //if it is a switched id, return it\r\n        }\r\n    }\r\n    //back to s\r\n    let ipos = posComment(s); //find comment in cmd line (std 2ch comment formats)\r\n    if (ipos > 0) {\r\n        s = s.slice(0, ipos);\r\n    } //and remove it\r\n    cmdId = s.replace(/{.*}/, '').trim(); //return trimmed line as command\r\n    return cmdId;\r\n} //end function getCmdId\r\nfunction getmsg(s) {\r\n    let msg = '';\r\n    if (oneLiner) {\r\n        s = s.slice(1).replace(/.*`/, '');\r\n    } //oneliners use single backticks\r\n    else {\r\n        s = s.slice(3).replace(/.*```/, '');\r\n    } //remove triple backticks\r\n    let ipos = posComment(s); //find comment in command line\r\n    if (ipos > 0) {\r\n        msg = ' ' + s.slice(ipos);\r\n    } //use comments in hover message\r\n    for (i = msg.length; i < 12; i++) {\r\n        msg += '&emsp;';\r\n    }\r\n    return msg;\r\n}\r\nfunction posComment(s) {\r\n    let ipos = s.indexOf('\x3c!--'); //using any of these 'standard' comment indicators\r\n    if (ipos <= 0) {\r\n        ipos = s.indexOf('--');\r\n    }\r\n    if (ipos <= 0) {\r\n        ipos = s.indexOf('//');\r\n    }\r\n    if (ipos <= 0) {\r\n        ipos = s.indexOf('%%');\r\n    }\r\n    if (ipos <= 0) {\r\n        ipos = s.indexOf('##');\r\n    }\r\n    return ipos;\r\n}\r\nfunction getScriptSettings(script) {\r\n    if (script.alt) { //allow redirection of command\r\n        script = config.get('scripts.' + script.alt); //redirect\r\n        if (!script || script.alt) { //but only once\r\n            return undefined;\r\n        }\r\n    }\r\n    if (script.tempf) {\r\n        tempName = script.tempf;\r\n    } //temp file name to use\r\n    if (script.cmd) {\r\n        cmd = replaceStrVars(script.cmd);\r\n    } //js command to execute script processor\r\n    if (script.start) {\r\n        cd = replaceStrVars(script.start);\r\n    }\r\n    ; //script default start line, if needed\r\n    if (cd !== '') {\r\n        cd += '\\n';\r\n    } //if start line used, terminate line\r\n    if (script.swap) {\r\n        swapExp = script.swap;\r\n    } // {{ put double curly brackets round line result, $1 }}\r\n}\r\nfunction replaceStrVars(s) {\r\n    return s.replace(/\\/%f/g, tempPath + tempName) // /%f switches to /\r\n        .replace(/\\/%p/g, tempPath) // /%p switches to /\r\n        .replace(/\\/%c/g, currentPath) // /%c switches to /\r\n        .replace(/\\/%e/g, currentFile) // /%e switches to /\r\n        .replace(/%f/g, tempFsPath + tempName) //%f temp file path/name\r\n        .replace(/%p/g, tempFsPath) //%p temp folder path\r\n        .replace(/%c/g, currentFsPath) //%c current file path\r\n        .replace(/%e/g, currentFsFile) //%e current file path/name\r\n        .replace(/%n/g, tempName); //%n temp file name only\r\n}\r\nfunction removeSelection() {\r\n    const { activeTextEditor } = vscode.window;\r\n    if (activeTextEditor) {\r\n        if (cursLine === 0) {\r\n            replaceSel = new vscode.Selection(startCode, 0, startCode, 0);\r\n        }\r\n        else {\r\n            replaceSel = new vscode.Selection(cursLine, cursChar, cursLine, cursChar);\r\n        }\r\n        activeTextEditor.selection = replaceSel;\r\n    }\r\n}\r\nconst execShell = (cmd) => //execute shell command (to start scripts) \r\n new Promise((resolve, reject) => {\r\n    //alert('execshell '+cmd);\r\n    ch = cp.exec(cmd, (err1, out1, stderr1) => {\r\n        if (err1 && stderr1 === '') {\r\n            return resolve(out1 + err1 + ',' + stderr1);\r\n        }\r\n        return resolve(out1 + stderr1);\r\n    });\r\n});\r\nfunction writeFile(file, text) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        yield vscode.workspace.fs.writeFile(vscode.Uri.file(file), Buffer.from(text));\r\n    });\r\n}\r\nfunction getStartOfBlock(//return start of codeblock containing ```, or -1\r\ndoc, pos) {\r\n    let temptxt = doc.lineAt(pos).text;\r\n    oneLiner = !temptxt.startsWith('```') && temptxt.startsWith('`') && temptxt.slice(2).includes('`');\r\n    //oneliner is whole script in single line: uses single backtick at start of line & at end of command\r\n    if (oneLiner || temptxt.startsWith('```') && temptxt.slice(3).trim().length > 0) {\r\n        return pos.line; //if a oneliner or normal start line return line number\r\n    }\r\n    let n = pos.line - 1; //start here and look backwards for start line\r\n    while (n >= 0 && !doc.lineAt(new vscode.Position(n, 0)).text.startsWith('```')) {\r\n        n -= 1;\r\n    }\r\n    if (doc.lineAt(new vscode.Position(n, 0)).text === '```') {\r\n        return -1;\r\n    } //if end line, return -1\r\n    else {\r\n        return n;\r\n    } //normal start line return line number\r\n}\r\nfunction getCodeBlockAt(//return code in code block depending on type\r\ndoc, pos) {\r\n    const { activeTextEditor } = vscode.window;\r\n    let s = '';\r\n    if (activeTextEditor) {\r\n        let n = pos.line + 1;\r\n        if (oneLiner) { //return all after first space up to backtick\r\n            let s1 = doc.lineAt(pos).text.slice(1);\r\n            s1 = replaceStrVars(s1.slice(s1.indexOf(' ') + 1, s1.indexOf('`'))); //.replace(/\\\\/g,'/');\r\n            return s1;\r\n        }\r\n        if (doc.lineAt(pos).text.endsWith('```')) {\r\n            return ''; //return empty string\r\n        }\r\n        while (n < doc.lineCount) {\r\n            let a = doc.lineAt(new vscode.Position(n, 0)).text;\r\n            n++;\r\n            if (a.startsWith('```')) {\r\n                break; //stop at line starting with ```\r\n            }\r\n            else { //add line to code buffer\r\n                s = s + a + '\\n';\r\n            }\r\n        }\r\n    }\r\n    return s;\r\n} //end function getCodeBlockAt\r\nfunction selectCodeblock() {\r\n    const { activeTextEditor } = vscode.window;\r\n    if (activeTextEditor && startCode > 0) {\r\n        const doc = activeTextEditor.document;\r\n        let m = startCode; //selection will be from lines m to n\r\n        if (oneLiner) {\r\n            m++; //oneliner selection begins at 1st line after the command line\r\n            if (m < doc.lineCount && doc.lineAt(new vscode.Position(m, 0)).text.startsWith('```output')) {\r\n                let n = m; //if there is a following output section\r\n                while (n < doc.lineCount) { //find the end of it\r\n                    n++;\r\n                    if (doc.lineAt(new vscode.Position(n, 0)).text.startsWith('```')) {\r\n                        replaceSel = new vscode.Selection(m, 0, n + 1, 0);\r\n                        break;\r\n                    }\r\n                    else if (n === doc.lineCount) {\r\n                        replaceSel = new vscode.Selection(m, 0, n, 0);\r\n                    }\r\n                }\r\n            }\r\n            else {\r\n                replaceSel = new vscode.Selection(m, 0, m, 0);\r\n            }\r\n            activeTextEditor.selection = replaceSel;\r\n        }\r\n        else { //not a one-liner \r\n            let output = doc.lineAt(new vscode.Position(m, 0)).text.startsWith('```output');\r\n            //records when an output line reached\r\n            if (output) { //output block selection starts at command line\r\n                n = m + 1;\r\n            }\r\n            else {\r\n                m += 1;\r\n                n = m; //otherwise at the line after\r\n            }\r\n            while (n < doc.lineCount) { //work through the block and look for end\r\n                if (doc.lineAt(new vscode.Position(n, 0)).text.startsWith('```')) {\r\n                    if (n + 1 < doc.lineCount &&\r\n                        doc.lineAt(new vscode.Position(n + 1, 0)).text.startsWith('```output')) {\r\n                        output = true;\r\n                        n++; //skip output line\r\n                        if (!needSwap) {\r\n                            m = n;\r\n                        }\r\n                    }\r\n                    else { //not an output block start, so it is the end of the block\r\n                        n++; //move to the next line  //if no swap & not output then\r\n                        if (!needSwap && !output) {\r\n                            m = n;\r\n                        } //select pos just after block end\r\n                        break;\r\n                    }\r\n                }\r\n                n++;\r\n            }\r\n            replaceSel = new vscode.Selection(m, 0, n, 0);\r\n            activeTextEditor.selection = replaceSel;\r\n        }\r\n    }\r\n    return;\r\n} //end function selectCodeblock\r\nfunction deleteOutput(asText) {\r\n    const { activeTextEditor } = vscode.window;\r\n    if (activeTextEditor) {\r\n        selectCodeblock();\r\n        if (asText) { //remove start and end lines, ie. with backticks\r\n            let pos1 = activeTextEditor.selection.start.line + 1;\r\n            let pos2 = activeTextEditor.selection.end.line - 1;\r\n            ;\r\n            let sel = new vscode.Selection(pos1, 0, pos2, 0);\r\n            activeTextEditor.edit((selText) => {\r\n                selText.replace(activeTextEditor.selection, activeTextEditor.document.getText(sel));\r\n            });\r\n        }\r\n        else { //remove whole output block\r\n            activeTextEditor.edit((selText) => {\r\n                selText.replace(activeTextEditor.selection, '');\r\n            });\r\n        }\r\n    }\r\n}\r\nfunction deactivate() {\r\n}\r\nexports.deactivate = deactivate;\r\nfunction alert(s) {\r\n    vscode.window.showInformationMessage(s);\r\n}\r\nfunction progress1(msg, timeout) {\r\n    //show a 'progress' pop up for eval scripts, timeout in ms\r\n    if (shown || msg === \"\") {\r\n        return;\r\n    }\r\n    let p = vscode.window.withProgress({\r\n        location: vscode.ProgressLocation.Notification,\r\n        title: \"hover-exec\", cancellable: false\r\n    }, (progress) => {\r\n        shown = true;\r\n        progress.report({ increment: -1, message: msg });\r\n        let p = new Promise(resolve => {\r\n            setTimeout(() => {\r\n                resolve();\r\n                shown = false;\r\n            }, timeout);\r\n        });\r\n        return p;\r\n    });\r\n    return p;\r\n}\r\n\n\n//# sourceURL=webpack://hover-exec/./src/extension.ts?")},129:e=>{e.exports=require("child_process")},549:e=>{e.exports=require("vscode")}},__webpack_module_cache__={};function __webpack_require__(e){var r=__webpack_module_cache__[e];if(void 0!==r)return r.exports;var n=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e].call(n.exports,n,n.exports,__webpack_require__),n.exports}var __webpack_exports__=__webpack_require__(112);module.exports=__webpack_exports__})();