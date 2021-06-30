import * as vscode from 'vscode';
import * as cp from "child_process";
import * as fs from "fs";
let lastCodeBlock="";
let startCode=0;
let lastResult:string='';
let swapExp='$1=>>';
let suppressOutput=false;
let tempd:string='';;
let temp='';
let cd='';
let ex='';
let exec='';
let arr:string;
let config=vscode.workspace.getConfiguration('hover-exec');
const {activeTextEditor}=vscode.window;
export function activate(context: vscode.ExtensionContext) {
	const uriHandler = new MyUriHandler();
	context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));
	vscode.languages.registerHoverProvider(
		'markdown',
		new (class implements vscode.HoverProvider {
		  async provideHover(doc: vscode.TextDocument,
			pos: vscode.Position,token: vscode.CancellationToken
		  ): Promise<vscode.Hover | null> { // <vscode.Hover|null|undefined>
			const line = doc.lineAt(pos);
			let currentFolder=doc.uri.path.substring(1,doc.uri.path.lastIndexOf('/')+1); //nb. used in eval(arr[1])
			vscode.workspace.fs.createDirectory(context.globalStorageUri);
			let selectOnHover=config.get('selectOnHover');
			cd='';
			startCode=pos.line;
			if(line.text.startsWith('```')){
				tempd=context.globalStorageUri.fsPath;
				suppressOutput=line.text.endsWith('>');
				swapExp='$1=>>';
				ex=getcmd(line.text); //command id
				arr=config.get(ex) as string;
				let msg=getmsg(line.text); //message for hover
				if(arr && arr.length>=3){
					temp=tempd+'/temp.txt';
					if(arr.length>=4){temp=tempd+'/'+arr[3];}
					exec=eval(arr[0]);cd=eval(arr[1]);swapExp=arr[2];
					lastCodeBlock=getCodeBlockAt(doc,pos);
					if(selectOnHover){selectOutputCodeblock();}
					let url='vscode://rmzetti.hover-exec?'+ex; //rmzetti.hover-exec is publisher.extensionName
					if (msg!=='') { msg='['+ex+' '+msg+']('+url+')';} 
					else { msg='[exec '+ex+']('+url+')';}
					const contents=new vscode.MarkdownString('*hover exec:*\n\n'+msg);
					contents.isTrusted = true;
					return new vscode.Hover(contents);
				} else if(ex==='output'){
					ex='delete';
					if(selectOnHover){selectOutputCodeblock();}
					return new vscode.Hover(new vscode.MarkdownString(
						'*hover exec:*\n\n[delete output](vscode://rmzetti.hover-exec?delete)'
					));
				} else {
					ex='';
					if(temp===''){return null;}
					let temp1=temp.replace(/\s/g,'%20').replace(/\\/g,'/');
					return new vscode.Hover(new vscode.MarkdownString(
						'*hover exec:*\n\n'+
						'[ open last script executed ]('+'file:///'+temp1+')\n\n'+
						'[ open last result ]('+'file:///'+temp1+'.out.txt)'
					));
				}
			}
			else {
				let fileUri=vscode.Uri.file(line.text.trim()); //can have internal spaces
				if(fileUri){
					try {
						await vscode.workspace.fs.stat(fileUri);
						let temp1=line.text.trim().replace(/\s/g,'%20'); 
						const contents = //markdown link must use %20
							new vscode.MarkdownString('[open](file:///'+temp1+')');
						contents.isTrusted = true;
						return new vscode.Hover(contents);
					} catch {
						return null;
					} 
				} else {
					return null;
				}
		}
		}})()
	);
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		config=vscode.workspace.getConfiguration('hover-exec'); //update config
	}));
}
class MyUriHandler implements vscode.UriHandler {
	async handleUri(uri: vscode.Uri): Promise<void | null | undefined> {
		if (uri.query==='delete'){ deleteOutput();return; }
		if(!suppressOutput){selectOutputCodeblock();}
		lastCodeBlock=lastCodeBlock.replace(/=<<[\s\S]*?>>/g,'=>>'); //remove previous in-line results
		//let regExp = new RegExp(myString);text.replace(regExp, ''); //use when regex is a string
		writeFile(temp,cd+lastCodeBlock.replace(/^(.*)=>>/mg,swapExp));
		if(ex!==''){
			lastResult = await execShell(exec);
			if (ex==='buddvs'){lastResult=lastResult.replace(/�/g,'î');	}
		} else {
			lastResult=uri.toString();
		}
		writeFile(temp+'.out.txt',lastResult);
		if( !suppressOutput ){paste(lastResult);}
		removeSelection();
	}
}
function getcmd(s:string){
	let len=s.indexOf(" ");
	if(len<0){len=s.length;}
	ex="";
	if(s.includes('cmd=')){
		ex=s.substr(s.indexOf('cmd=')+4).replace(/["']/g,'').trim();
		let ipos=ex.indexOf('}');
		if(ipos<=0){ex="";}
		else {
			if(ex.indexOf(" ")>0 && ex.indexOf(" ")<ipos){ipos=ex.indexOf(" ");}
			if(ex.indexOf(",")>0 && ex.indexOf(",")<ipos){ipos=ex.indexOf(",");}
			ex=ex.substring(0,ipos).trim();
		}
	}
	if(ex===''){
		ex=s.replace(/.*\{(.*)\}.*/,'$1');
		ex=s.substring(3,len);
	}
	//vscode.window.showInformationMessage(ex);
	return ex;
}
function getmsg(s:string){
	//message for hover
	let msg='';
	let ipos=s.indexOf('--');
	if(ipos<=0){ipos=s.indexOf('<!--')-2;}
	if(ipos<=0){ipos=s.indexOf('//');}
	if(ipos>0){msg=s.substr(ipos+2);}
	return msg;
}
function removeSelection(){
	if(activeTextEditor){
		activeTextEditor.selection=new vscode.Selection(startCode,0,startCode,0);
	}
}
const execShell = (cmd: string) =>
	new Promise<string>((resolve, reject) => {
		cp.exec(cmd, (err, out) => {
			if (err) {
				return resolve(cmd+' error!'); //reject(err);
			}
			return resolve(out);
		});
	});
function writeFile(file:string,text:string, options?:any) {
	return new Promise <void> ((resolve, reject) => {
		fs.writeFile(file, text, options, (error) => {
		if (error) {
			return reject(error.toString());
		} else {
			return resolve();
		}
		});
	});
}
function getCodeBlockAt(doc: vscode.TextDocument,pos: vscode.Position) {
	const {activeTextEditor}=vscode.window;
	let s='', n=doc.lineAt(pos).lineNumber+1;startCode=n;
	if(activeTextEditor){
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
function selectOutputCodeblock(){
	const {activeTextEditor}=vscode.window;
	//let s='';
	if(activeTextEditor){
		const doc=activeTextEditor.document;
		let a=doc.lineAt(new vscode.Position(startCode,0)).text;
		let n=startCode;//+1;
		while (n<doc.lineCount) {
			n++;
			let a=doc.lineAt(new vscode.Position(n,0)).text;
			if(a.startsWith('```')){
			//	if(a==='```'){
					n++;
				if(n<doc.lineCount && doc.lineAt(new vscode.Position(n,0)).text==='```output'){
					//continue past start of output section
				} else {
					activeTextEditor.selection=new vscode.Selection(startCode,0,n,0);
					break;
				}
			}
		}
	}
	return;
}
function paste(text:string) {
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor && startCode>0){
		//vscode.window.showInformationMessage(text);
		while(lastCodeBlock.includes('=>>')){
			//copy intermediate results into the codeblock
			let i=text.indexOf('=<<');
			let j=text.indexOf('>>')+2;
			if (i>0 && j>i){
				let s=text.substring(i,j);
				lastCodeBlock=lastCodeBlock.replace('=>>',s);
				text=text.replace(/^.*=<<.*>>.?/m,'');
			} else {break;}
		}
		text=text.replace(/^.*=<<.*>>.?/mg,''); //remove remaining =<<xxx>>, nb. end . removes " when output is quoted
		text=text.replace(/^\s*[\r\n]/gm,''); //remove blank lines
		activeTextEditor.edit((selText)=>{
			if(text===''){
				selText.replace(activeTextEditor.selection,lastCodeBlock+"```\n");
			} else {
				text=text.trim()+'\n';
				selText.replace(activeTextEditor.selection,lastCodeBlock+"```\n```output\n"+text+"```\n");
			}
		});
		activeTextEditor.selection=new vscode.Selection(startCode,0,startCode,0);
	}
}
function deleteOutput() {
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor){
		selectOutputCodeblock();
		activeTextEditor.edit((selText)=>{
			selText.replace(activeTextEditor.selection,'');
		});
	}
}
export function deactivate() {}

