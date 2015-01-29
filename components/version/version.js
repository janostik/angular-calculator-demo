'use strict';

angular.module('calcApp.version', [
  'calcApp.version.interpolate-filter',
  'calcApp.version.version-directive'
])

.value('version', '0.1');
