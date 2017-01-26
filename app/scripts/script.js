/* global window,Firebase */
'use strict';

var iframe = window.document.getElementsByTagName('iframe')[0],
	secretInput = window.document.getElementById('secret'),
	windowRef;

function windowClose() {
	if (window.device) {
		if (windowRef) {
			windowRef.close();
		}
	} else {
		window.document.getElementsByClassName('iframeWrap')[0].style.display = 'none';
	}
}

function windowOpen(url) {
	windowClose();
	windowRef = window.open(url, 'test', 'status=no,location=no');
}

function windowOpenSimple(url) {
	windowRef = window.open(url, '_blank', 'status=no,location=no,toolbar=no');
}

function windowOpenExecute(url) {
	if (windowRef) {
		windowRef.executeScript({
			code: 'window.location = "' + url + '"'
		}, function () {});
	} else {
		windowRef = window.open(url, '_blank', 'status=no,location=no,toolbar=no');
		windowRef.addEventListener('exit', function () {
			windowRef = undefined;
		});
	}
}

function windowOpenSmart(url) {
	if (windowRef) {
		windowRef.executeScript('alert("' + url + '")', function () {
			alert('done');
		});
	} else {
		windowRef = window.open(url, 'test', 'status=no,location=no');
	}
}

function childBrowserOpen(url) {
	window.plugins.childBrowser.close();

	window.setTimeout(function () {
		window.plugins.childBrowser.showWebPage(url, {
			showAddress: true,
			showLocationBar: true,
			showNavigationBar: true
		});
	}, 1000);
}

function openWindow(url) {
	if (window.device) {
		switch (window.device.platform) {
		case 'iOS':
		case 'WinCE':
		case 'Win32NT':
			windowOpenSimple(url);
			break;
		case 'Android':
			windowOpenExecute(url);
			break;
		}
	} else {
		iframe.src = url;
		window.document.getElementsByClassName('iframeWrap')[0].style.display = 'block';
	}
}

function log(message) {
	var errorLog = window.document.getElementById('log');
	var someChildObject = document.createElement('li');
	someChildObject.innerHTML = message;
	errorLog.insertBefore(someChildObject, errorLog.firstChild);
	if (errorLog.childNodes.length > 20) {
		errorLog.removeChild(errorLog.childNodes[errorLog.childNodes.length - 1]);
	}
}

function logError(message) {
	log(message);
	windowClose();
}

function logWarning(message) {
	log(message);
}

function setStyle(platform) {
	var p = 'android';
	switch (platform) {
	case 'iOS':
		p = 'ios';
		break;
	case 'WinCE':
	case 'Win32NT':
		p = 'win';
		break;
	case 'Android':
		p = 'android';
		break;
	}
	var style = document.createElement('link');
	style.type = 'text/css';
	style.rel = 'stylesheet';
	style.href = 'bower_components/chocolatechip-ui/chui/chui.' + p + '-3.0.3.min.css';
	window.document.getElementsByTagName('head')[0].appendChild(style);
}

function connect() {
	logWarning('Passphrase is set, good, connecting...');
	var secret = secretInput.value;
	var myRootRef = new Firebase('https://browsync.firebaseIO.com/views/');
	var urlRef = myRootRef.child(secret);
	urlRef.on('value', function (snapshot) {
		if (snapshot.val() === null) {
			logError('There is no page registered with this passphrase. Open BrowSync Chrome Extension and type in "' + secret + '" as passphrase.');
		} else {
			var url = snapshot.val().url;
			if (!url) {
				logError('Url is empty!');
			} else if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
				logError('Hey, where is http or https? What is: ' + url);
			} else {
				logWarning('Opening ' + url);
				openWindow(url);
			}
		}
	}, function () {
		logError('There is no page registered with this passphrase. Open BrowSync Chrome Extension and type in "' + secret + '" as passphrase.');
	});
}

function cancellCountDown(countDown) {
	window.document.getElementById('countdown').textContent = '';
	window.clearInterval(countDown);
}

function onDeviceReady() {
	setStyle(window.device && window.device.platform);

	if (window.localStorage.getItem('secret')) {
		secretInput.value = window.localStorage.getItem('secret');
	}

	if (window.localStorage.getItem('secret')) {
		var leftSeconds = 3;
		var countDown = window.setInterval(function () {
			window.document.getElementById('countdown').textContent = '(' + leftSeconds + ')';
			if (leftSeconds === 0) {
				connect();
			} else if (leftSeconds < 0) {
				window.clearInterval(countDown);
				window.document.getElementById('countdown').textContent = '';
			}
			leftSeconds--;
		}, 1000);

		secretInput.addEventListener('input', function () {
			cancellCountDown(countDown);
		}, false);

		secretInput.addEventListener('click', function () {
			cancellCountDown(countDown);
		}, false);

	}

	secretInput.addEventListener('input', function () {
		window.localStorage.setItem('secret', secretInput.value);
	}, false);
}

if (window.document.URL.indexOf('app://') === 0) {
	onDeviceReady();
} else if (window.document.URL.indexOf('http') === -1) {
	document.addEventListener('deviceready', onDeviceReady, false);
} else {
	onDeviceReady();
}