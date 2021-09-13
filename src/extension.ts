import * as vscode from 'vscode';
import * as cp from "child_process";
import internal = require('stream');
let codeBlock="";     //code f or execution
let startCode=0;      //start line of code
let out:string='';    //output from code execution
const swap='=>>';          //3 char string to indicate pos for in-line result
let needSwap=false;  //no swaps so leave code as is
let windows=false;    //os is windows
let tempPath:string='';  //  path for temp files (provided by vscode)
let tempFsPath:string='';  //fsPath for temp files (provided by vscode)
let tempName:string='';  //file name of temp file for current script
let cmdId='';         //execution id for current script
let cmd='';           //javascript to start current script execution
let msg='';           //message for hover, derived from ``` line
let shown=false;      //progress message 1 showinf
let currentFile='';   //path & name of current edit file
let currentFsFile=''; //path & name as os default string
let currentPath=''; //folder containing current edit file
let currentFsPath='';//folder containing current edit file fsPath
let executing=false;  //code is executing
let nexec=0;          //number of currently executing code (auto incremented)
let oneLiner=false;   //current script is a 'one-liner'
let inline=false;   //if true disallows inline results
let ch:cp.ChildProcess;//child process executing current script
let cursLine:number=0;//cursor line pos
let cursChar:number=0;//cursor char pos
let replaceSel=new vscode.Selection(0,0,0,0);   //section in current editor which will be replaced
let config=vscode.workspace.getConfiguration('hover-exec'); //hover-exec settings
//let hStatusBarItem: vscode.StatusBarItem;
//let startTime=new Date().getTime();
let refStr='*hover-exec:* predefined strings:\n'+
' - %f `full_path/name.ext` of temp file\n'+
' - %p `full_path/` for temporary files\n'+
' - %c `full_path/` of the current folder\n'+
' - %e `full_path/` of the editor file\n'+
' - %n `name.ext` of temporary file\n'+
' - The default ext is specified by appending .ext, eg. %f.py\n'+
' - In windows, if needed, /%f etc produces /c:/linux/web/style/path/';
//all single char variables declared for persistence over several eval scripts
let a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z;  //typescript reports unused

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerHoverProvider('markdown',
    new (class implements vscode.HoverProvider {
      async provideHover(
        doc: vscode.TextDocument,
        pos: vscode.Position,
        token: vscode.CancellationToken
        ): Promise<vscode.Hover | null> {
          let line = doc.lineAt(pos); //user is currently hovering over this line
          oneLiner=false;   //check for a one-liner
          if(!line.text.startsWith('```')){
            oneLiner=line.text.startsWith('`') && line.text.slice(2).includes('`');
            if(!oneLiner){return null;} //ignore if not a code block or oneLiner
          }
          if(executing){  //if already executing code block, show cancel option
            return new vscode.Hover(new vscode.MarkdownString(
              '*hover-exec:* executing...\n\n[cancel execution](vscode://rmzetti.hover-exec?abort)'
            ));
          }
          let output=line.text.startsWith('```output'); //will include 'delete' in options
          if(line.text==='```'){  //allow hover-exec from end of codeblock
            let n=getStartOfBlock(doc,pos); //if at end, get start of block
            if(n<0){return null;}           //if can't find start ignore
            pos=new vscode.Position(n,0);   //adjust pos and line
            line = doc.lineAt(pos);         //to refer to start of block
          }
          setExecParams(context,doc,pos,line);//reset basic exec parameters inc cmdId
          cmdId=getCmdId(line.text);//command id, performs {...} changes
          cursLine=0;                         //do not reset cursor pos for hover click 
          let cmd1=cmdId.replace(/\s.*/,'');  //check for predefined commands (no spaces)
          let script=config.get('scripts.'+cmd1); //is json object if cmd1 is a 'built-in' script
          msg=getmsg(line.text);//begin message for hover
          if(script){           //if predefined script engine
            cmdId=cmd1;
            cmd=replaceStrVars(script as string);//expand %f etc & get tempName
            codeBlock=getCodeBlockAt(doc,pos);//save codeblock
            let url='vscode://rmzetti.hover-exec?'+cmdId;       //url for hover
            msg=cmdId+'[ \[*config*\] ]('+url+'_config) '+ //add hover info
                 '[ \[*ref*\] ](vscode://rmzetti.hover-exec?ref) '+
                 '[[*delete block*\]](vscode://rmzetti.hover-exec?delete)\n\n';
            //if(output){msg+='[delete: \[*output*\] ](vscode://rmzetti.hover-exec?delete)';}
            msg+='open: [ \[*last script*\] ]('+tempPath+tempName+') '+    //create last script & result urls
                 '[ \[*last result*\ ] ]('+tempPath+tempName+'.out.txt) '+
                 '\n\n'+
                 '['+cmdId+getmsg(line.text)+']('+url+')';
            const contents=new vscode.MarkdownString('hover-exec:'+msg);
            contents.isTrusted = true;             //set hover links as trusted
            return new vscode.Hover(contents);//and return it
          } else if(cmdId==='output'){        //create & return message & urls for output hover  
            cmdId='delete';                   //options:delete or remove codeblock & leave text
            return new vscode.Hover(new vscode.MarkdownString(
              '*hover-exec:*\n\n[output to text](vscode://rmzetti.hover-exec?remove)\n\n'+
              '[delete output](vscode://rmzetti.hover-exec?delete)' //return output delete hover
            ));
          } else if(oneLiner){  //create & return hover-message and urls for one-liners
            cmd=line.text.slice(1).replace(/{.*}/,''); //start command, next substitute %f etc
            cmd=replaceStrVars(cmd.slice(0,cmd.indexOf('`')).replace(/%20/mg,' '));
            cmdId='oneliner';  //command id
            let url='vscode://rmzetti.hover-exec?'+cmdId;//create hover message, declare as trusted, and return it
            const contents = new vscode.MarkdownString('*hover-exec:* '+msg+'\n\n['+cmd+']('+url+')');
            contents.isTrusted = true;             //set hover links as trusted
            return new vscode.Hover(contents);      //return link string
          } else {              //create and return hover message & urls for non-built-in commands
            cmdId=cmdId.replace(/^>/,'');
            cmd=replaceStrVars(cmdId);
            codeBlock=getCodeBlockAt(doc,pos);    //save codeblock
            let url='vscode://rmzetti.hover-exec?other';//+cmdId.replace(/\s/mg,'%20');
            msg='['+cmd+']('+url+')';          //create hover message & url
            msg=cmdId+' [ \[*config*\] ]('+url+'_config) '+ //add hover info
                '*[ \[last script\] ]('+tempPath+tempName+')*\n\n'+msg;
            const contents=new vscode.MarkdownString('hover-exec:'+msg);
            contents.isTrusted = true;             //set hover links as trusted
            return new vscode.Hover(contents);     //and return it
          }
    }})()
  );
  context.subscriptions.push(vscode.commands.registerCommand("hover-exec.exec", () => {
      //preocess exec command (suggested shortcut Alt+/ ) -- find start of block and execute
      let editor = vscode.window.activeTextEditor;
      if (editor){
        let doc = editor.document;        //get document
        let pos = editor.selection.active;//and position
        cursLine=pos.line;cursChar=pos.character;    //when command was executed
        let n=getStartOfBlock(doc,pos);   //get start of codeblock
        if(n<0){return null;}             //if not in codeblock ignore
        pos=new vscode.Position(n,0);     //set position at start of block
        let line = doc.lineAt(pos);       //get command line contents
        if(executing){hUri.handleUri(vscode.Uri.parse('vscode://rmzetti.hover-exec?abort'));
          progress1('previous exec aborted',500);
          return;                         //if processing cancel job and ignore
        }
        setExecParams(context,doc,pos,line);//reset basic execute parameters
        cmdId=getCmdId(line.text);//command id, performs {...} changes
        let url='';
        let cmd1=cmdId.replace(/\s.*/,'');//check for predefined commands (nothing after a space)
        let script=config.get('scripts.'+cmd1); //json object if cmd1 is a 'built-in' script
        if(script){                       //predefined script engine strings
          cmdId=cmd1;
          cmd=replaceStrVars(script as string);//expand %f etc & get tempName
          codeBlock=getCodeBlockAt(doc,pos);       //save codeblock
          url='vscode://rmzetti.hover-exec?'+cmdId;//url as for hover-execute
        } else if(cmdId==='output') {
          deleteOutput(false);            //cursor in output block: delete the block
          return;
        } else if(oneLiner){
          cmd=line.text.slice(1).replace(/{.*}/,''); //remove {..} for start command
          cmd=replaceStrVars(cmd.slice(0,cmd.indexOf('`')).replace(/%20/mg,' '));//substitute %f etc
          cmdId='oneliner';             //set command for exec by hUri.handleUri
          url='vscode://rmzetti.hover-exec?oneLiner';
        } else {                          //other commands and one-liners
          line=doc.lineAt(cursLine);      //get line where command was executed  
          cmdId=cmdId.replace(/^>/,'');
          cmd=replaceStrVars(cmdId);
          codeBlock=getCodeBlockAt(doc,pos);    //save codeblock
          url='vscode://rmzetti.hover-exec?other'; //using url enables re-use of hover-execute code
        }
        hUri.handleUri(vscode.Uri.parse(url)); //execute codeblock via url
      }
  }));
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
      config=vscode.workspace.getConfiguration('hover-exec'); //update config if changed
  }));
  context.subscriptions.push(vscode.window.registerUriHandler(hUri));
  //finally to ensure scripts appear in settings.json
  let s={"undefined":undefined}; 
  let scripts=config.get('scripts');
  let merge=Object.assign({},scripts,s);
  config.update('scripts',merge,1);
  scripts=config.get('swappers');
  merge=Object.assign({},scripts,s);
  config.update('swappers',merge,1);

  // const hCommandId='time';
  // hStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	// hStatusBarItem.command = hCommandId;
	// context.subscriptions.push(hStatusBarItem);
} //end function activate

