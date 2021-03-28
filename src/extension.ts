import * as vscode from 'vscode';

let start_time : string;
let stop_time : string;
let date : string;
let filename : any; 
let started = false;

function get_hours() {
	let this_date = new Date();
	let hour = this_date.getHours();
	if (hour <= 9) {
		return '0' + hour;
	}
	else{
		return hour;	
	}	
}

function get_minutes() {
	let this_date  = new Date();
	let minutes = this_date.getMinutes();
	if (minutes <= 9) {
		return '0' + minutes;
	}
	else{
		return minutes;	
	}
}

function get_date() {
	let this_date = new Date();
	let day = this_date.getDate();
	let month = this_date.getMonth();
	let year = this_date.getFullYear();
	return day.toString() + '.' + month.toString() + '.' + year.toString();
}

function get_file() {
	let input = vscode.window.showInputBox();
	vscode.window.showInformationMessage('Enter file name');
	return input;
}

export function activate(context: vscode.ExtensionContext) {

	let stop = vscode.commands.registerCommand('workly.stop', () => {
				
		let hour = get_hours();
		let minutes = get_minutes();
		stop_time = hour.toString() + ':' + minutes.toString();

		vscode.window.showInformationMessage('Stopping time: ' + stop_time);
	
		async function file_name() {
			filename = await get_file();
			let to_append = date + ' Start: ' + start_time + ' Stop: ' + stop_time + "\n";
			
			let length = filename?.length;
			if ((filename[length - 1] === 't') && (filename[length - 2] === 'x') && (filename[length - 3] === 't') && (filename[length - 4] === '.')) {
				let fs = require('fs');
				fs.appendFile(filename, to_append, (err: any) => {
					if (err) {
						vscode.window.showErrorMessage(err);
					}
				});	
			}
			else {
				vscode.window.showErrorMessage('Not a file path!');
				vscode.commands.executeCommand('workly.stop');
			}
		}
		file_name();
	
	started = false;
	});

	let start = vscode.commands.registerCommand('workly.start', () =>{
		if (started === true)
		{
			vscode.commands.executeCommand('workly.stop');		
		}
		else {
			let hour = get_hours();
			let minutes = get_minutes();
			start_time = hour.toString() + ':' + minutes.toString();
			vscode.window.showInformationMessage('Starting time: ' + start_time);
			date = get_date();
			started = true;
		}
	});

	context.subscriptions.push(start);
}

// this method is called when your extension is deactivated
export function deactivate() {}
