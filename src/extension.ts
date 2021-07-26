
import * as vscode from 'vscode';
import * as cp from "child_process";
import * as fs from "fs";
import { IncomingMessage } from 'http';
let lastCodeBlock="";
let startCode=0;
let lastResult:string='';
let swap='';
let swapExp='';
let suppressOutput=false;
let tempd:string='';
let temp='';
let cd='';
let ex='';
let exec='';
let msg='';
let arr:string;
let shown=false;
let currentFolder='';
let executing=false;
let nexec=0;
let currentFile='';
let oneLiner=false;
let c:cp.ChildProcess;
let statusBarItem=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
let replaceSel=new vscode.Selection(0,0,0,0);
let config=vscode.workspace.getConfiguration('hover-exec');
const {activeTextEditor}=vscode.window;
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		config=vscode.workspace.getConfiguration('hover-exec'); //update config
	}));
	const uriHandler = new MyUriHandler();
	context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));
	context.subscriptions.push(statusBarItem);
	statusBarItem.text = '$(megaphone) hover-exec active';
	vscode.languages.registerHoverProvider(
		'markdown',
		new (class implements vscode.HoverProvider {
		  async provideHover(doc: vscode.TextDocument,
			pos: vscode.Position,token: vscode.CancellationToken
		  ): Promise<vscode.Hover | null> { // <vscode.Hover|null|undefined>
			if(executing){
				ex='abort';
				return new vscode.Hover(new vscode.MarkdownString(
					'*hover-exec:* executing...\n\n[cancel execution](vscode://rmzetti.hover-exec?abort)'
			));}
			const line = doc.lineAt(pos);
			if(line.text==='```'){return null;}
			currentFile=doc.uri.path.substring(1);  //%e
			currentFolder=doc.uri.path.substring(1,doc.uri.path.lastIndexOf('/')+1);  //%c
			if(currentFolder.slice(1,2)!==':'){currentFolder=fixFolder(currentFolder);} //win vs linux
			vscode.workspace.fs.createDirectory(context.globalStorageUri);
			//let selectOnHover=config.get('selectOnHover');
			cd='';
			startCode=pos.line;
			if(line.text.startsWith('```') && line.text.slice(3,4)!==' '){ //character following ``` should not be \s
				oneLiner=line.text.slice(3).includes('```');
				temp='temp.txt';  //%n
				tempd=context.globalStorageUri.fsPath+'/';   //%p
				//suppressOutput=line.text.endsWith('>');
				swap='';swapExp='';
				ex=getcmd(line.text); 		//command id, performs {...} changes
				msg=getmsg(line.text); 	//message for hover
				let ex1=ex.replace(/\s.*/,'');
				arr=config.get(ex1) as string;
				if(arr){  //predefined script engines
					ex=ex1;
					getScriptSettings(currentFolder); //gets exec
					lastCodeBlock=getCodeBlockAt(doc,pos);
					//if(selectOnHover){selectCodeblock();}
					let url='vscode://rmzetti.hover-exec?'+ex;
					if(swap!==''){ msg+='  ... *use '+swap+' for inline results*'; }
					msg='[ '+ex+msg+']('+url+')';
					msg='*[ \[last script\] ]('+fixFolder(tempd)+temp+')* '+
					'*[ \[last result\] ]('+fixFolder(tempd)+temp+'.out.txt)*\n\n'+msg;
					const contents=new vscode.MarkdownString('*hover-exec:* '+msg);
					contents.isTrusted = true;
					return new vscode.Hover(contents);
				} else if(ex==='output'){
					ex='delete';
					//if(selectOnHover){selectCodeblock();}
					return new vscode.Hover(new vscode.MarkdownString(
						'*hover-exec:*\n\n[output to text](vscode://rmzetti.hover-exec?remove)\n\n[delete output](vscode://rmzetti.hover-exec?delete)'
					));
				} else {
					if(oneLiner){
						exec=line.text.slice(3).replace(/{.*}/,'');
						exec=replaceStrVars(exec.slice(0,exec.indexOf('```')).replace(/%20/mg,' '));
						ex='exe';
						let url='vscode://rmzetti.hover-exec?'+ex;
						const contents = new vscode.MarkdownString('*hover-exec:* '+msg+'\n\n['+exec+']('+url+')');
						contents.isTrusted = true;
						return new vscode.Hover(contents);
					} else {
						exec=(ex+' "'+tempd+temp+'"').replace(/%20/mg,' ');
						lastCodeBlock=getCodeBlockAt(doc,pos);
						let url='vscode://rmzetti.hover-exec?'+ex.replace(/\s/mg,'%20');
						msg='['+ex+msg+']('+url+')';
						msg='*[ \[last script\] ]('+fixFolder(tempd)+temp+')*\n\n'+msg;
						const contents=new vscode.MarkdownString('*hover-exec:* '+msg);
						contents.isTrusted = true;
						return new vscode.Hover(contents);
					}
				}
			}
			else { 
				return null;
			}
		}})()
	);
}
class MyUriHandler implements vscode.UriHandler {
	async handleUri(uri: vscode.Uri): Promise<void | null | undefined> {
		nexec+=1;
		if (uri.query==='abort'){
			executing=false;
			c.kill();
			return; 
		}
		if (uri.query==='delete'){ deleteOutput(false);return; }
		if (uri.query==='remove'){ deleteOutput(true);return; }
		if(lastCodeBlock.includes('=>>')||lastCodeBlock.includes('=<<')){
			lastCodeBlock=lastCodeBlock.replace(/=<</g,'=>>');
			swap='=>>';
		}
		let s=lastCodeBlock;
		if(swap!==''){
			let re=new RegExp(swap+'.*','mg');
			lastCodeBlock=lastCodeBlock.replace(re,swap); //remove previous in-line results
			re=new RegExp('^(.*)'+swap,'mg');
			s=lastCodeBlock.replace(re,swapExp);
		}
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Window,
			title: 'Hover-exec'
		},
	    async progress =>{
			executing=true;
			let iexec=nexec;
			progress.report({message: 'executing'});
			writeFile(tempd+temp,cd+s);
			eval('process.chdir("'+currentFolder+'")');
			if(ex!==''){
				if (ex==='eval'){
					let s1=s.split(/\r?\n/);
					lastResult='';
					s1.forEach((line)=>{
						s=eval(line);
						if(s){lastResult+=s+'\n';} //if(s) avoids 'undefined' at end
					});
				}
				else if(ex==='exe'){
					await execShell(exec);
					executing=false;
					return;
				}
				else {
						lastResult = await execShell(exec);
				}
				if (ex==='buddvs'){lastResult=lastResult.replace(/�/g,'î');	}
			} else {
				lastResult=uri.toString();
			}
			//vscode.window.showInformationMessage(''+iexec+'<>'+nexec);
			if(iexec===nexec){
				writeFile(tempd+temp+'.out.txt',lastResult);
				if(lastResult!==''){
					if(suppressOutput){
						progress1('output cancelled');
					} else {
						paste(lastResult);
					}
					removeSelection();
					}
				executing=false;
			};
		});
	}
}
function paste(text:string) {
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor && startCode>0){
		if(ex==='eval'){text=text.replace(/\[object Promise\]/g,'');}
		if(swap!==""){
			let re=new RegExp(swap+'.*','mg');
			lastCodeBlock=lastCodeBlock.replace(re,swap); //remove all after swap string
			let re1=new RegExp(swap+'$','m');
			if(re1.test(lastCodeBlock)){
				//copy intermediate results into the codeblock
				re=new RegExp('^.*{{.*}}$','m');
				while(re1.test(lastCodeBlock)){
					let i=text.indexOf('{{')+2, j=text.indexOf('}}\r');
					if(j<0){j=text.indexOf('}}\n');} //to allow \n, \r & \r\n
					if (i>0 && j>=i){
						let s=text.substring(i,j).replace(/\r?\n/,';'); //remove newlines in intermediate results
						if(s===''){s=';';}
						lastCodeBlock=lastCodeBlock.replace(swap+'\n',swap+s+'\n');
						text=text.replace(re,'');
					} else {break;}
		}}}
		text=text.replace(/^\s*$/gm,'').trim(); //remove blank lines
		activeTextEditor.edit((selText)=>{
			selectCodeblock();
			if(text===''){
				selText.replace(replaceSel,lastCodeBlock+"```\n");
			} else if(oneLiner){
				selText.replace(replaceSel,"```output\n"+text+"\n```\n");
			} else {
				selText.replace(replaceSel,lastCodeBlock+"```\n```output\n"+text+"\n```\n");
			}
		});
	}
}
function fixFolder(f:string){
	if(f.startsWith('\\')){f=f.slice(1);}
	if(!f.startsWith('/')){f='/'+f;}
	return f;
}
function getcmd(s:string){
	if(s.includes('ext=')){
		temp='temp.'+s.replace(/.*ext=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'');
	}
	if(s.includes('cmd=')){
		return s.replace(/.*cmd=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'');
	}
	s=s.slice(3);
	if(s.startsWith('"')){   //return quoted bit as command
		return s.slice(1).replace(/".*/,'');
	}
	s=s.replace(/```.*/,'');
	let ipos=posComment(s);
	if(ipos>0){s=s.slice(0,ipos);}
	ex=s.replace(/{.*}/,'').trim();
	return ex;
}
function getmsg(s:string){
	//message for hover
	let msg='';
	s=s.slice(3).replace(/.*```/,'');
	let ipos=posComment(s);
	if(ipos>0){msg=' '+s.substr(ipos);}
	return msg;
}
function posComment(s:string){
	let ipos=s.indexOf('<!--');
	if(ipos<=0){ipos=s.indexOf('--');}
	if(ipos<=0){ipos=s.indexOf('//');}
	if(ipos<=0){ipos=s.indexOf('#');}
	return ipos;
}
function getScriptSettings(currentFolder:string){
	if(arr.length>3){temp=arr[3];}
	exec=replaceStrVars(arr[0]);
	if(arr.length>1){
		cd=replaceStrVars(arr[1]);
		if(cd!==''){cd+='\n';}
	}
	if(arr.length>2){
		swap=arr[2].substr(0,3);      // {{ is the start, the end is }}
		swapExp=arr[2].substr(3);
	}
}
function replaceStrVars(s:string){
	return s.replace(/%f/g,tempd+temp).replace(/%p/g,tempd)
	.replace(/%c/g,currentFolder).replace(/%n/g,temp).replace(/%e/g,currentFile);
}
function removeSelection(){
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor){
		replaceSel=new vscode.Selection(startCode,0,startCode,0);
		activeTextEditor.selection=replaceSel;
	}
}
const execShell = (cmd: string) =>
	new Promise<string>((resolve, reject) => {
		c=cp.exec(cmd, (err, out) => {
			if (err) {
				return resolve(cmd+' error!'); //reject(err);
			}
			return resolve(out);
		});}
);
async function writeFile(file:string,text:string) {
	await vscode.workspace.fs.writeFile(vscode.Uri.file(file), Buffer.from(text));
}
function getCodeBlockAt(doc: vscode.TextDocument,pos: vscode.Position) {
	const {activeTextEditor}=vscode.window;
	let s='';
	startCode=0;
	if(activeTextEditor){
		let n=doc.lineAt(pos).lineNumber+1;
		if(oneLiner){
			let s1=doc.lineAt(pos).text.slice(3);
			startCode=n;
			s1=s1.slice(s1.indexOf(' ')+1,s1.indexOf('```'));
			return replaceStrVars(s1);
		}
		if(doc.lineAt(pos).text.endsWith('```')) {
			startCode=n;return '';
		}
		startCode=n;
		while (n<doc.lineCount) {
			let a=doc.lineAt(new vscode.Position(n,0)).text;
			n++;
			if(a.startsWith('```')){
				break;
			} else {
				s=s+a+'\n';
			}
		}
	}
	return s;
}
function selectCodeblock(){
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor && startCode>0){
		const doc=activeTextEditor.document;
		let n=startCode;
		if(oneLiner){n-=1;}
		while (n<doc.lineCount) {
			n++;
			let a=doc.lineAt(new vscode.Position(n,0)).text;
			if(a.startsWith('```')){
				n++;
				if(oneLiner && n===startCode+1 && a==='```output'){
					//continue past start of output section
				} else if(!oneLiner && n<doc.lineCount && doc.lineAt(new vscode.Position(n,0)).text==='```output'){
					//continue past start of output section
				} else {
					if(oneLiner && n===startCode+1){
						replaceSel=new vscode.Selection(startCode,0,n-1,0);
					} else {
						replaceSel=new vscode.Selection(startCode,0,n,0);
					}
					activeTextEditor.selection=replaceSel;
					break;
				}
			} else if(oneLiner && n<=startCode){
				replaceSel=new vscode.Selection(n,0,n,0);
				break;
			}
		}
	}
	return;
}
function deleteOutput(asText:boolean) {
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor){
		selectCodeblock();
		if(asText){
			let pos1=activeTextEditor.selection.start.line+1;
			let pos2=activeTextEditor.selection.end.line-1;;
			let sel=new vscode.Selection(pos1,0,pos2,0);
			activeTextEditor.edit((selText)=>{ 
				selText.replace(activeTextEditor.selection,activeTextEditor.document.getText(sel));
			});
		} 
		else {
			activeTextEditor.edit((selText)=>{
				selText.replace(activeTextEditor.selection,'');
			});
		}
	}
}
export function deactivate() {
	statusBarItem.hide();
}

function progress1(msg:string){
	if(shown || msg===""){return;}
	let p=vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "hover-exec",cancellable: false
	}, (progress) => {
		shown=true;
		progress.report({ increment: -1,message:msg });
		let p = new Promise<void>(resolve => {
			setTimeout(() => {
				resolve();shown=false;
			}, 4000);
		});
		return p;
	});
	return p;
}