let hUri=new class MyUriHandler implements vscode.UriHandler { 
  //handle hover exec commands (command is in uri.query)
  async handleUri(uri: vscode.Uri): Promise<void | null | undefined> {
    nexec+=1;     //script exec number for check to ensure output is from latest script
    if (uri.query==='abort'){ //cancel has been clicked, kill executing task
        executing=false; ch.kill(); return; 
    }
    if (uri.query==='delete'){
        deleteOutput(false);//delete output codeblock
        return;
    }
    if (uri.query==='remove'){
        deleteOutput(true); //change output codeblock to text
        return;
    }
    if (uri.query==='ref'){
        needSwap=false;
        paste(refStr);     //paste into editor
        removeSelection();
        return; 
    }
    if (uri.query.endsWith('_config')){ 
        //show current script config in a script that can update it if required
        let s1=cmdId;
        let s2='';
        if(config.get('scripts.'+s1)){
          s2=JSON.stringify(config.get('scripts.'+s1));//stringify for output
        }
        else {
          s2='"put_start_command_here %f.txt"';
        } 
        out='```js :eval noInline\n'+     //output :eval is an exec script which will:
        '//this script can change, add or undefine a config setting\n'+
        'let s={"'+s1+'":'+s2+'};\n'+     //1. show current config, or an example
        '//let s={"'+s1+'":undefined}; //will undefine '+s1+'\n'+
        "let scripts=config.get('scripts');\n"+     //2. get current settings for all scripts
        "let merge=Object.assign({},scripts,s)\n"+  //3. update settings for current script
        "if(config.update('scripts',merge,1)){}";   //4. finally update hover-exec config. 
        needSwap=false; //ignore anything that looks like it is a swap
        paste(out);     //paste into editor as 'output :exec' script
        removeSelection();
        return;
    }
    let sCode=codeBlock;
    needSwap=inline && codeBlock.includes(swap);
    if(needSwap){
        let re=new RegExp('(.+'+swap+').*','mg');//regex finds previous results
        codeBlock=codeBlock.replace(re,'$1');    //remove them
        re=new RegExp('[-#%/ ]*'+swap,'mg'); //find any comment chars directly preceding the swap
        sCode=codeBlock.replace(re,swap);   //remove them
        re=new RegExp('^(.+)'+swap,'mg');   //regex finds swap lines, sets $1 to expr
        let re1=new RegExp('[`\'"]>>','');
        let swapper=config.get('swappers.'+cmdId) as string;
        if(swapper && !re1.test(sCode)){//replace all with swapper (uses $1)
          sCode=sCode.replace(re,swapper); 
        } else { //if no swapper defined replace all with $1
          sCode=sCode.replace(re,'$1'); 
        }
    }
    
    // function updateStatusBarItem(): void {
    //   const t = new Date().getTime();
    //   hStatusBarItem.text = `$(megaphone) ${(t-startTime)/1000}`;
    //   hStatusBarItem.show();
    // }
    
    vscode.window.withProgress({  //set up status bar exec indicator
      location: vscode.ProgressLocation.Window,
      title: 'Hover-exec'     //title for progress display
        },async progress =>{
        executing=true;       //set 'executing' flag
        let iexec=nexec;      //& save exec number for this script
        out='';               //reset output buffer
        // updateStatusBarItem();
        progress.report({message: 'executing'});//start execution indicator
        writeFile(tempPath+tempName,sCode);//saves code in temp file for execution
        process.chdir(currentFsPath);
        if(cmdId!==''){
          if (cmd==='eval'){      //eval: use vscode internal js
            sCode=sCode.replace(/console.log/g,'write');//provide a console.log for eval
            eval(sCode);      //execute codeblock with eval
          }
          else if(cmdId==='oneliner'){  //execute one-liner
            await execShell(cmd);//cmd is one-liner
            executing=false;  //exec complete  
            return;           //one-liners do not produce output
          }
          else { // getCmdId?
            out = await execShell(cmd);//execute all other commands
            if (cmdId==='buddvs'){out=out.replace(/�/g,'î');  } //for test scripter
          }
        } else {
          out=uri.toString(); //no ex, return uri
        }
        executing=false; //execution finished
        //output to both output file and editor
        //todo: {output=none} option to output only to file
        if(iexec===nexec){       //only output if this is the latest result
          writeFile(tempPath+tempName+'.out.txt',out); //write to output file
          out=out.replace(/\[object Promise\]\n*/g,'');  //remove in editor output
          if(out!==''){
            paste(out);     //paste into editor
            removeSelection();  //deselect
          }
          progress1('ok',500); //report successful completion
          //todo: silence this with {quiet} option
        };
        // hStatusBarItem.hide();
    });
  }
};//end hUri=new class MyUriHandler

