
'use strict';

/*---------------------------------------------------------------------------*/
/* FieldChosenFacetController                                                   */

/**
 * Chosen Field Facet Controller. It renders a Chosen.js dropdown / selection box as needed. 
 * @param $scope Controller scope
 * @param SolrSearchService Solr search service
 */
function FieldChosenFacetController($scope,$rootScope, $attrs, $location, $q, $timeout, $route, $routeParams, $window, SolrSearchService) {
    // $scope,$rootScope, $attrs, $location, $route, $routeParams, $window, SolrSearchService
    //ori ($scope, $attrs, SolrSearchService)
    // parameters

    $timeout(function() {
        return $scope.$apply(function() {
            //return $scope.myPets.push('hamster');
        });
    }, 1000);

    var simulateAjax;

    simulateAjax = function(result) {
        var deferred, fn;

        deferred = $q.defer();
        fn = function() {
            return deferred.resolve(result);
        };
        $timeout(fn, 3000);
        
        return deferred.promise;
    };

    simulateAjax(['grooo', 'wowowowow', 'lakakalakakl', 'yadayada', 'insight', 'delve', 'synergy']).then(function(result) {
        return $scope.optionsFromQuery = result;
    });

    //$("#select-chosen").chosen();
 
    // facet selections are mutually exclusive
    $scope.exclusive = true;

    // the name of the query used to retrieve the list of facet values
    $scope.facetQuery = 'chosenFacetQuery';

    // the operator used when joining multiple facet queries
    $scope.facetQueryOperator = 'OR';

    // the list of facets
    $scope.facets = [];

    // the name of the field to facet
    $scope.field = '';

    // the list of facet values
    $scope.items = [];
    // the list of chosen facets 
    $scope.selectedItems = [];
    
    // the max number of items to display in the facet list
    $scope.maxItems = 30;

    // the name of the search query that we are faceting. we watch this query
    // to determine what to present in the facet list
    $scope.queryName = SolrSearchService.defaultQueryName;

    // a facet value from this set has been selected
    $scope.selected = false;

    // the url to the solr core
    $scope.source = undefined;

    //html tags list
    $scope.htmlTags =[ "a", "abbr", "acronym", "address", "applet", "area", "b", "base", "basefont", "bdo",
        "big", "blockquote", "body", "br", "button", "caption", "center", "cite", "code", "col", "colgroup",
        "dd", "del", "dfn", "dir", "div", "dl", "dt", "em", "embed","fieldset", "font", "form", "frame", "frameset",
        "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input",
        "ins", "isindex", "kbd", "label", "legend", "li", "link", "map","marquee", "menu", "meta", "noframes", "noscript",
        "object", "ol", "optgroup", "option", "p", "param", "pre", "q", "s", "samp", "script", "select", "small",
        "span", "strike", "strong", "style", "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th",
        "thead", "title", "tr", "tt", "u", "ul", "var", "class", "src", "href","page","id"];


    ///////////////////////////////////////////////////////////////////////////

    /**
     * Facet result
     * @param Value
     * @param Score
     */
    function FacetResult(Value, Score) {
        this.value = Value;
        this.score = Score;
    }


    /**
     * Handle update event. Get the query object then determine if there is a
     * facet query that corresponds with the field that this controller is
     * targeting.
     */
    $scope.handleUpdate = function() {
        // clear current results
        $scope.items = [];
        $scope.selected = false;
        var selected_values = [];
        // get the starting query
        var hash = ($routeParams.query || undefined);
        if (hash) {
            var query = SolrSearchService.getQueryFromHash(hash, $rootScope.appleseedsSearchSolrProxy);
        } else {
            var query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
        }
        
        // new query so that the select box isn't overwritten - get all the things 
        //query.setUserQuery("*:*");

        // if there is an existing query, find out if there is an existing
        // facet query corresponding to this controller's specified facet
        // field. if there is a match then set that value as selected in
        // our list
        var i = 0;
       
        // get the list of facets for the query
        var facet_query = SolrSearchService.getQuery($scope.facetQuery);
        var results = facet_query.getFacetCounts();
        if (results && results.hasOwnProperty('facet_fields')) {
            
            var facet_fields = results.facet_fields[$scope.field];
            
            for (i=0; i< facet_fields.length; i+=2) {
                var value = results.facet_fields[$scope.field][i];
                var count = results.facet_fields[$scope.field][i+1];
                var facet = new FacetResult(value,count);
                // add regardless - want it all there. 
                if($scope.htmlTags.indexOf(facet.value)=== -1){
                    $scope.items.push(facet);
                }
            }
        }

        //bind the chosen select boxes
        $scope.bindChosenSelectors();

    };

    /* When the multi-select changes add all items to selectedItems/ refresh list.*/
    $scope.changedValue = function(items) {
        $scope.selectedItems=[];
        for(var item in items){
            $scope.selectedItems.push(items[item]);
        }
    }   

    /**
     * Add the newly selected items / refresh the facet constraint list.
     * when the selectedItems changes.
     * @param newSelectedItems Newly selected items 
     * @param oldSelectedItems Previously selected items 
     */
    $scope.$watch('selectedItems', function(newSelectedItems,oldSelectedItems) {
        $scope.applyFacets(newSelectedItems);
    });

    /**
     * Separate applyFacets - applies the selected facets to the hash / query 
     */
    $scope.applyFacets = function(selectedItems){
        var query = SolrSearchService.getQuery($scope.queryName);
        if (query == undefined) {
            query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
        }

        var name = $scope.field;
        var emptyFacet = query.createFacet(name,""); // for removal
        if(selectedItems.length==0){
            query.addFacet(emptyFacet);
        } else {
            var values = "(";
            for(var selected in selectedItems){
                var operator = "";
                if(selectedItems.length>1 && selected>0) 
                    operator = " OR ";
                var value = operator+"(" + selectedItems[selected].value.replace(' : ', ' ').split(' ').join('*') + ")";
                values+=value;
            }
            values+=")";
            var facet = query.createFacet(name, values);
            query.addFacet(facet);
        }

        var hash = query.getHash();
        console.log(hash);
        $location.path(hash);
        $location.path(hash);
    }

    $scope.bindChosenSelectors = function(){
        //// what normally angular does with select, we are then using chosen 
        setTimeout(function () {
            $scope.handleUpdate();

            setTimeout(function () {
            //chill here while the results come back 
                $("#select-chosen-"+$scope.field).chosen();
                $("#select-chosen-"+$scope.field).trigger("chosen:updated");
                $("#select-chosen"+$scope.field).on('change', function(event, params) {
                    console.log(params);
                    console.dir( $(this).val());
                    if(params.deselected!=undefined && $(this).val()==null){
                        
                        console.dir($scope.selectedItems);
                        // = [];
                        //$scope.selectedItems.push(new FacetResult("*",0));
                        $scope.applyFacets($scope.selectedItems);
                        //$scope.handleUpdate();
                    }
                });
            }, 500);
        }, 500);
    }

    /**
     * Initialize the controller.
     */
    $scope.init = function() {
        // apply configured attributes
        for (var key in $attrs) {
            if ($scope.hasOwnProperty(key)) {
                $scope[key] = $attrs[key];
            }
        }
        // handle facet list updates
        
        $scope.facetQuery = $scope.field + "Query";
        $scope.$on($scope.facetQuery, function () {
            $scope.handleUpdate();
        });

        //bind the chosen select boxes
        $scope.bindChosenSelectors();
        
        // update the list of facets on route change
        $scope.$on("$routeChangeSuccess", function() {
            // create a query to get the list of facets
            var hash = ($routeParams.query || undefined);
            if (hash) {
                var query = SolrSearchService.getQueryFromHash(hash, $rootScope.appleseedsSearchSolrProxy);
            } else {
                query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
            }

            query.setUserQuery("*:*");
            query.setOption("facet", "true");
            query.setOption("facet.field", $scope.field);
            //query.setOption("facet.limit", $scope.maxItems);
            query.setOption("facet.mincount", "1");
            query.setOption("facet.sort", "count");
            query.setOption("rows", "0");
            query.setOption("wt", "json");
            SolrSearchService.setQuery($scope.facetQuery, query);
            SolrSearchService.updateQuery($scope.facetQuery);
        });
        
    };

    // initialize the controller
    $scope.init();

    
    return $scope.disabled = true;
}

// inject controller dependencies
FieldChosenFacetController.$inject = ['$scope', '$rootScope', '$attrs', '$location', '$q','$timeout', '$route', '$routeParams', '$window', 'SolrSearchService'];
