import * as vscode from 'vscode';
import * as cp from "child_process";
let lastCodeBlock="";			//code for execution
let startCode=0;				  //start line of code
let lastResult:string='';		  //output from code execution
let swap='';						  //3 char string to indicate pos for in-line result
let swapExp='';					   //expression in script language to produce in-line result
let tempd:string='';			 //folder for temp files (provided by vscode)
let temp='';						 //file name of temp file for current script
let cd='';							   //code default start line for current script
let ex='';							   //execution id for current script
let exec='';						 //javascript to start current script execution
let msg='';						    //message for hover, derived from ``` line
let arr:string;						 //array of strings for current 'built-in' script
let shown=false;				//progress message 1 showinf
let currentFolder='';			//folder containing current edit file
let currentFile='';				  //name of current edit file
let executing=false;		   //code is executing
let nexec=0;					   //number of curren	tly executing code (auto incremented)
let oneLiner=false;				//current script is a 'one-liner'
let ch:cp.ChildProcess;		//child process executing current script
let a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z; //variables for use in eval codeblocks
let replaceSel=new vscode.Selection(0,0,0,0); //section in current editor which will be replaced
let config=vscode.workspace.getConfiguration('hover-exec');
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		config=vscode.workspace.getConfiguration('hover-exec'); //update config
	}));
	context.subscriptions.push(vscode.window.registerUriHandler(new MyUriHandler()));
	vscode.languages.registerHoverProvider('markdown',
		new (class implements vscode.HoverProvider {
			async provideHover(doc: vscode.TextDocument,
				pos: vscode.Position,token: vscode.CancellationToken
		  		): Promise<vscode.Hover | null> {
			const line = doc.lineAt(pos); //user is currently hovering over this line    
			if(!line.text.startsWith('```')||line.text==='```'){
				return null;}						 //if not a code block line with id, ignore
			if(executing){  						//if already executing code block, show cancel option
				return new vscode.Hover(new vscode.MarkdownString(
					'*hover-exec:* executing...\n\n[cancel execution](vscode://rmzetti.hover-exec?abort)'
			));}
			currentFile=doc.uri.path.substring(1);  //currentfile, can be used in exec commands as %e
			currentFolder=doc.uri.path.substring(1,doc.uri.path.lastIndexOf('/')+1);  	   // folder, %c
			if(currentFolder.slice(1,2)!==':'){currentFolder=fixFolder(currentFolder);} //win vs linux
			vscode.workspace.fs.createDirectory(context.globalStorageUri);  //create temp folder if necessary
			cd='';									//reset code default start line
			startCode=pos.line;	  		  //save start of code line number
			oneLiner=line.text.slice(3).includes('```');
			temp='temp.txt';  				//temporary file name, can be used as %n
			tempd=context.globalStorageUri.fsPath+'/';   //temp folder path, %p
			swap='';swapExp='';		   	 //default is empty string
			ex=getcmd(line.text); 	  	//command id, performs {...} changes
			msg=getmsg(line.text); 	  //message for hover
			let ex1=ex.replace(/\s.*/,'');    //check for predefined commands (no spaces)
			arr=config.get(ex1) as string;//get command strings if available
			if(arr){  //predefined script engine strings
				ex=ex1;
				getScriptSettings(currentFolder);    //get predefined command strings (& expand %f etc)
				lastCodeBlock=getCodeBlockAt(doc,pos);							 //save codeblock
				let url='vscode://rmzetti.hover-exec?'+ex;                              //url for hover
				if(swap!==''){ msg+='  ... *use '+swap+' for inline results*'; } //get msg etc for hover info
				msg='*[ \[last script\] ]('+fixFolder(tempd)+temp+')* '+      //create last script/result urls
				  '*[ \[last result\] ]('+fixFolder(tempd)+temp+'.out.txt)*\n\n'+'[ '+ex+msg+']('+url+')';
				const contents=new vscode.MarkdownString('*hover-exec:* '+msg);
				contents.isTrusted = true;					//create complete hover message, declare as trusted
				return new vscode.Hover(contents);//and return it
			} else if(ex==='output'){						 //create & return message & urls for output hover
				ex='delete';
				return new vscode.Hover(new vscode.MarkdownString(
					'*hover-exec:*\n\n[output to text](vscode://rmzetti.hover-exec?remove)\n\n'+
					'[delete output](vscode://rmzetti.hover-exec?delete)'
				));
			} else {
				if(oneLiner){	//create & return hover-message and urls for one-liners
					exec=line.text.slice(3).replace(/{.*}/,''); //exec is start command, next line substitutes %f etc
					exec=replaceStrVars(exec.slice(0,exec.indexOf('```')).replace(/%20/mg,' '));
					ex='exe';    //ex is command id
					let url='vscode://rmzetti.hover-exec?'+ex;//create hover message, declare as trusted, and return it
					const contents = new vscode.MarkdownString('*hover-exec:* '+msg+'\n\n['+exec+']('+url+')');
					contents.isTrusted = true; 
					return new vscode.Hover(contents);
				} else {		  //create and return hover message & urls for non-standard commands
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
		}})()
	);
}
class MyUriHandler implements vscode.UriHandler {
	async handleUri(uri: vscode.Uri): Promise<void | null | undefined> {
		//handle clicked hover exec commands
		nexec+=1; //script exec number for check to ensure output is from latest script 
		if (uri.query==='abort'){ //cancel has been clicked, kill executing task
			executing=false; ch.kill(); return; 
		}
		if (uri.query==='delete'){ deleteOutput(false);return; }  //delete output codeblock
		if (uri.query==='remove'){ deleteOutput(true);return; }//change output codeblock to text
		if(lastCodeBlock.includes('=>>')||lastCodeBlock.includes('=<<')){
			//allows for earlier version in-line output in form =<< ... >>
			lastCodeBlock=lastCodeBlock.replace(/=<</g,'=>>');
			swap='=>>'; //use =>> as swap indicator (overrides presets)
		}
		let sCode=lastCodeBlock;
		if(swap!==''){
			let re=new RegExp(swap+'.*','mg');
			lastCodeBlock=lastCodeBlock.replace(re,swap); //remove previous in-line results
			re=new RegExp('^(.*)'+swap,'mg'); //insert swap code into code block script as needed
			sCode=lastCodeBlock.replace(re,swapExp); //update sCode
		}
		vscode.window.withProgress({ //set up status bar exec indicator
			location: vscode.ProgressLocation.Window,
			title: 'Hover-exec'
		},
	    async progress =>{
			executing=true;
			let iexec=nexec;											//save exec number for this script
			progress.report({message: 'executing'});
			writeFile(tempd+temp,cd+sCode);				//saves code in temp file for execution
			eval('process.chdir("'+currentFolder+'")');   //change to current directory
			if(ex!==''){
				if (ex==='eval'){										//eval uses vscode internal js eval
					//progress1('started');
					//lastResult=eval(cd+sCode)+'\n';		//need to do separate lines rather than this
										//because eval returns output from only the last evaluated statement
					let s1=sCode.split(/\r?\n/),s2='';
					lastResult='';
					s1.forEach((line)=>{
						s2=eval(line);						//line by line execution of code
						if(s2 && !line.endsWith(';')){
							lastResult+=s2+'\n';} //if(s2) avoids 'undefined'
					});
				}
				else if(ex==='exe'){			//exe is one-liner
					await execShell(exec);
					executing=false;
					return;							   //one-liners do not produce output
				}
				else {
						lastResult = await execShell(exec);
				}
				if (ex==='buddvs'){lastResult=lastResult.replace(/�/g,'î');	} //test scripter
			} else {
				lastResult=uri.toString();
			}
			//output to output file and editor
			if(iexec===nexec){  		 //only output if this is the latest result
				writeFile(tempd+temp+'.out.txt',lastResult);
				if(lastResult!==''){
					paste(lastResult); 		//paste into editor
					removeSelection(); //deselect
				}
				executing=false; //execution finished
			};
		});
	}
}
function paste(text:string) { //paste into editor
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor && startCode>0){
		//remove any 'object promise' message
		if(ex==='eval'){text=text.replace(/\[object Promise\]/g,'');}
		if(swap!==""){ 															//if doing in-line output
			let re=new RegExp(swap+'.*','mg');                    //regex to look for swap strings
			lastCodeBlock=lastCodeBlock.replace(re,swap); //remove all after swap strings
			let re1=new RegExp(swap+'$','m');
			if(re1.test(lastCodeBlock)){ 			//if there are any swap strings
				//copy intermediate results into the codeblock
				re=new RegExp('^.*{{.*}}$','m');//regex to find the next
				while(re1.test(lastCodeBlock)){ //while there is a swap string to replace
					let i=text.indexOf('{{')+2, j=text.indexOf('}}\r'); //find the next swappable {{output}}
					if(j<0){j=text.indexOf('}}\n');} //to allow \n, \r & \r\n
					if (i>0 && j>=i){
						let s=text.substring(i,j).replace(/\r?\n/,';'); //remove newlines in in-line results
						if(s===''){s=';';}
						lastCodeBlock=lastCodeBlock.replace(swap+'\n',swap+s+'\n'); //do the swap
						text=text.replace(re,'');         //remove the swapped output to clear for the next
					} else {break;}
		}}}
		text=text.replace(/^\s*$/gm,'').trim(); //remove blank lines
		//if there is any output left, it will go into an ```output codeblock
		activeTextEditor.edit((selText)=>{
			selectCodeblock(); //select codeblock to replace
			if(text===''){          //no unused output
				selText.replace(replaceSel,lastCodeBlock+"```\n");
			} else if(oneLiner){ //produce an output block for a one-liner
				selText.replace(replaceSel,"```output\n"+text+"\n```\n");
			} else {					//replace the original text/output (text now includes inline results)
				selText.replace(replaceSel,lastCodeBlock+"```\n```output\n"+text+"\n```\n");
			}
		});
	}
}
function fixFolder(f:string){ //check folder string is ok
	if(f.startsWith('\\')){f=f.slice(1);}
	if(!f.startsWith('/')){f='/'+f;}
	return f;
}
function getcmd(s:string){ //get command from ```command line
	if(s.includes('ext=')){ //allow specification of temp file ext, eg {ext=py}
		temp='temp.'+s.replace(/.*ext=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'');
	}
	if(s.includes('cmd=')){ //allow spec of command, eg. {cmd=python3}
		return s.replace(/.*cmd=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'');
	}
	s=s.slice(3); //remove initial backtics
	if(s.startsWith('"')){   //return quoted bit as command
		return s.slice(1).replace(/".*/,'');
	}
	s=s.replace(/```.*/,'');//remove everything after last backtics (if on the start line)
	let ipos=posComment(s); //find comment in command line (std comment formats)
	if(ipos>0){s=s.slice(0,ipos);}
	ex=s.replace(/{.*}/,'').trim();//return trimmed line without comments as command
	return ex;
}
function getmsg(s:string){
	//get message for hover from ```command line
	let msg='';
	s=s.slice(3).replace(/.*```/,''); //removebacktics
	let ipos=posComment(s);   //find comment in command line
	if(ipos>0){msg=' '+s.substr(ipos);} //use comments in hover message
	return msg;
}
function posComment(s:string){
	 //find position of comment in command line - any of the following can be used
	let ipos=s.indexOf('<!--');
	if(ipos<=0){ipos=s.indexOf('--');}
	if(ipos<=0){ipos=s.indexOf('//');}
	if(ipos<=0){ipos=s.indexOf('#');}
	return ipos;
}
function getScriptSettings(currentFolder:string){
	//get temp,exec,cd,swap & swapExp from config settings array `arr`
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
function replaceStrVars(s:string){ //replace %f etc with the appropriate string
	return s.replace(/%f/g,tempd+temp).replace(/%p/g,tempd)
	.replace(/%c/g,currentFolder).replace(/%n/g,temp).replace(/%e/g,currentFile);
}
function removeSelection(){ //deselect current selection
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor){
		replaceSel=new vscode.Selection(startCode,0,startCode,0);
		activeTextEditor.selection=replaceSel;
	}
}
const execShell = (cmd: string) => //execute shell command (to start scripts) 
	new Promise<string>((resolve, reject) => {
		ch=cp.exec(cmd, (err, out) => {
			if (err) {
				return resolve(cmd+' error!'); //reject(err);
			}
			return resolve(out);
		});}
);
async function writeFile(file:string,text:string) { //utility to write `text` to `file' (full path)
	await vscode.workspace.fs.writeFile(vscode.Uri.file(file), Buffer.from(text));
}
function getCodeBlockAt(doc: vscode.TextDocument,pos: vscode.Position) {
	//return code in code block depending on type
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
	//select code block appropriately depending on type
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
	//delete output code block (or leave as ordinary text without backtick lines
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
}
function progress1(msg:string){
	//show a 'progress' pop up for 4 sec (bottom right) - not currently used
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
