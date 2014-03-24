define([
	'jquery',
	'underscore',
	'backbone',

	'backendServiceM',
	'parser',

	'json!data/vingtiles.json'
	],
	function ($, _, Backbone, backendServiceM, Parser, vingtiles) {

		var ChartM = Backbone.Model.extend({
			events: {},
			fetched: false,
			defaults: {
				source: {},

				waterfall_data: {},
				locating_data: {},
				distribution_data: {},

				vingtiles: vingtiles,

				currentChartName: null,

				simulationInProgress: false
			},
			backendServiceM: backendServiceM,
			chartDecompositions: {
				'distribution': 'decompositions-multiples.xml'
			},
			chartAxes: {},
			initialize: function () {
				this.listenTo(this.backendServiceM, 'change:apiData', this.parse);
				this.listenTo(this.backendServiceM, 'change:formData', this.simulate);
				this.listenTo(this.backendServiceM, 'change:simulationInProgress', _.bind(function () {
					this.set('simulationInProgress', this.backendServiceM.get('simulationInProgress'));
				}, this));
			},
			parse: function () {
				this.fetched = true;
				this.set('source', $.extend(true, {}, this.backendServiceM.get('apiData')));
			},

			/* Overiding Backbone get method : Call custom get method if exists (can pass args) */
			get: function (attr, args) {
				if (typeof this['get_'+attr] == 'function') {
					return this['get_'+attr](args);
				}
				return Backbone.Model.prototype.get.call(this, attr);
			},

			/* Custom get methods */
			get_waterfallData: function () { /* Cleaned up, ungrouped and add parentNodes parentNodes attributes */
				var r = new Parser(this.get('source'))
								.clean()
								// .removeRootNode()
								.setParentNodes()
								.listChildren()
								.values();
				return r;
			},
			get_distributionData: function (args) {
				/* Par défault on renvoie la décomposition revdisp */
				args = args || {sort: 'revdisp'};
				var parser = new Parser(this.get('source'));

				if(args.sort == 'all') {
					args.sort = 'revdisp';
				}

				var _return = parser
					.clean()
					.setPositiveSort()
					.setDecompositionSort()
					.listChildren()
					.values();

				return _return;
			},
			get_locatingData: function () { /* Just cleaned up */
				return new Parser(this.get('source'))
							.clean()
							.values();
			},
			get_cleanData: function () {
				return new Parser(this.get('source'))
							.clean()
							.values();
			},
			changeChart: function (chartName) {
				this.simulate(chartName);
				this.set('currentChartName', chartName);
			},
			simulate: function (chartName) {
				chartName = chartName || this.get('currentChartName');
				var data = {};

				/* Simulate */
				if(this.chartDecompositions.hasOwnProperty(chartName)) {
					data.decomposition = this.chartDecompositions[chartName];
				}
				if(this.chartAxes.hasOwnProperty(chartName)) {
					data.axes = this.chartAxes[chartName];
				}
				this.backendServiceM.simulate(data);
			}
		});

		var chartM = new ChartM();
		return chartM;
	}
);
