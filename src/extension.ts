import * as vscode from 'vscode';
import * as cp from "child_process";
import internal = require('stream');
let codeBlock="";				 //code for execution
let startCode=0;				  //start line of code
let out:string='';					//output from code execution
let swap='';						  //3 char string to indicate pos for in-line result
let swapExp='';					   //expression in script language to produce in-line result
let nothingToSwap=false;   //no swaps so leave code as is
let tempd:string='';			 //folder for temp files (provided by vscode)
let temp='';						 //file name of temp file for current script
let cd='';							   //code default start line for current script
let ex='';							   //execution id for current script
let exec='';						 //javascript to start current script execution
let msg='';						    //message for hover, derived from ``` line
let shown=false;				//progress message 1 showinf
let currentFolder='';			//folder containing current edit file
let currentFile='';				  //name of current edit file
let executing=false;		   //code is executing
let nexec=0;					   //number of curren	tly executing code (auto incremented)
let oneLiner=false;				//current script is a 'one-liner'
let noinline=false;				//if true disallows inline results
let ch:cp.ChildProcess;		//child process executing current script
let curs1:number=0;let curs2:number=0;
let replaceSel=new vscode.Selection(0,0,0,0); //section in current editor which will be replaced
let config=vscode.workspace.getConfiguration('hover-exec'); //hover-exec settings
let a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z; //provide single char variables for use in scripts
export function activate(context: vscode.ExtensionContext) {
	vscode.languages.registerHoverProvider('markdown',
		new (class implements vscode.HoverProvider {
			async provideHover(doc: vscode.TextDocument,
				pos: vscode.Position,token: vscode.CancellationToken
		  		): Promise<vscode.Hover | null> {
			let line = doc.lineAt(pos); 	//user is currently hovering over this line
			oneLiner=false;						//check for a one-liner
			if(!line.text.startsWith('```')){
				oneLiner=line.text.startsWith('`') && line.text.slice(2).includes('`');
				if(!oneLiner){return null;}  //if not a code block or a oneLiner, ignore
			}
			if(executing){  			  		  //if already executing code block, show cancel option
				return new vscode.Hover(new vscode.MarkdownString(
					'*hover-exec:* executing...\n\n[cancel execution](vscode://rmzetti.hover-exec?abort)'
			));}
			if(line.text==='```'){ 				//allow hover-exec from end of codeblock
				let n=getStartOfBlock(doc,pos); 	//if at end, get start of block
				if(n<0){return null;}							//if can't find start ignore
				pos=new vscode.Position(n,0);		//adjust pos and line
				line = doc.lineAt(pos);						//to refer to start of block
			}
			setExecParams(context,doc,pos,line); //reset basic exec parameters
			curs1=0;								//do not reset cursor pos for hover click 
			let ex1=ex.replace(/\s.*/,'');	//check for predefined commands (no spaces)
			//let script=config.get(ex1); 	//defined if ex1 is a 'built-in' script (prev version)
			let script=config.get('scripts.'+ex1);	 //defined if ex1 is a 'built-in' script
			msg=getmsg(line.text);		 //message for hover
			if(script){								 //if predefined script engine
				ex=ex1;									
				getScriptSettings(script);  //get predefined command strings (& expand %f etc)
				if(!script){return null;}		  //redirect (script.alt) didn't work, ignore
				codeBlock=getCodeBlockAt(doc,pos);		//save codeblock
				let url='vscode://rmzetti.hover-exec?'+ex; //url for hover
				if(swap!==''){ msg+='  ... *for inline results use =>> or '+swap+'*'; } //get msg etc for hover info
				msg='*[ \[last script\] ]('+fixFolder(tempd)+temp+')* '+      //create last script & result urls
				  '*[ \[last result\] ]('+fixFolder(tempd)+temp+'.out.txt)*\n\n'+'[ '+ex+msg+']('+url+')';
				const contents=new vscode.MarkdownString('*hover-exec:* '+msg);
				//contents.isTrusted = true;					//create complete hover message, declare as trusted
				return new vscode.Hover(contents);//and return it
			} else if(ex==='output'){						 //create & return message & urls for output hover
				ex='delete';										//options: delete or remove codeblock (leave text)
				return new vscode.Hover(new vscode.MarkdownString(
					'*hover-exec:*\n\n[output to text](vscode://rmzetti.hover-exec?remove)\n\n'+
					'[delete output](vscode://rmzetti.hover-exec?delete)' //return hover output delete hover
				));
			} else if(oneLiner){	//create & return hover-message and urls for one-liners
				exec=line.text.slice(1).replace(/{.*}/,''); //exec is start command, next line substitutes %f etc
				exec=replaceStrVars(exec.slice(0,exec.indexOf('`')).replace(/%20/mg,' '));
				ex='oneliner';    //ex is command id
				let url='vscode://rmzetti.hover-exec?'+ex;//create hover message, declare as trusted, and return it
				const contents = new vscode.MarkdownString('*hover-exec:* '+msg+'\n\n['+exec+']('+url+')');
				//contents.isTrusted = true; 							//formulate link string & set as trusted
				return new vscode.Hover(contents);		  //return link string
			} else {		  				//create and return hover message & urls for non-built-in commands
				exec=(ex+' "'+tempd+temp+'"').replace(/%20/mg,' ');
				codeBlock=getCodeBlockAt(doc,pos);	  //save codeblock
				let url='vscode://rmzetti.hover-exec?'+ex.replace(/\s/mg,'%20');
				msg='['+ex+msg+']('+url+')';				  //create hover message & url
				msg='*[ \[last script\] ]('+fixFolder(tempd)+temp+')*\n\n'+msg;
				const contents=new vscode.MarkdownString('*hover-exec:* '+msg);
				//contents.isTrusted = true;						 //set hover links as trusted
				return new vscode.Hover(contents);	   //and return it
			}
		}})()
	);
	context.subscriptions.push(vscode.commands.registerCommand("hover-exec.exec", () => {
			//preocess exec command (suggested shortcut Alt+/ ) -- find start of block and execute
			let editor = vscode.window.activeTextEditor;
			if (editor){ //} && editor.selection.isEmpty) {
				let doc = editor.document;					//get document
        		let pos = editor.selection.active;			//and position
				curs1=pos.line;curs2=pos.character;	  //when command was executed
				let n=getStartOfBlock(doc,pos);		  //get start of codeblock
				if(n<0){return null;}							  //if not in codeblock ignore
				pos=new vscode.Position(n,0);		  //set position at start of block
				let line = doc.lineAt(pos);					 //get command line contents
				if(executing){hUri.handleUri(vscode.Uri.parse('vscode://rmzetti.hover-exec?abort'));
					progress1('previous exec aborted',500);return; //if processing cancel job and ignore
				}
				setExecParams(context,doc,pos,line);//reset basic execute parameters
				let ex1=ex.replace(/\s.*/,'');		 //check for predefined commands (nothing after a space)
				let script=config.get('scripts.'+ex1); 		//array of strings if ex1 is a 'built-in' script
				//let script=config.get(ex1); 		//array of strings if ex1 is a 'built-in' script
				if(script){									   //predefined script engine strings
					ex=ex1;
					getScriptSettings(script);    //get predefined command strings (& expand %f etc)
					if(!script){return null;}			//redirect (script.alt) didn't work
					codeBlock=getCodeBlockAt(doc,pos);			 //save codeblock
					let url='vscode://rmzetti.hover-exec?'+ex;      //url as for hover-execute
					hUri.handleUri(vscode.Uri.parse(url));			 //execute codeblock via url
				} else if(ex==='output') {
					deleteOutput(false);		//for cursor in output block, simply delete the block
				} else {								  //other commands and one-liners
					line=doc.lineAt(curs1);	  //get line where command was executed	
					if(oneLiner){					 //create exec string for one-liner
						exec=line.text.slice(1).replace(/{.*}/,''); //remove {..} exec is start command, next line substitutes %f etc
						exec=replaceStrVars(exec.slice(0,exec.indexOf('`')).replace(/%20/mg,' '));
						ex='oneliner';				//set command for exec by hUri.handleUri
					} else {
						exec=line.text.slice(3).replace(/{.*}/,''); //exec is start command, next line substitutes %f etc
						exec=replaceStrVars(exec.slice(0,exec.indexOf('```')).replace(/%20/mg,' '));
					}
					let url='vscode://rmzetti.hover-exec?ex';       //using url enables re-use of hover-execute code
					hUri.handleUri(vscode.Uri.parse(url));			//execute codeblock via url
				}
			}
	}));
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		config=vscode.workspace.getConfiguration('hover-exec'); //update config if changed
	}));
	context.subscriptions.push(vscode.window.registerUriHandler(hUri));
}
let hUri=new class MyUriHandler implements vscode.UriHandler { 
	//handle hover exec commands (command is in uri.query)
	async handleUri(uri: vscode.Uri): Promise<void | null | undefined> {
		nexec+=1; 		//script exec number for check to ensure output is from latest script
		if (uri.query==='abort'){ //cancel has been clicked, kill executing task
			executing=false; ch.kill(); return; 
		}
		 if (uri.query==='delete'){ deleteOutput(false);return; } //delete output codeblock
		if (uri.query==='remove'){ deleteOutput(true);return; } //change output codeblock to text
		if(!noinline && (codeBlock.includes('=>>')||codeBlock.includes('=<<'))){
			//if 'noinline' has been set in command line do not process in-line markers
			//also allows for earlier version in-line output in form =<< ... >>
			codeBlock=codeBlock.replace(/=<</g,'=>>');
			swap='=>>'; //use =>> as swap indicator (overrides presets)
		}
		let sCode=codeBlock;
		nothingToSwap= noinline || swap==='' || !codeBlock.includes(swap);
		if(!nothingToSwap){
			let re=new RegExp(swap+'.*','mg');		  //regex to remove previous results
			codeBlock=codeBlock.replace(re,swap); //remove previous in-line results
			re=new RegExp('^(.*)'+swap,'mg'); //insert swap code into code block script as needed
			sCode=codeBlock.replace(re,swapExp); //update sCode
		}
		vscode.window.withProgress({ //set up status bar exec indicator
			location: vscode.ProgressLocation.Window,
			title: 'Hover-exec'					   //title for progress display
		},
		async progress =>{
			executing=true;											 //set 'executing' flag
			let iexec=nexec;										 //& save exec number for this script
			out='';														   //reset output buffer
			progress.report({message: 'executing'});  //start execution indicator
			writeFile(tempd+temp,cd+sCode);			 //saves code in temp file for execution
			eval('process.chdir("'+currentFolder+'")');//change to current directory
			if(ex!==''){
				if (exec===''){							//use vscode internal js eval via eval
					sCode=sCode.replace(/console.log/g,'write'); //provide a console.log for eval
					eval(sCode);					  //execute codeblock with eval
				}
				else if(ex==='oneliner'){		//execute one-liner
					await execShell(exec);		//exec has one liner
					executing=false;			  //exec complete	
					return;								//return now (one-liners do not produce output)
				}
				else {
						out = await execShell(exec);  //exec all other commands
				}
				if (ex==='buddvs'){out=out.replace(/�/g,'î');	} //for test scripter
			} else {
				out=uri.toString(); //no ex, return uri
			}
			executing=false; //execution finished
			//output to both output file and editor
			//todo: {output=none} option to output only to file
			if(iexec===nexec){  		 //only output if this is the latest result
				writeFile(tempd+temp+'.out.txt',out); //write to output file
				out=out.replace(/\[object Promise\]\n*/g,'');  //remove in editor
				if(out!==''){
					paste(out); 		//paste into editor
					removeSelection();    //deselect
				}
				progress1('ok',500); //report successful completion
				//todo: silence this with {quiet} option
			};
	});	}
};
function setExecParams(context:vscode.ExtensionContext,doc: vscode.TextDocument,
	pos: vscode.Position,line: vscode.TextLine){
	currentFile=doc.uri.path.substring(1);  //currentfile, can be used in exec commands as %e
	currentFolder=doc.uri.path.substring(1,doc.uri.path.lastIndexOf('/')+1);  	   // folder, %c
	if(currentFolder.slice(1,2)!==':'){currentFolder=fixFolder(currentFolder);} //win vs linux
	vscode.workspace.fs.createDirectory(context.globalStorageUri);  //create temp folder if necessary
	cd='';									//reset code default start line
	startCode=pos.line;	  		  //save start of code line number
	temp='temp.txt';  				//temporary file name, can be used as %n
	tempd=context.globalStorageUri.fsPath+'/';   //temp folder path, %p
	swap='';swapExp='';		   	 			 //default is empty string
	nothingToSwap=false;				  //set true if no in-line swaps required
	ex=getcmd(line.text);					//command id, performs {...} changes
}
function paste(text:string) { //paste into editor
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor && startCode>0){
		//remove 'object promise' messages in editor
		if(ex==='eval'){text=text.replace(/\[object Promise\]/g,'');}
		if(!nothingToSwap){ 									//if doing in-line output
			let re=new RegExp(swap+'.*','mg');		 //regex to look for swap strings
			codeBlock=codeBlock.replace(re,swap);//remove all after swap strings
			let re1=new RegExp(swap+'$','m'); //indicater for any remaining swap string
			if(re1.test(codeBlock)){ 			//if there are any swap getScriptSettings
				//copy in-line results into the codeblock
				re=new RegExp('^.*{{.*}}$','m');//regex to remove swapped output line
				while(re1.test(codeBlock)){ //while there is a swap string to replace
					let i=text.indexOf('{{')+2;//find the start and
					let j=text.indexOf('}}\r'); //end of the next swappable {{output}}
					if(j<0){j=text.indexOf('}}\n');} //allow for \n, \r & \r\n eols
					if (i>0 && j>=i){			  //if inded there is a swappable line
						let s=text.substring(i,j).replace(/\r?\n/,';'); //remove newlines in in-line results
						if(s===''){s=';';}			//if the remainder is empty just provide ;
						codeBlock=codeBlock.replace(swap+'\n',swap+s+'\n'); //do the swap
						text=text.replace(re,'');//remove the swapped output to clear for the next
					} else {break;} 				  //break when done
			}}
		}
		//text=text.replace(/^\s*[\r\n]/gm,'').trim(); //remove blank lines (prev version)
		text=text.replace(/^\s*[\r\n]/,'').trim();   //remove start blank line if any
		//if there is any output left, it will go into an ```output codeblock
		activeTextEditor.edit((selText)=>{
			selectCodeblock(); //select codeblock to replace
			if(text===''){          //no unused output
				if(!nothingToSwap){selText.replace(replaceSel,codeBlock+"```\n");}
			} else if(oneLiner || nothingToSwap){ //only producing an output block
				selText.replace(replaceSel,"```output\n"+text+"\n```\n");
			} else {	//replace the codeblock text/output (codeblock now includes inline results)
				selText.replace(replaceSel,codeBlock+"```\n```output\n"+text+"\n```\n");
			}
		});
	}
}
function write() { 				  //provide a console.log() for the eval block
	for (var i = 0; i < arguments.length; i++) {
		if(i>0){out+=' ';}
		out+=arguments[i];
	}
	out+='\n';
}
function fixFolder(f:string){ //check folder string is ok
	if(f.startsWith('\\')){f=f.slice(1);}
	if(!f.startsWith('/')){f='/'+f;}
	return f;
}
function getcmd(s:string){ //get command from ```command line
	noinline=s.includes('noinline');//allows //= etc to be used normally
	if(s.includes('ext=')){ //allow specification of temp file ext, eg {ext=py}
		temp='temp.'+s.replace(/.*ext=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'');
	}
	if(s.includes('cmd=')){ //allow spec of command, eg. {cmd=python3}
		return s.replace(/.*cmd=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'');
	}
	if(oneLiner){s=s.slice(1);} //oneliners (only) start with single backticks
	else {s=s.slice(3);} 			//remove initial triple backtick
	if(s.startsWith('"')){		   //return quoted bit as command
		return s.slice(1).replace(/".*/,'');
	}
	s=s.replace(/`.*/,'');//remove end backticks (if on the start line) and all after
	let ipos=posComment(s);		//find comment in cmd line (std comment formats)
	if(ipos>0){s=s.slice(0,ipos);}	//and remove 
	ex=s.replace(/{.*}/,'').trim();	 //return trimmed line without comments as command
	return ex;
}
function getmsg(s:string){ //get message for hover from ```command line
	let msg='';
	if(oneLiner){s=s.slice(1).replace(/.*`/,'');} //oneliners use single backticks
	else {s=s.slice(3).replace(/.*```/,'');} 		  //remove triple backticks
	let ipos=posComment(s);   			//find comment in command line
	if(ipos>0){msg=' '+s.substr(ipos);} //use comments in hover message
	return msg;
}
function posComment(s:string){ //find start of any comment in command line
	let ipos=s.indexOf('<!--');	//using any of these  standard comment indicators
	if(ipos<=0){ipos=s.indexOf('--');}
	if(ipos<=0){ipos=s.indexOf('//');}
	if(ipos<=0){ipos=s.indexOf('#');}
	return ipos;
}
function getScriptSettings(script:any){ //get temp,exec,cd,swap & swapExp
	if(script.alt){ //allow redirection of command
		//script=config.get(script.alt);				 //redirect (prev version)
		script=config.get('scripts.'+script.alt);	//redirect
		if(!script||script.alt){return undefined;}	 //but only once
	}
	temp=script.tempf;							//temp file name
	exec=replaceStrVars(script.exec);	//js execute command
	cd=replaceStrVars(script.cmd);		//script start command (if needed)
	if(cd!==''){cd+='\n';}	   //if start cmd used, terminate line
	swap=script.inline;		  // inline result indicator (eg. //=)
	swapExp=script.swap;  // {{ is the start, the end is }}
}
function replaceStrVars(s:string){ //replace %f etc with the appropriate string
	return s.replace(/%f/g,tempd+temp).replace(/%p/g,tempd)
	.replace(/%c/g,currentFolder).replace(/%n/g,temp).replace(/%e/g,currentFile);
}
function removeSelection(){ //deselect current selection
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor){
		if(curs1===0){
			replaceSel=new vscode.Selection(startCode,0,startCode,0);
		} else {
			replaceSel=new vscode.Selection(curs1,curs2,curs1,curs2);
		}
		activeTextEditor.selection=replaceSel;
	}
}
const execShell = (cmd: string) => //execute shell command (to start scripts) 
	new Promise<string>((resolve, reject) => {
		ch=cp.exec(cmd, (err1, out1, stderr1) => {
			if (err1 && stderr1==='') {
				return resolve(out1+err1+','+stderr1);
			}
			return resolve(out1+stderr1);
		});}
);
async function writeFile(file:string,text:string) { //writes `text` to `file' (full path)
	await vscode.workspace.fs.writeFile(vscode.Uri.file(file), Buffer.from(text));
}
function getStartOfBlock(  //return start of codeblock containing ```, or -1
					doc: vscode.TextDocument,pos: vscode.Position) {
	let temptxt=doc.lineAt(pos).text;
	oneLiner=!temptxt.startsWith('```') && temptxt.startsWith('`') && temptxt.slice(2).includes('`');
	//oneliner is whole script in single line: uses single backtick at start of line & at end of command
	if(oneLiner || temptxt.startsWith('```') && temptxt.slice(3).trim().length>0){
		return pos.line; //if a oneliner or normal start line return line number
	}
	let n=pos.line-1; //start here and look backwards for start line
	while (n>=0 && !doc.lineAt(new vscode.Position(n,0)).text.startsWith('```')){n-=1;}
	if(doc.lineAt(new vscode.Position(n,0)).text==='```'){return -1;} //if end line, return -1
	else {return n;} //normal start line return line number
}
function getCodeBlockAt(  //return code in code block depending on type
					doc: vscode.TextDocument,pos: vscode.Position) {
	const {activeTextEditor}=vscode.window;
	let s='';
	startCode=0;
	if(activeTextEditor){
		let n=pos.line+1;
		startCode=n;
		if(oneLiner){ //return all after first space up to backtick
			let s1=doc.lineAt(pos).text.slice(1);
			s1=s1.slice(s1.indexOf(' ')+1,s1.indexOf('`'));
			return replaceStrVars(s1);
		}
		if(doc.lineAt(pos).text.endsWith('```')) {
			return '';  //return empty string
		}
		while (n<doc.lineCount) {
			let a=doc.lineAt(new vscode.Position(n,0)).text;
			n++;
			if(a.startsWith('```')){
				break; //stop at line starting with ```
			} else {	//add line to code buffer
				s=s+a+'\n';
			}
		}
	}
	return s;
}
function selectCodeblock(){ //select code block appropriately depending on type
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor && startCode>0){
		const doc=activeTextEditor.document;
		let output=false;  //records when an output line reached
		let n=startCode;   //selection starts from startCode
		if(oneLiner){n-=1;}//for oneliner
		while (n<doc.lineCount) {
			n++;				 //work through the block 
			let a=doc.lineAt(new vscode.Position(n,0)).text;
			if(a.startsWith('```')){
				n++;	//when a triple backtick is found.. 
				if(oneLiner && n===startCode+1 && a==='```output'){
							//continue past start of output section
				} else if(!oneLiner && n<doc.lineCount && doc.lineAt(new vscode.Position(n,0)).text==='```output'){
							//continue past start of output section, if not swapping then select starts here
					if(nothingToSwap){startCode=n;output=true;}
				} else {
					if(oneLiner && n===startCode+1) {
						replaceSel=new vscode.Selection(startCode,0,n-1,0);
					} else {
						if(nothingToSwap && !output && !oneLiner){startCode=n;} //if no swapping & no output block, select starts here
						replaceSel=new vscode.Selection(startCode,0,n,0);
					}
					activeTextEditor.selection=replaceSel;
					break;
				}
			} else if(oneLiner && n===startCode){
				replaceSel=new vscode.Selection(n,0,n,0);
				break;
			}
		}
	}
	return;
}
function deleteOutput(asText:boolean) { //delete output code block, or leave as text
	const {activeTextEditor}=vscode.window;
	if(activeTextEditor){
		selectCodeblock();
		if(asText){		//remove start and end lines, ie. with backticks
			let pos1=activeTextEditor.selection.start.line+1;
			let pos2=activeTextEditor.selection.end.line-1;;
			let sel=new vscode.Selection(pos1,0,pos2,0);
			activeTextEditor.edit((selText)=>{ 
				selText.replace(activeTextEditor.selection,activeTextEditor.document.getText(sel));
			});
		} 
		else { 			  //remove whole output block
			activeTextEditor.edit((selText)=>{
				selText.replace(activeTextEditor.selection,'');
			});
		}
	}
}
export function deactivate() {
}
function alert(s:string) { //provide an alert function for eval scripts
	vscode.window.showInformationMessage(s);
}
function progress1(msg:string,timeout:number){
	//show a 'progress' pop up for eval scripts, timeout in ms
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
			}, timeout);
		});
		return p;
	});
	return p;
}
