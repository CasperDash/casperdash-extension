/* eslint-disable no-console */
import '@testing-library/jest-dom/extend-expect';
import 'jest-extended';
import 'mockzilla-webextension';
import { TextEncoder, TextDecoder } from 'util';

jest.mock("nanoid", () => { return {
	nanoid : ()=>{}
} });

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.console = {
	log: console.log,
	error: jest.fn(),
	warn: jest.fn(),
	info: jest.fn(),
};

global.navigator.clipboard = { writeText: jest.fn() };
Object.assign(global, require('jest-chrome'));

// global.crypto = {
// 	getRandomValues: function (array = 8) {
// 		for (let i = 0; i < array.length; i++) {
// 			array[i] = Math.floor(Math.random() * Math.floor(256));
// 		}
// 	},
// };
