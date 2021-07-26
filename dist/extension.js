/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.deactivate = exports.activate = void 0;\r\nconst vscode = __webpack_require__(1);\r\nconst cp = __webpack_require__(2);\r\nlet lastCodeBlock = \"\";\r\nlet startCode = 0;\r\nlet lastResult = '';\r\nlet swap = '';\r\nlet swapExp = '';\r\nlet suppressOutput = false;\r\nlet tempd = '';\r\nlet temp = '';\r\nlet cd = '';\r\nlet ex = '';\r\nlet exec = '';\r\nlet msg = '';\r\nlet arr;\r\nlet shown = false;\r\nlet currentFolder = '';\r\nlet executing = false;\r\nlet nexec = 0;\r\nlet currentFile = '';\r\nlet oneLiner = false;\r\nlet c;\r\nlet statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);\r\nlet replaceSel = new vscode.Selection(0, 0, 0, 0);\r\nlet config = vscode.workspace.getConfiguration('hover-exec');\r\nconst { activeTextEditor } = vscode.window;\r\nfunction activate(context) {\r\n    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {\r\n        config = vscode.workspace.getConfiguration('hover-exec'); //update config\r\n    }));\r\n    const uriHandler = new MyUriHandler();\r\n    context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));\r\n    context.subscriptions.push(statusBarItem);\r\n    statusBarItem.text = '$(megaphone) hover-exec active';\r\n    vscode.languages.registerHoverProvider('markdown', new (class {\r\n        provideHover(doc, pos, token) {\r\n            return __awaiter(this, void 0, void 0, function* () {\r\n                if (executing) {\r\n                    ex = 'abort';\r\n                    return new vscode.Hover(new vscode.MarkdownString('*hover-exec:* executing...\\n\\n[cancel execution](vscode://rmzetti.hover-exec?abort)'));\r\n                }\r\n                const line = doc.lineAt(pos);\r\n                if (line.text === '```') {\r\n                    return null;\r\n                }\r\n                currentFile = doc.uri.path.substring(1); //%e\r\n                currentFolder = doc.uri.path.substring(1, doc.uri.path.lastIndexOf('/') + 1); //%c\r\n                if (currentFolder.slice(1, 2) !== ':') {\r\n                    currentFolder = fixFolder(currentFolder);\r\n                } //win vs linux\r\n                vscode.workspace.fs.createDirectory(context.globalStorageUri);\r\n                //let selectOnHover=config.get('selectOnHover');\r\n                cd = '';\r\n                startCode = pos.line;\r\n                if (line.text.startsWith('```') && line.text.slice(3, 4) !== ' ') { //character following ``` should not be \\s\r\n                    oneLiner = line.text.slice(3).includes('```');\r\n                    temp = 'temp.txt'; //%n\r\n                    tempd = context.globalStorageUri.fsPath + '/'; //%p\r\n                    //suppressOutput=line.text.endsWith('>');\r\n                    swap = '';\r\n                    swapExp = '';\r\n                    ex = getcmd(line.text); //command id, performs {...} changes\r\n                    msg = getmsg(line.text); //message for hover\r\n                    let ex1 = ex.replace(/\\s.*/, '');\r\n                    arr = config.get(ex1);\r\n                    if (arr) { //predefined script engines\r\n                        ex = ex1;\r\n                        getScriptSettings(currentFolder); //gets exec\r\n                        lastCodeBlock = getCodeBlockAt(doc, pos);\r\n                        //if(selectOnHover){selectCodeblock();}\r\n                        let url = 'vscode://rmzetti.hover-exec?' + ex;\r\n                        if (swap !== '') {\r\n                            msg += '  ... *use ' + swap + ' for inline results*';\r\n                        }\r\n                        msg = '[ ' + ex + msg + '](' + url + ')';\r\n                        msg = '*[ \\[last script\\] ](' + fixFolder(tempd) + temp + ')* ' +\r\n                            '*[ \\[last result\\] ](' + fixFolder(tempd) + temp + '.out.txt)*\\n\\n' + msg;\r\n                        const contents = new vscode.MarkdownString('*hover-exec:* ' + msg);\r\n                        contents.isTrusted = true;\r\n                        return new vscode.Hover(contents);\r\n                    }\r\n                    else if (ex === 'output') {\r\n                        ex = 'delete';\r\n                        //if(selectOnHover){selectCodeblock();}\r\n                        return new vscode.Hover(new vscode.MarkdownString('*hover-exec:*\\n\\n[output to text](vscode://rmzetti.hover-exec?remove)\\n\\n[delete output](vscode://rmzetti.hover-exec?delete)'));\r\n                    }\r\n                    else {\r\n                        if (oneLiner) {\r\n                            exec = line.text.slice(3).replace(/{.*}/, '');\r\n                            exec = replaceStrVars(exec.slice(0, exec.indexOf('```')).replace(/%20/mg, ' '));\r\n                            ex = 'exe';\r\n                            let url = 'vscode://rmzetti.hover-exec?' + ex;\r\n                            const contents = new vscode.MarkdownString('*hover-exec:* ' + msg + '\\n\\n[' + exec + '](' + url + ')');\r\n                            contents.isTrusted = true;\r\n                            return new vscode.Hover(contents);\r\n                        }\r\n                        else {\r\n                            exec = (ex + ' \"' + tempd + temp + '\"').replace(/%20/mg, ' ');\r\n                            lastCodeBlock = getCodeBlockAt(doc, pos);\r\n                            let url = 'vscode://rmzetti.hover-exec?' + ex.replace(/\\s/mg, '%20');\r\n                            msg = '[' + ex + msg + '](' + url + ')';\r\n                            msg = '*[ \\[last script\\] ](' + fixFolder(tempd) + temp + ')*\\n\\n' + msg;\r\n                            const contents = new vscode.MarkdownString('*hover-exec:* ' + msg);\r\n                            contents.isTrusted = true;\r\n                            return new vscode.Hover(contents);\r\n                        }\r\n                    }\r\n                }\r\n                else {\r\n                    return null;\r\n                }\r\n            });\r\n        }\r\n    })());\r\n}\r\nexports.activate = activate;\r\nclass MyUriHandler {\r\n    handleUri(uri) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            nexec += 1;\r\n            if (uri.query === 'abort') {\r\n                executing = false;\r\n                c.kill();\r\n                return;\r\n            }\r\n            if (uri.query === 'delete') {\r\n                deleteOutput(false);\r\n                return;\r\n            }\r\n            if (uri.query === 'remove') {\r\n                deleteOutput(true);\r\n                return;\r\n            }\r\n            if (lastCodeBlock.includes('=>>') || lastCodeBlock.includes('=<<')) {\r\n                lastCodeBlock = lastCodeBlock.replace(/=<</g, '=>>');\r\n                swap = '=>>';\r\n            }\r\n            let s = lastCodeBlock;\r\n            if (swap !== '') {\r\n                let re = new RegExp(swap + '.*', 'mg');\r\n                lastCodeBlock = lastCodeBlock.replace(re, swap); //remove previous in-line results\r\n                re = new RegExp('^(.*)' + swap, 'mg');\r\n                s = lastCodeBlock.replace(re, swapExp);\r\n            }\r\n            vscode.window.withProgress({\r\n                location: vscode.ProgressLocation.Window,\r\n                title: 'Hover-exec'\r\n            }, (progress) => __awaiter(this, void 0, void 0, function* () {\r\n                executing = true;\r\n                let iexec = nexec;\r\n                progress.report({ message: 'executing' });\r\n                writeFile(tempd + temp, cd + s);\r\n                eval('process.chdir(\"' + currentFolder + '\")');\r\n                if (ex !== '') {\r\n                    if (ex === 'eval') {\r\n                        let s1 = s.split(/\\r?\\n/);\r\n                        lastResult = '';\r\n                        s1.forEach((line) => {\r\n                            s = eval(line);\r\n                            if (s) {\r\n                                lastResult += s + '\\n';\r\n                            } //if(s) avoids 'undefined' at end\r\n                        });\r\n                    }\r\n                    else if (ex === 'exe') {\r\n                        yield execShell(exec);\r\n                        executing = false;\r\n                        return;\r\n                    }\r\n                    else {\r\n                        lastResult = yield execShell(exec);\r\n                    }\r\n                    if (ex === 'buddvs') {\r\n                        lastResult = lastResult.replace(/�/g, 'î');\r\n                    }\r\n                }\r\n                else {\r\n                    lastResult = uri.toString();\r\n                }\r\n                //vscode.window.showInformationMessage(''+iexec+'<>'+nexec);\r\n                if (iexec === nexec) {\r\n                    writeFile(tempd + temp + '.out.txt', lastResult);\r\n                    if (lastResult !== '') {\r\n                        if (suppressOutput) {\r\n                            progress1('output cancelled');\r\n                        }\r\n                        else {\r\n                            paste(lastResult);\r\n                        }\r\n                        removeSelection();\r\n                    }\r\n                    executing = false;\r\n                }\r\n                ;\r\n            }));\r\n        });\r\n    }\r\n}\r\nfunction paste(text) {\r\n    const { activeTextEditor } = vscode.window;\r\n    if (activeTextEditor && startCode > 0) {\r\n        if (ex === 'eval') {\r\n            text = text.replace(/\\[object Promise\\]/g, '');\r\n        }\r\n        if (swap !== \"\") {\r\n            let re = new RegExp(swap + '.*', 'mg');\r\n            lastCodeBlock = lastCodeBlock.replace(re, swap); //remove all after swap string\r\n            let re1 = new RegExp(swap + '$', 'm');\r\n            if (re1.test(lastCodeBlock)) {\r\n                //copy intermediate results into the codeblock\r\n                re = new RegExp('^.*{{.*}}$', 'm');\r\n                while (re1.test(lastCodeBlock)) {\r\n                    let i = text.indexOf('{{') + 2, j = text.indexOf('}}\\r');\r\n                    if (j < 0) {\r\n                        j = text.indexOf('}}\\n');\r\n                    } //to allow \\n, \\r & \\r\\n\r\n                    if (i > 0 && j >= i) {\r\n                        let s = text.substring(i, j).replace(/\\r?\\n/, ';'); //remove newlines in intermediate results\r\n                        if (s === '') {\r\n                            s = ';';\r\n                        }\r\n                        lastCodeBlock = lastCodeBlock.replace(swap + '\\n', swap + s + '\\n');\r\n                        text = text.replace(re, '');\r\n                    }\r\n                    else {\r\n                        break;\r\n                    }\r\n                }\r\n            }\r\n        }\r\n        text = text.replace(/^\\s*$/gm, '').trim(); //remove blank lines\r\n        activeTextEditor.edit((selText) => {\r\n            selectCodeblock();\r\n            if (text === '') {\r\n                selText.replace(replaceSel, lastCodeBlock + \"```\\n\");\r\n            }\r\n            else if (oneLiner) {\r\n                selText.replace(replaceSel, \"```output\\n\" + text + \"\\n```\\n\");\r\n            }\r\n            else {\r\n                selText.replace(replaceSel, lastCodeBlock + \"```\\n```output\\n\" + text + \"\\n```\\n\");\r\n            }\r\n        });\r\n    }\r\n}\r\nfunction fixFolder(f) {\r\n    if (f.startsWith('\\\\')) {\r\n        f = f.slice(1);\r\n    }\r\n    if (!f.startsWith('/')) {\r\n        f = '/' + f;\r\n    }\r\n    return f;\r\n}\r\nfunction getcmd(s) {\r\n    if (s.includes('ext=')) {\r\n        temp = 'temp.' + s.replace(/.*ext=(.*?)[\\s\\,\\}].*/, '$1').replace(/[\"']/g, '');\r\n    }\r\n    if (s.includes('cmd=')) {\r\n        return s.replace(/.*cmd=(.*?)[\\s\\,\\}].*/, '$1').replace(/[\"']/g, '');\r\n    }\r\n    s = s.slice(3);\r\n    if (s.startsWith('\"')) { //return quoted bit as command\r\n        return s.slice(1).replace(/\".*/, '');\r\n    }\r\n    s = s.replace(/```.*/, '');\r\n    let ipos = posComment(s);\r\n    if (ipos > 0) {\r\n        s = s.slice(0, ipos);\r\n    }\r\n    ex = s.replace(/{.*}/, '').trim();\r\n    return ex;\r\n}\r\nfunction getmsg(s) {\r\n    //message for hover\r\n    let msg = '';\r\n    s = s.slice(3).replace(/.*```/, '');\r\n    let ipos = posComment(s);\r\n    if (ipos > 0) {\r\n        msg = ' ' + s.substr(ipos);\r\n    }\r\n    return msg;\r\n}\r\nfunction posComment(s) {\r\n    let ipos = s.indexOf('<!--');\r\n    if (ipos <= 0) {\r\n        ipos = s.indexOf('--');\r\n    }\r\n    if (ipos <= 0) {\r\n        ipos = s.indexOf('//');\r\n    }\r\n    if (ipos <= 0) {\r\n        ipos = s.indexOf('#');\r\n    }\r\n    return ipos;\r\n}\r\nfunction getScriptSettings(currentFolder) {\r\n    if (arr.length > 3) {\r\n        temp = arr[3];\r\n    }\r\n    exec = replaceStrVars(arr[0]);\r\n    if (arr.length > 1) {\r\n        cd = replaceStrVars(arr[1]);\r\n        if (cd !== '') {\r\n            cd += '\\n';\r\n        }\r\n    }\r\n    if (arr.length > 2) {\r\n        swap = arr[2].substr(0, 3); // {{ is the start, the end is }}\r\n        swapExp = arr[2].substr(3);\r\n    }\r\n}\r\nfunction replaceStrVars(s) {\r\n    return s.replace(/%f/g, tempd + temp).replace(/%p/g, tempd)\r\n        .replace(/%c/g, currentFolder).replace(/%n/g, temp).replace(/%e/g, currentFile);\r\n}\r\nfunction removeSelection() {\r\n    const { activeTextEditor } = vscode.window;\r\n    if (activeTextEditor) {\r\n        replaceSel = new vscode.Selection(startCode, 0, startCode, 0);\r\n        activeTextEditor.selection = replaceSel;\r\n    }\r\n}\r\nconst execShell = (cmd) => new Promise((resolve, reject) => {\r\n    c = cp.exec(cmd, (err, out) => {\r\n        if (err) {\r\n            return resolve(cmd + ' error!'); //reject(err);\r\n        }\r\n        return resolve(out);\r\n    });\r\n});\r\nfunction writeFile(file, text) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        yield vscode.workspace.fs.writeFile(vscode.Uri.file(file), Buffer.from(text));\r\n    });\r\n}\r\nfunction getCodeBlockAt(doc, pos) {\r\n    const { activeTextEditor } = vscode.window;\r\n    let s = '';\r\n    startCode = 0;\r\n    if (activeTextEditor) {\r\n        let n = doc.lineAt(pos).lineNumber + 1;\r\n        if (oneLiner) {\r\n            let s1 = doc.lineAt(pos).text.slice(3);\r\n            startCode = n;\r\n            s1 = s1.slice(s1.indexOf(' ') + 1, s1.indexOf('```'));\r\n            return replaceStrVars(s1);\r\n        }\r\n        if (doc.lineAt(pos).text.endsWith('```')) {\r\n            startCode = n;\r\n            return '';\r\n        }\r\n        startCode = n;\r\n        while (n < doc.lineCount) {\r\n            let a = doc.lineAt(new vscode.Position(n, 0)).text;\r\n            n++;\r\n            if (a.startsWith('```')) {\r\n                break;\r\n            }\r\n            else {\r\n                s = s + a + '\\n';\r\n            }\r\n        }\r\n    }\r\n    return s;\r\n}\r\nfunction selectCodeblock() {\r\n    const { activeTextEditor } = vscode.window;\r\n    if (activeTextEditor && startCode > 0) {\r\n        const doc = activeTextEditor.document;\r\n        let n = startCode;\r\n        if (oneLiner) {\r\n            n -= 1;\r\n        }\r\n        while (n < doc.lineCount) {\r\n            n++;\r\n            let a = doc.lineAt(new vscode.Position(n, 0)).text;\r\n            if (a.startsWith('```')) {\r\n                n++;\r\n                if (oneLiner && n === startCode + 1 && a === '```output') {\r\n                    //continue past start of output section\r\n                }\r\n                else if (!oneLiner && n < doc.lineCount && doc.lineAt(new vscode.Position(n, 0)).text === '```output') {\r\n                    //continue past start of output section\r\n                }\r\n                else {\r\n                    if (oneLiner && n === startCode + 1) {\r\n                        replaceSel = new vscode.Selection(startCode, 0, n - 1, 0);\r\n                    }\r\n                    else {\r\n                        replaceSel = new vscode.Selection(startCode, 0, n, 0);\r\n                    }\r\n                    activeTextEditor.selection = replaceSel;\r\n                    break;\r\n                }\r\n            }\r\n            else if (oneLiner && n <= startCode) {\r\n                replaceSel = new vscode.Selection(n, 0, n, 0);\r\n                break;\r\n            }\r\n        }\r\n    }\r\n    return;\r\n}\r\nfunction deleteOutput(asText) {\r\n    const { activeTextEditor } = vscode.window;\r\n    if (activeTextEditor) {\r\n        selectCodeblock();\r\n        if (asText) {\r\n            let pos1 = activeTextEditor.selection.start.line + 1;\r\n            let pos2 = activeTextEditor.selection.end.line - 1;\r\n            ;\r\n            let sel = new vscode.Selection(pos1, 0, pos2, 0);\r\n            activeTextEditor.edit((selText) => {\r\n                selText.replace(activeTextEditor.selection, activeTextEditor.document.getText(sel));\r\n            });\r\n        }\r\n        else {\r\n            activeTextEditor.edit((selText) => {\r\n                selText.replace(activeTextEditor.selection, '');\r\n            });\r\n        }\r\n    }\r\n}\r\nfunction deactivate() {\r\n    statusBarItem.hide();\r\n}\r\nexports.deactivate = deactivate;\r\nfunction progress1(msg) {\r\n    if (shown || msg === \"\") {\r\n        return;\r\n    }\r\n    let p = vscode.window.withProgress({\r\n        location: vscode.ProgressLocation.Notification,\r\n        title: \"hover-exec\", cancellable: false\r\n    }, (progress) => {\r\n        shown = true;\r\n        progress.report({ increment: -1, message: msg });\r\n        let p = new Promise(resolve => {\r\n            setTimeout(() => {\r\n                resolve();\r\n                shown = false;\r\n            }, 4000);\r\n        });\r\n        return p;\r\n    });\r\n    return p;\r\n}\r\n\n\n//# sourceURL=webpack://hover-exec/./src/extension.ts?");

/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");;

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("child_process");;

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;