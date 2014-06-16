'use strict';

var Backbone = require('backbone');

var chartsM = require('./models/chartsM');

var appconfig = global.appconfig;


var enableLocatingChart = appconfig.enabledModules.locatingChart;
var router = null;
var routes = {
  '*chartSlug': 'chart',
};
if (enableLocatingChart) {
  routes.locating = 'locatingChart';
}

var Router = Backbone.Router.extend({
  routes: routes,
  initialize: function () {
    Backbone.history.start();
  },
  chart: function (chartSlug) {
    if (chartSlug === null) {
      chartSlug = enableLocatingChart ? 'revdisp' : 'waterfall';
    }
    chartsM.set('currentChartSlug', chartSlug);
  },
});

function init() {
  if (router === null) {
    router = new Router();
  }
  return router;
}

module.exports = {init: init};
