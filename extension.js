// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const os = require('os');
const { Console } = require('console');


/**
 * @param {vscode.ExtensionContext} context
 */
function getMacSimulatorFolder(){
	var fs = require('fs');
	var files = fs.readdirSync('/Applications/');
	var currentVerison = 0;
	files.some(file => {
		fileString = file.toString();

		if(fileString === "Corona"){
			currentVerison = "Corona";
			return true;
		}
		if(fileString.includes("Corona")){
			var verison = Number(fileString.split("-")[1]);
			if(verison > currentVerison){
				currentVerison = verison;
			}
		}
	});
	if(currentVerison != 0 && currentVerison != "Corona"){
		return "Corona-"+currentVerison;
	}else if(currentVerison === "Corona"){
		return "Corona";
	}
	else{
		return null;
	}
}
function getWindowsFolder(){
	var fs = require('fs');
	if (fs.existsSync("C:\\Program Files\\Corona Labs\\Corona\\Corona Simulator.exe")) {
    return "C:\\Program Files\\Corona Labs\\Corona";
	}else{
		return "C:\\Program Files (x86)\\Corona Labs\\Corona";
	}

}
function activate(context) {

	console.log('Thank you for installing Solar2D VSCode Extension');

	let disposable = vscode.commands.registerCommand('extension.solar2D.launchProj', () => {
		const isWindows = () => Boolean(vscode.env.appRoot && vscode.env.appRoot[0] !== "/");
		var workspaceFolder
		vscode.workspace.workspaceFolders?.map(folder =>workspaceFolder = folder.uri.path)
		var term = vscode.window.createTerminal();
		term.show();
		if(workspaceFolder){
			if(os.type() === "Windows_NT"){
				workspaceFolder = workspaceFolder.replaceAll('/', '\\');
				workspaceFolder = workspaceFolder.replaceAll('\\c:', 'C:');
				term.sendText(`cmd /c '"`+getWindowsFolder()+`\\Corona Simulator.exe" -debug -no-console "`+workspaceFolder+`\\main.lua"'  *>&1 | Out-Default`);
			}else if(os.type() === "Darwin"){ //Mac
				workspaceFolder = workspaceFolder.replaceAll('\ ', '\\ ');
				var simFolder = getMacSimulatorFolder();
				if(simFolder == null){
					vscode.window.showInformationMessage('Solar2D Sim not found');
				}else{
					term.sendText(`"/Applications/`+simFolder+`/Corona Simulator.app/Contents/MacOS/Corona Simulator" `+workspaceFolder+" -no-console yes -debug yes")
				}
			}else{
				vscode.window.showInformationMessage('Unknown OS');
			}
		}else{
			vscode.window.showInformationMessage('Project not found');
		}


	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('extension.solar2D.launchProjConsole', () => {
		const isWindows = () => Boolean(vscode.env.appRoot && vscode.env.appRoot[0] !== "/");
		var workspaceFolder
		vscode.workspace.workspaceFolders?.map(folder =>workspaceFolder = folder.uri.path)
		var term = vscode.window.createTerminal();
		term.show();
		if(workspaceFolder){
			if(os.type() === "Windows_NT"){
				term.sendText(`echo "You cannot view console output in VS Code and view console output in Corona Console on Windows"`);
				workspaceFolder = workspaceFolder.replaceAll('/', '\\');
				workspaceFolder = workspaceFolder.replaceAll('\\c:', 'C:');
				term.sendText(`& "`+getWindowsFolder()+`\\Corona Simulator.exe" "`+workspaceFolder+`\\main.lua"`);
			}else if(os.type() === "Darwin"){ //Mac
				var simFolder = getMacSimulatorFolder();
				workspaceFolder = workspaceFolder.replaceAll('\ ', '\\ ');
				if(simFolder == null){
					vscode.window.showInformationMessage('Solar2D Sim not found');
				}else{
					term.sendText(`"/Applications/`+simFolder+`/Corona Simulator.app/Contents/MacOS/Corona Simulator" `+workspaceFolder+" -debug yes")
				}
			}else{
				vscode.window.showInformationMessage('Unknown OS');
			}
		}else{
			vscode.window.showInformationMessage('Project not found');
		}


	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('extension.solar2D.searchDocs', () => {
		var editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}
		var selection = editor.selection;
		var text = editor.document.getText(selection);
		if(text){
			vscode.env.openExternal(vscode.Uri.parse('https://cse.google.com/cse?cx=009283852522218786394%3Ag40gqt2m6rq&ie=UTF-8&q='+encodeURI(text)));
		}else{
			vscode.window.showInformationMessage('No text selected');
		}



	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}
