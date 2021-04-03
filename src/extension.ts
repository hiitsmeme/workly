import * as vscode from 'vscode';
import * as Exceljs from 'exceljs';

let start_time : string;
let stop_time : string;
let date : string;
let filename : any;
let log : any; 
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
	vscode.window.showInformationMessage('Enter file path (.xlsx or .txt)');
	return input;
}

function get_log() {
	let input = vscode.window.showInputBox();
	vscode.window.showInformationMessage('Enter log (voluntary)');
	return input;
}

export function activate(context: vscode.ExtensionContext) {

	let stop = vscode.commands.registerCommand('workly.stop', () => {		
		let hour = get_hours();
		let minutes = get_minutes();
		stop_time = hour.toString() + ':' + minutes.toString();

		vscode.window.showInformationMessage('Stopping time:' + stop_time);
	
		async function file_name() {
			let checked = false;
			filename = await get_file();
			log = await get_log();
			let to_appendLog = date + '    Start: ' + start_time + '    Stop: ' + stop_time + '    Log: ' + log +"\n";
			let to_append = date + '    Start: ' + start_time + '    Stop: ' + stop_time + "\n";
			
			let length = filename?.length;
			let lengthLog = log?.length;
			if (checked === false) {
				if ((filename[length - 1] === 't') && (filename[length - 2] === 'x') && (filename[length - 3] === 't') && (filename[length - 4] === '.')) {
					let fs = require('fs');
					if (lengthLog < 1) {
						fs.appendFile(filename, to_append, (err: any) => {
							if (err) {
								vscode.window.showErrorMessage(err);
							}
						vscode.window.showInformationMessage('Appended.');
						});	
					}
					else {
						fs.appendFile(filename, to_appendLog, (err: any) => {
							if (err) {
								vscode.window.showErrorMessage(err);
							}
						vscode.window.showInformationMessage('Appended.');
						});
					}
				};

				if ((filename[length - 1] === 'x') && (filename[length - 2] === 's') && (filename[length - 3] === 'l') && (filename[length - 4] === 'x') && (filename[length - 5] === '.')) {
					const workbook = new Exceljs.Workbook;
					await workbook.xlsx.readFile(filename);
					const sheet = workbook.worksheets[0];
					sheet.columns = [
						{ header: 'Date', key: 'date', width: 20 },
						{ header: 'Start', key: 'start', width: 20},
						{ header: 'Stop', key: 'stop', width: 20},
						{ header: 'Log', key: 'log', width: 100}
					];
					sheet.addRow({date: date, start: start_time, stop: stop_time, log: log});
					await workbook.xlsx.writeFile(filename);
					vscode.window.showInformationMessage('Appended');
				};
			}
			else {
				vscode.window.showErrorMessage('Not a valid file path! Make sure to use a .txt file!');
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
