/**
 * This file is subject to the terms and conditions defined in the
 * 'LICENSE.txt' file, which is part of this source code package.
 */

'use strict';

/*---------------------------------------------------------------------------*/
/* Application                                                               */

var app = angular.module('solr-ajax', ['ngRoute', 'SearchHints','Autocomplete', 'TextFilters', 'Solr', 'Utils','ngSanitize','countTo','localytics.directives']);

/**
 * Define application routes.
 * @see http://www.bennadel.com/blog/2420-Mapping-AngularJS-Routes-Onto-URL-Parameters-And-Client-Side-Events.htm
 */
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/:query', { event: "/query" }).
        otherwise({ event: "/" });
}])
.run(function($rootScope) {
	$rootScope.appleseedsSearchSolrProxy = "https://api.beefsafetyresource.com/solr";
    $rootScope.siteDomainPath = "http://url.org";
    // the current webpage's hostname/ what is sent to solr as a filter query 
    $rootScope.siteDomainHostname = $rootScope.siteDomainPath.substring(7,$rootScope.siteDomainPath.length);
    // what gets shown on the html before the relative path. 
    $rootScope.siteDomainAlias = "stg.url.org";
});
