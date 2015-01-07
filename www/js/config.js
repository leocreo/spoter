angular.module('spoter.config', [])
	.constant("appConfig", {
		appCodName: 'spoter',
		appName: 'Tu guía',
		appVersion: '1.0',
		api: {
			endpoint: 'http://spoter-server'
		}
	});