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
let newHover=false;
let replaceSel=new vscode.Selection(0,0,0,0);
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
			newHover=true;
			const line = doc.lineAt(pos);
			let currentFolder=doc.uri.path.substring(1,doc.uri.path.lastIndexOf('/')+1);  //%c
			if(currentFolder.slice(1,2)!==':'){currentFolder=fixFolder(currentFolder);} //win vs linux
			vscode.workspace.fs.createDirectory(context.globalStorageUri);
			let selectOnHover=config.get('selectOnHover');
			cd='';
			startCode=pos.line;
			if(line.text.startsWith('```')){
				tempd=context.globalStorageUri.fsPath+'/';
				//suppressOutput=line.text.endsWith('>');
				swap='';
				swapExp='';
				ex=getcmd(line.text); 				//command id
				arr=config.get(ex) as string;
				let msg=getmsg(line.text); 		//message for hover
				if(arr && arr.length>=3){        //predefined script engines
					temp='temp.txt';if(arr.length>=4){temp=arr[3];}
					exec=arr[0].replace('%f',tempd+temp).replace('%p',tempd)
										.replace('%c',currentFolder).replace('%n',temp);
					cd=arr[1].replace('%c',currentFolder).replace('%p',tempd);
					if(cd!==''){cd+='\n';}
					swap=arr[2].substr(0,3);      // {{ is the start, the end is }}
					swapExp=arr[2].substr(3);
					lastCodeBlock=getCodeBlockAt(doc,pos);
					if(selectOnHover){selectCodeblock();}
					let url='vscode://rmzetti.hover-exec?'+ex;
					if(swap!==''){ msg+='  ... *use '+swap+' for inline results*'; }
					msg='[ '+ex+' '+msg+']('+url+')';
					msg='*[ \[last script\] ]('+fixFolder(tempd)+temp+')* '+
					'*[ \[last result\] ]('+fixFolder(tempd)+temp+'.out.txt)*\n\n'+msg;
					const contents=new vscode.MarkdownString('*hover-exec:* '+msg);
					contents.isTrusted = true;
					return new vscode.Hover(contents);
				} else if(ex==='output'){
					ex='delete';
					if(selectOnHover){selectCodeblock();}
					return new vscode.Hover(new vscode.MarkdownString(
						'*hover-exec:*\n\n[output to text](vscode://rmzetti.hover-exec?remove)\n\n[delete output](vscode://rmzetti.hover-exec?delete)'
					));
				} else {
					temp='temp.txt';
					if(line.text.slice(3).includes('```')){
						exec=ex.replace(/%20/mg,' ').replace('%f',tempd+temp).replace('%p',tempd)
													.replace('%c',currentFolder).replace('%n',temp);
						ex='exe';
						let url='vscode://rmzetti.hover-exec?'+ex;
						const contents = new vscode.MarkdownString('*hover-exec:*\n\n['+exec+']('+url+')');
						contents.isTrusted = true;
						return new vscode.Hover(contents);
					} else {
						exec=('"'+ex+'" "'+tempd+temp+'"').replace(/%20/mg,' ');
						lastCodeBlock=getCodeBlockAt(doc,pos);
						let url='vscode://rmzetti.hover-exec?'+ex.replace(/\s/mg,'%20');
						msg='['+ex+']('+url+')';
						msg='*[ \[last script\] ]('+fixFolder(tempd)+temp+')*\n\n'+msg;
						const contents=new vscode.MarkdownString('*hover-exec:* '+msg);
						contents.isTrusted = true;
						return new vscode.Hover(contents);
					}
				}
			}
			else { return null; }
		}})()
	);
}
class MyUriHandler implements vscode.UriHandler {
	async handleUri(uri: vscode.Uri): Promise<void | null | undefined> {
		if (uri.query==='delete'){ deleteOutput(false);return; }
		if (uri.query==='remove'){ deleteOutput(true);return; }
		newHover=false;
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
		writeFile(tempd+temp,cd+s);
		if(ex!==''){
			if (ex==='eval'){
				let s1=s.split(/\r?\n/);
				lastResult='';
				s1.forEach((line)=>{
					s=eval(line);
					if(s){lastResult+=s+'\n';} //if(s) avoids 'undefined'
				});
			}
			else if(ex==='exe'){
				//vscode.window.showInformationMessage(exec);
				await execShell(exec);
				return;
			}
			else {
				lastResult = await execShell(exec);
			}
			if (ex==='buddvs'){lastResult=lastResult.replace(/�/g,'î');	}
		} else {
			lastResult=uri.toString();
		}
		writeFile(tempd+temp+'.out.txt',lastResult);
		if(suppressOutput || newHover){
			vscode.window.showInformationMessage('output cancelled');
		} else {
			paste(lastResult);
		}
		removeSelection();
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
					if (i>0 && j>i){
						let s=text.substring(i,j).replace(/\r?\n/,';'); //remove newlines in intermediate results
						if(s===''){s=';';}
						lastCodeBlock=lastCodeBlock.replace(swap+'\n',swap+s+'\n');
						text=text.replace(re,'');
					} else {break;}
		}}}
		//re=new RegExp('^.*{{.*}}$','mg');
		//text=text.replace(re,'');
		text=text.replace(/^\s*$/gm,''); //remove blank lines
		activeTextEditor.edit((selText)=>{
			if(text===''){
				selectCodeblock();
				//selText.replace(activeTextEditor.selection,lastCodeBlock+"```\n");
				selText.replace(replaceSel,lastCodeBlock+"```\n");
			} else {
				text=text.trim()+'\n';
				selectCodeblock();
				//selText.replace(activeTextEditor.selection,lastCodeBlock+"```\n```output\n"+text+"```\n");
				selText.replace(replaceSel,lastCodeBlock+"```\n```output\n"+text+"```\n");
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
	s=s.slice(3);
	if(s.includes('```')){
		s=s.replace(/```.*/,'');
		return s;
	}
	let len=s.indexOf(" ");
	if(len<0){len=s.length;}
	ex=s.slice(0,len);
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
	if(ex===''){ex=s;}
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
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor){
		replaceSel=new vscode.Selection(startCode,0,startCode,0);
		activeTextEditor.selection=replaceSel;
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
async function writeFile(file:string,text:string) {
	await vscode.workspace.fs.writeFile(vscode.Uri.file(file), Buffer.from(text));
}
function getCodeBlockAt(doc: vscode.TextDocument,pos: vscode.Position) {
	const {activeTextEditor}=vscode.window;
	let s='';
	startCode=0;
	if(activeTextEditor){
		let n=doc.lineAt(pos).lineNumber+1;
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
		while (n<doc.lineCount) {
			n++;
			let a=doc.lineAt(new vscode.Position(n,0)).text;
			if(a.startsWith('```')){
				n++;
				if(n<doc.lineCount && doc.lineAt(new vscode.Position(n,0)).text==='```output'){
					//continue past start of output section
				} else {
					replaceSel=new vscode.Selection(startCode,0,n,0);
					activeTextEditor.selection=replaceSel;
					break;
				}
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
export function deactivate() {}