function setExecParams(context:vscode.ExtensionContext,doc: vscode.TextDocument,
  pos: vscode.Position,line: vscode.TextLine){
    currentFile=doc.uri.path;    //current editor file full path /c:...
    currentFsFile=doc.uri.fsPath;//os specific currentFile c:\...  (%e)
    windows=currentFsFile.slice(1,2)===':'; //true if os is windows
    if(vscode.workspace.workspaceFolders){ 
      currentPath=vscode.workspace.workspaceFolders[0].uri.path+'/';
      currentFsPath=vscode.workspace.workspaceFolders[0].uri.fsPath;
      if(windows){currentFsPath+='\\';} else {currentFsPath+='/';}
    } else {alert('workspace undefined');}
    vscode.workspace.fs.createDirectory(context.globalStorageUri);  //create temp folder if necessary
    cmd='';             //reset code default start line
    startCode=pos.line; //save start of code line number
    tempName='temp.txt';//temp file name, can be used as (%n)
    tempPath=context.globalStorageUri.path+'/';     //temp folder path
    tempFsPath=context.globalStorageUri.fsPath;//temp folder path, %p
    if(windows){tempFsPath+='\\';} else {tempFsPath+='/';}
    needSwap=false;   //set true if in-line swaps required
} //end function setExecParams

