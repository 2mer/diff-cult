import { exit } from "process";
import { ShellGame } from "./Game";

const argv: {
	outDir: string,
	command?: string,
	bulkMode: boolean,
} = require('minimist')(process.argv.slice(2), { default: { outDir: process.cwd(), bulkMode: false } })

const game = new ShellGame(5, { command: argv.command, outDir: argv.outDir, bulkMode: argv.bulkMode });