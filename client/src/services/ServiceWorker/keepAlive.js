// ---------------------------------------------------------------------------
// SERVICEWORKER.JS
// ---------------------------------------------------------------------------

const CASPERDASH_KEEPALIVE_PORT = 'CASPERDASH_KEEPALIVE';

const nextSeconds = 25;
const SECONDS = 1000;
const DEBUG = process.env.NODE_ENV === 'development';

let alivePort = null;
let isFirstStart = true;
let isAlreadyAwake = false;
let timer;
let firstCall;

let wakeup = undefined;
let wCounter = 0;

const starter = `-------- >>> ${convertNoDate(
	Date.now(),
)} UTC - CasperDash Service Worker with HIGHLANDER DNA is starting <<< --------`;

console.info(starter);

// Start Highlander
letsStart();

// ----------------------------------------------------------------------------------------
function letsStart() {
	if (wakeup === undefined) {
		isFirstStart = true;
		isAlreadyAwake = true;
		firstCall = Date.now();

		timer = 300;

		wakeup = setInterval(Highlander, timer);
		console.info(`-------- >>> Highlander has been started at ${convertNoDate(firstCall)}`);
	}
}

chrome.runtime.onInstalled.addListener(async () => await initialize());

// Clears the Highlander interval when browser closes.
// This allows the process associated with the extension to be removed.
// Normally the process associated with the extension once the host browser is closed
// will be removed after about 30 seconds at maximum (from Chromium 110 up, before was 5 minutes).
// If the browser is reopened before the system has removed the (pending) process,
// Highlander will be restarted in the same process which will be not removed anymore.
chrome.windows.onRemoved.addListener(() => {
	wCounter--;
	if (wCounter > 0) {
		return;
	}

	// Browser is closing: no more windows open. Clear Highlander interval (or leave it active forever).
	// Shutting down Highlander will allow the system to remove the pending process associated with
	// the extension in max. 30 seconds (from Chromium 110 up, before was 5 minutes).
	if (wakeup !== undefined) {
		// If browser will be open before the process associated to this extension is removed,
		// setting this to false will allow a new call to letsStart() if needed
		// ( see windows.onCreated listener )
		isAlreadyAwake = false;
	}
});

chrome.windows.onCreated.addListener(async () => {
	let w = await chrome.windows.getAll();
	wCounter = w.length;
	if (wCounter == 1) {
		updateJobs();
	}
});

async function updateJobs() {
	if (isAlreadyAwake == false) {
		letsStart();
	}
}

// ---------------------------
// HIGHLANDER
// ---------------------------
async function Highlander() {
	if (alivePort == null) {
		alivePort = chrome.runtime.connect({ name: CASPERDASH_KEEPALIVE_PORT });

		alivePort.onDisconnect.addListener(() => {
			if (chrome.runtime.lastError) {
				if (DEBUG)
					console.info(
						`(DEBUG Highlander) Expected disconnect error. ServiceWorker status should be still RUNNING.`,
					);
			} else {
				if (DEBUG) console.info(`(DEBUG Highlander): port disconnected`);
			}

			alivePort = null;
		});
	}

	if (alivePort) {
		alivePort.postMessage({ content: 'ping' });

		if (chrome.runtime.lastError) {
			if (DEBUG) console.info(`(DEBUG Highlander): postMessage error: ${chrome.runtime.lastError.message}`);
		} else {
			if (DEBUG) console.info(`(DEBUG Highlander): "ping" sent through ${alivePort.name} port`);
		}
	}

	if (isFirstStart) {
		isFirstStart = false;
		setTimeout(() => {
			nextRound();
		}, 100);
	}
}

function convertNoDate(long) {
	let dt = new Date(long).toISOString();
	return dt.slice(-13, -5); // HH:MM:SS only
}

function nextRound() {
	clearInterval(wakeup);
	timer = nextSeconds * SECONDS;
	wakeup = setInterval(Highlander, timer);
}

async function initialize() {
	updateJobs();
}
// --------------------------------------------------------------------------------------
