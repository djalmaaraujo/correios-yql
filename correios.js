/**
 * Correios lib @djalmaaraujo
 * A very simple example using YQL with brazil.correios API
 *
 */

Correios = (function() {
		
		this.Opts = {
			/**
			 * Target click
			 *
			 */
			targetClick: '.correios-add-track',

			/**
			 * Target Results container
			 *
			 */
			resultsContainer: '.correios-results-container',

			/**
			 * Target Clear Click
			 *
			 */
			targetClearClick: '.correios-clear',

			/**
			 * API YQL URL
			 *
			 */
			api: 'http://query.yahooapis.com/v1/',

			/**
			 * Return data format (JSON, XML)
			 *
			 */
			format: 'json',

			/**
			 * Actual tracking code
			 *
			 */
			trackingNow: '',
		};

		return {
			/**
			 * Prompt user to type a code
			 *
			 */
			addTrack: function() {
				var trackCode = prompt("Type track code in input: ", "SK267949217BR");
				var format 		= Opts.format;
				var callback 	= 'Correios.printResults';
				var urlExtras = '&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=' + callback;
				var sql 			= "select%20*%20from%20brazil.correios.encomendas%20where%20numero%20%3D%20'" + trackCode + "'";
				var url 			= Opts.api + 'public/yql?format=' + format + '&q=' + sql + urlExtras;
				Opts.trackingNow = trackCode;
				this.loading();
				this.getData(url);
			},

			/**
			 * printResults on some container
			 *
			 */
			printResults: function(data) {
				if (data.query.results) {
					var obj = this;
					var statues = data.query.results.status;
					var titleBox = $('<h3 />').text('Tracking: ' + Opts.trackingNow);
					$(Opts.resultsContainer).html('').append(titleBox);
					statues.reverse();
					$.each(statues, function() {
						var track = this;
						var trackBox = $('<div />').html('<ul><li class="datetime">Data/Hora: ' + track.data + '</li><li class="correios-details">Detalhes: ' + track.detalhes + '</li><li class="correios-place">Local: ' + track.local + '</li><li class="correios-situation">Situação: ' + track.situacao + '</li></ul>');
						$(Opts.resultsContainer).append(trackBox);
					});
				} else {
					var trackBox = $('<p />').html('<strong>Código inválido/serviço indisponível no momento.</strong>');
					$(Opts.resultsContainer).html('').append(trackBox);
				}
			},

			/**
			 * Clear results
			 *
			 */
			clear: function() {
				$(Opts.resultsContainer).html('');
			},

			/**
			 * Load external js file 
			 *
			 */
			getData: function(url) {
				$.getScript(url);
			},
			
			/**
			 * Get option from local options
			 *
			 */
			getOption: function(option) {
				return eval('Opts.' + option + ';');
			},
			
			loading: function(status) {
				$(Opts.resultsContainer).html('').append('<p><strong>Loading, please wait for CORREIOS response..</strong></p>');
			}
	}
})();

/**
 * Handlers
 *
 */
$(function() {	
	$(Correios.getOption('targetClick')).click(function() {
		Correios.addTrack();
	});
	
	$(Correios.getOption('targetClearClick')).click(function() {
		Correios.clear();
	});
});