(function(module) {
  'use strict';

  /**
   * @ngdoc service
   * @name
   * @kind
   * @module
   *
   * @description
   * The `` service.
   */
  function repeatParser($parse) {
    var self = this;

    /**
     * Example:
     * expression = "address in addresses | filter: {street: $select.search} track by $index"
     * itemName = "address",
     * source = "addresses | filter: {street: $select.search}",
     * trackByExp = "$index",
     */
    self.parse = function(expression) {

      var match = expression.match(/^\s*(?:([\s\S]+?)\s+as\s+)?([\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

      if (!match) {
        throw "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.";
      }

      return {
        itemName: match[2], // (lhs) Left-hand side,
        source: $parse(match[3]),
        trackByExp: match[4],
        modelMapper: $parse(match[1] || match[2])
      };

    };

    self.getGroupNgRepeatExpression = function() {
      return '$group in $select.groups';
    };

    self.getNgRepeatExpression = function(itemName, source, trackByExp, grouped) {
      var expression = itemName + ' in ' + (grouped ? '$group.items' : source);
      if (trackByExp) {
        expression += ' track by ' + trackByExp;
      }
      return expression;
    };
  }

  module.service('RepeatParser', repeatParser);
})(angular.module('angularTestApp'));
