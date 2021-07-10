import * as vscode from 'vscode';
import * as cp from "child_process";
import * as fs from "fs";
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
let arr:string;
let config=vscode.workspace.getConfiguration('hover-exec');
const {activeTextEditor}=vscode.window;
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		config=vscode.workspace.getConfiguration('hover-exec'); //update config
	}));
	const uriHandler = new MyUriHandler();
	context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));
	vscode.languages.registerHoverProvider(
		'markdown',
		new (class implements vscode.HoverProvider {
		  async provideHover(doc: vscode.TextDocument,
			pos: vscode.Position,token: vscode.CancellationToken
		  ): Promise<vscode.Hover | null> { // <vscode.Hover|null|undefined>
			const line = doc.lineAt(pos);
			let currentFolder=doc.uri.path.substring(1,doc.uri.path.lastIndexOf('/')+1);  //%c
			vscode.workspace.fs.createDirectory(context.globalStorageUri);
			let selectOnHover=config.get('selectOnHover');
			cd='';
			startCode=pos.line;
			if(line.text.startsWith('```')){
				tempd=context.globalStorageUri.fsPath+'/';
				suppressOutput=line.text.endsWith('>');
				swap='';
				swapExp='';
				ex=getcmd(line.text); //command id
				arr=config.get(ex) as string;
				let msg=getmsg(line.text); //message for hover
				if(arr && arr.length>=3){
					temp='temp.txt';if(arr.length>=4){temp=arr[3];}
					exec=arr[0].replace('%f','"'+tempd+temp+'"').replace('%p','"'+tempd+'"').replace('%c','"'+currentFolder+'"').replace('%n','"'+temp+'"');
					cd=arr[1].replace('%c','"'+currentFolder+'"').replace('%p','"'+tempd+'"');
					if(cd!==''){cd+='\n';}
					swap=arr[2].substr(0,3); // {{ is the start, the end is }}
					swapExp=arr[2].substr(3);
					lastCodeBlock=getCodeBlockAt(doc,pos);
					if(selectOnHover){selectOutputCodeblock();}
					let url='vscode://rmzetti.hover-exec?'+ex;
					if(swap===''){suppressOutput=true}
					else{msg+='  ... *use '+swap+' for inline results*';}
					msg='[exec '+ex+' '+msg+']('+url+')';
					msg='*[ \[last script\] ](/'+tempd+temp+')* '+
					'*[ \[last result\] ](/'+tempd+temp+'.out.txt)*\n\n'+msg;
					const contents=new vscode.MarkdownString('*hover exec:* '+msg);
					contents.isTrusted = true;
					return new vscode.Hover(contents);
				} else if(ex==='output'){
					ex='delete';
					if(selectOnHover){selectOutputCodeblock();}
					return new vscode.Hover(new vscode.MarkdownString(
						'*hover exec:*\n\n[delete output](vscode://rmzetti.hover-exec?delete)'
					));
				} else {
					ex='';return null;
				}
			}
			else {
				let fileUri=vscode.Uri.file(line.text.trim()); //can have internal spaces
				if(fileUri){
					try {
						await vscode.workspace.fs.stat(fileUri);
						let temp1=line.text.trim().replace(/\s/g,'%20'); 
						const contents = //markdown link must use %20
							new vscode.MarkdownString('[openrm](/'+temp1+')');
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
}
class MyUriHandler implements vscode.UriHandler {
	async handleUri(uri: vscode.Uri): Promise<void | null | undefined> {
		if (uri.query==='delete'){ deleteOutput();return; }
		if(!suppressOutput){selectOutputCodeblock();}
		if(lastCodeBlock.includes('=>>')||lastCodeBlock.includes('=<<')){
			lastCodeBlock=lastCodeBlock.replace(/=<</g,'=>>');
			swap='=>>';
		}
		let re=new RegExp(swap+'.*','mg');
		let s=lastCodeBlock;
		if(swap!==''){
			lastCodeBlock=lastCodeBlock.replace(re,swap); //remove previous in-line results
			re=new RegExp('^(.*)'+swap,'mg');
			s=lastCodeBlock.replace(re,swapExp);
		}
		writeFile(tempd+temp,cd+s);
		if(ex!==''){
			if (ex==='eval'){
				let s1=s.split(/\r?\n/);
				lastResult='';
				s1.forEach((line)=>{
					s=eval(line);
					if(s){lastResult+=s+'\n';} //the if avoids 'undefined'
				});
			}
			else {
				lastResult = await execShell(exec);
			}
			if (ex==='buddvs'){lastResult=lastResult.replace(/�/g,'î');	}
		} else {
			lastResult=uri.toString();
		}
		writeFile(tempd+temp+'.out.txt',lastResult);
		if( !suppressOutput ){paste(lastResult);}
		removeSelection();
	}
}
function paste(text:string) {
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor && startCode>0){
		if(ex==='eval'){text=text.replace(/\[object Promise\]/g,'');}
		let re=new RegExp(swap+'.*','mg');
		lastCodeBlock=lastCodeBlock.replace(re,swap);
		re=new RegExp('^.*{{.*}}$','m');
		let re1=new RegExp(swap+'$','m');
		if(swap!=="" && re1.test(lastCodeBlock)){
			//vscode.window.showInformationMessage('pr>'+lastCodeBlock.includes(swap+'\n'));
			//vscode.window.showInformationMessage('re>'+re1.test(lastCodeBlock));
			//while(lastCodeBlock.includes(swap+'\n')){
			while(re1.test(lastCodeBlock)){
					//copy intermediate results into the codeblock
				let i=text.indexOf('{{')+2;
				let j=text.indexOf('}}\r');if(j<0){j=text.indexOf('}}\n');} //to allow \n, \r & \r\n
				//vscode.window.showInformationMessage(''+i+'<>'+j+'<>'+text.substring(i,j)+'<');
				if (i>0 && j>i){
					let s=text.substring(i,j).replace(/\r?\n/,';'); //remove newlines in intermediate results
					if(s===''){s=';';}
					lastCodeBlock=lastCodeBlock.replace(swap+'\n',swap+s+'\n');
					text=text.replace(re,'');
				} else {break;}
		}} else {
			return;
			//vscode.window.showInformationMessage('no swap');
		}
		re=new RegExp('^.*{{.*}}$','mg');
		text=text.replace(re,'');
		text=text.replace(/^\s*[\r?\n]/gm,''); //remove blank lines
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
function createTest(s:string){
  return new Function;
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
async function writeFile(file:string,text:string, options?:any) {
	await vscode.workspace.fs.writeFile(vscode.Uri.file(file), Buffer.from(text, 'utf8'));
	// return new Promise <void> ((resolve, reject) => {
	// 	fs.writeFile(file, text, options, (error) => {
	// 	if (error) {
	// 		return reject(error.toString());
	// 	} else {
	// 		return resolve();
	// 	}
	// 	});
	// });
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

