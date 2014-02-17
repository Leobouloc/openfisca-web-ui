define([
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'sticky',

	'WaterfallChartV',
	'LocatingChartV',
	],
	function ($, _, Backbone, d3, sticky, WaterfallChartV, LocatingChartV) {
		var AppV = Backbone.View.extend({
			el: '#chart-wrapper',
			events: {},

			width: 980,
			height: 500,

			initialize: function () {
				console.info('AppView initialized');
				/* Init svg */
				this.svg = d3.select(this.el).append('svg')
					.attr('width', this.width)
					.attr('height', this.height);
				this.$el.sticky();
			},
			render: function (args) {
				var args = args || {};

				switch(args.chart) {
					case 'detail':
						if(_.isUndefined(this.detailChart)) this.detailChart = new WaterfallChartV(this);
						else this.$el.html(this.detailChart.render().$el);

						break;
					case 'locating':
						if(_.isUndefined(this.locatingChart)) this.locatingChart = new LocatingChartV(this);
						else this.$el.html(this.locatingChart.render().$el);

						break;
					default:
						console.error('_Error : No chart selected when called AppV.render');
				};
				return this;
			}
		});
		var appV = new AppV();
		return appV;
	}
);
