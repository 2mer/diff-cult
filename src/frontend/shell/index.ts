import { exit } from "process";
import { ShellGame } from "./Game";

const argv: {
	outDir: string,
	command: string,
} = require('minimist')(process.argv.slice(2), { defaults: { outDir: process.cwd() } })

if (!argv.command) {
	console.error("Please specifiy command (--command='your command')")
	exit(1);
}

const game = new ShellGame(5, { command: argv.command, outDir: argv.outDir });