function paste(text:string) {   //paste into editor
    const {activeTextEditor}=vscode.window;
    if(activeTextEditor && startCode>0){
      //remove 'object promise' messages in editor
      //if(cmdId==='eval'){text=text.replace(/\[object Promise\]/g,'');}
      if(needSwap){               //if doing in-line output
        let re1=new RegExp(swap+'\r?\n',''); //allows checking for swaps
        if(re1.test(codeBlock)){  //if there are any swaps
          //copy in-line results into the codeblock
          let re=new RegExp('>>.*?\r?\n','');//regex to remove swapped output line was ('^.*{{.*}}$','')
          while(re1.test(codeBlock)){   //while there is a swap string to replace
            let i=text.indexOf('>>')+2; //check if there is a swappable line
            if (i>0){                   //if so
              let s=text.slice(i).replace(/\n[\s\S]*/,'');
              if(s===''){s=';';}        //if the remainder is empty just provide ;
              codeBlock=codeBlock.replace(/=>>$/m,'=>>'+s); //do the swap
              text=text.replace(re,''); //remove the swapped output to clear for the next
            } else {break;}           //break when done
        }}
      }
      text=text.replace(/^\s*[\r\n]/,'').trimEnd();   //remove start blank line if any
      text=text.replace(/^```/mg,' ```');   //put a space in front of starting ```
      //if there is any output left, it will go into an ```output codeblock
      activeTextEditor.edit((selText)=>{
        selectCodeblock(false); //select codeblock to replace
        let lbl="```output\n"; //can start output with ``` to replace ```output
        if(text.startsWith(' ```')){text=text.slice(1);lbl='';}
        if(text===''){      //no more output
          if(needSwap){selText.replace(replaceSel,codeBlock+"```\n");}
        } else if(oneLiner || !needSwap){ //only producing an output block
          selText.replace(replaceSel,lbl+text+"\n```\n");
        } else {  //replace the codeblock text/output (ie. codeblock includes inline results)
          selText.replace(replaceSel,codeBlock+"```\n"+lbl+text+"\n```\n");
        }
      });
    }
} //end function paste

function write() {           //provide a console.log() for the eval block
    for (var i = 0; i < arguments.length; i++) {
      if(i>0){out+=' ';}
      out+=arguments[i];
    }
    out+='\n';
}

function getCmdId(s:string){ //get command from ```command line
    inline=!s.toLowerCase().includes('noinline');//allows normal use of =>>
    if(oneLiner){s=s.replace(/^`(.*?)`.*/,'$1');}//get backtick content
      else {s=s.slice(3);}       //or remove initial triple backtick
    //first check for switched cmdId (leave s for later)
    let s1=s.replace(/\s+/,' ')       // collapse spaces
            .replace(/\s(?!:).*/,''); // remove \s(not followed by :).*
    if(s1.includes(':')){  //check for command id switch, eg. ```js:eval
      s1=s1.slice(s1.indexOf(':')+1)
           .replace(/.*?\W.*/,'');
      if(s1!=='' && config.get('scripts.'+s1)){
        return s1;  //if it is a switched id, return it
      }
    }
    //back to s
    let ipos=posComment(s); //find comment in cmd line //,--,%%,##
    if(ipos>0){s=s.slice(0,ipos);}    //and remove it
    cmdId=s.replace(/{.*}/,'').trim();//return trimmed line as command
    return cmdId;
} //end function getCmdId

function getmsg(s:string){ //get message for hover from ```command line
    let msg='';
    if(oneLiner){s=s.slice(1).replace(/.*`/,'');} //oneliners use single backticks
    else {s=s.slice(3).replace(/.*```/,'');}       //remove triple backticks
    let ipos=posComment(s);         //find comment in command line
    if(ipos>0){msg=' '+s.slice(ipos);} //use comments in hover message
    for(i=msg.length;i<12;i++){msg+='&emsp;';}
    return msg;
}

function posComment(s:string){ //find start of any comment in command line
    let ipos=s.indexOf('<!--');//using any of these 'standard' comment indicators
    if(ipos<=0){ipos=s.indexOf('--');}
    if(ipos<=0){ipos=s.indexOf('//');}
    if(ipos<=0){ipos=s.indexOf('%%');}
    if(ipos<=0){ipos=s.indexOf('##');}
    return ipos;
}

function getTemp(s:string){
  if(s.includes('temp.')){ //get temp file name, eg from {temp=temp.py}
    tempName=s.slice(s.indexOf('temp.'))  
              .replace(/(.*?)[, }].*/,'$1') //get chars until space, comma or }
              .replace(/["']/g,'');         //remove quotes
  }
}

function replaceStrVars(s:string){ //replace %f etc with the appropriate string
  s=s.replace(/\\/g,'\\\\');
  getTemp(s); //check for explicit temp file name
  //alert(s);   //eg. "C:\Program Files\Notepad++\notepad++" %f
  if(/%[fp]\.\w/.test(s)){
    tempName='temp.'+s.replace(/.*%[fp]\.(\w*)\W?.*/,'$1');
    s=s.replace(/(%[fp])\.\w*(\W?)/,'$1$2');//remove ext spec
  }
  s=s.replace(/\/%f/g,tempPath+tempName) // /%f switches to /
     .replace(/\/%p/g,tempPath)          // /%p switches to /
     .replace(/\/%c/g,currentPath)       // /%c switches to /
     .replace(/\/%e/g,currentFile)       // /%e switches to /
     .replace(/%f/g,tempFsPath+tempName) //%f temp file path/name
     .replace(/%p/g,tempFsPath)          //%p temp folder path
     .replace(/%c/g,currentFsPath)       //%c current file path
     .replace(/%e/g,currentFsFile)       //%e current file path/name
     .replace(/%n/g,tempName);            //%n temp file name only
  return s;
}

function removeSelection(){ //deselect current selection
    const {activeTextEditor}=vscode.window;
    if(activeTextEditor){
      if(cursLine===0){
        replaceSel=new vscode.Selection(startCode,0,startCode,0);
      } else {
        replaceSel=new vscode.Selection(cursLine,cursChar,cursLine,cursChar);
      }
      activeTextEditor.selection=replaceSel;
    }
}

const execShell = (cmd: string) => //execute shell command (to start scripts) 
  new Promise<string>((resolve, reject) => {
      //alert('execshell '+cmd);
      ch=cp.exec(cmd, (err1, out1, stderr1) => {
        if (err1 && stderr1==='') {
          return resolve(out1+err1+','+stderr1);
        }
        return resolve(out1+stderr1);
      });
  }
);

async function writeFile(file:string,text:string) { //`text` to `file' (full path)
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
    if(activeTextEditor){
      let n=pos.line+1;
      if(oneLiner){ //return all after first space up to backtick
        //this is a oneliner with valid script id
        let s1=doc.lineAt(pos).text.slice(1);
        s1=replaceStrVars(s1.slice(s1.indexOf(' ')+1,s1.indexOf('`')));//.replace(/\\/g,'/');
        return s1;
      }
      if(doc.lineAt(pos).text.endsWith('```')) {
        return '';  //return empty string
      }
      while (n<doc.lineCount) {
        let a=doc.lineAt(new vscode.Position(n,0)).text;
        n++;
        if(a.startsWith('```')){
          break; //stop at line starting with ```
        } else {  //add line to code buffer
          s=s+a+'\n';
        }
      }
    }
    return s;
} //end function getCodeBlockAt

function selectCodeblock(force:boolean){ //select codeblock appropriately depending on type
    const {activeTextEditor}=vscode.window;
    if(activeTextEditor && startCode>0){
      const doc=activeTextEditor.document;
      let m=startCode;   //selection will be from lines m to n
      if(oneLiner){
        m++;//oneliner selection begins at 1st line after the command line
        if(m<doc.lineCount && doc.lineAt(new vscode.Position(m,0)).text.startsWith('```output')){
          let n=m;                  //if there is a following output section
          while (n<doc.lineCount) { //find the end of it
            n++;
            if(doc.lineAt(new vscode.Position(n,0)).text.startsWith('```')){
              replaceSel=new vscode.Selection(m,0,n+1,0);
              break;  
            } else if(n===doc.lineCount){
              replaceSel=new vscode.Selection(m,0,n,0);
            }
          }
        } else {
          replaceSel=new vscode.Selection(m,0,m,0);
        }
        activeTextEditor.selection=replaceSel;
      } else { //not a one-liner 
        let output=doc.lineAt(new vscode.Position(m,0)).text.startsWith('```output');
        //records when an output line reached
        if(force || output){ 
          n=m+1;    //output block selection starts at command line
        } else { 
          m+=1;n=m; //otherwise at the line after
        } 
        while (n<doc.lineCount) { //work through the block and look for end
          if(doc.lineAt(new vscode.Position(n,0)).text.startsWith('```')){
            if(n+1<doc.lineCount && 
              doc.lineAt(new vscode.Position(n+1,0)).text.startsWith('```output')){
                output=true;n++;//skip output line
                if(!needSwap){m=n;}
            } else { //not an output block start, so it is the end of the block
                n++; //move to the next line  //if no swap & not output then
                if(!needSwap && !output && !force){m=n;}//select pos just after block end
                break;
            }
          }
          n++;
        }
        replaceSel=new vscode.Selection(m,0,n,0);
        activeTextEditor.selection=replaceSel;
      }
    }
    return;
} //end function selectCodeblock

function deleteOutput(asText:boolean) { //delete output code block, or leave as text
    const {activeTextEditor}=vscode.window;
    if(activeTextEditor){
      selectCodeblock(true);
      if(asText){    //remove start and end lines, ie. with backticks
        let pos1=activeTextEditor.selection.start.line+1;
        let pos2=activeTextEditor.selection.end.line-1;;
        let sel=new vscode.Selection(pos1,0,pos2,0);
        activeTextEditor.edit((selText)=>{ 
          selText.replace(activeTextEditor.selection,activeTextEditor.document.getText(sel));
        });
      } 
      else {         //remove whole output block
        //alert('here '+activeTextEditor.selection.start.line.toString()+','+
        //  activeTextEditor.selection.end.line.toString());
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

