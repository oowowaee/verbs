angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("home.html","<h1>Navbar example</h1>\n<p>This example is a quick exercise to illustrate how the default, static and fixed to top navbar work. It includes the responsive CSS and HTML, so it also adapts to your viewport and device.</p>\n<p>To see the difference between static and fixed top navbars, just scroll.</p>\n<p>\n  <a class=\"btn btn-lg btn-primary\" href=\"../../components/#navbar\" role=\"button\">View navbar docs &raquo;</a>\n</p>");
$templateCache.put("index.html","{% load staticfiles %}\n\n<html>\n	<head>\n		<link rel=\"stylesheet\" type=\"text/css\" href=\"{% static \'css/style.css\' %}\" />\n		<script src=\"{% static \'js/vendors.min.js\' %}\" ></script>\n    <script src=\"{% static \'js/app.js\' %}\" ></script>\n	</head>\n	<body ng-app=\"verb\">\n    	<div ui-view></div>\n	</body>\n</html>\n");
$templateCache.put("login.html","<form name=\"loginForm\" novalidate ng-submit=\"login(loginForm)\">\n  <div ng-show=\"invalidLogin\">\n    Username not valid :(\n  </div>\n\n  <label class=\"item item-input\" ng-class=\"{\'has-errors\': loginForm.username.$invalid && loginForm.$submitted, \'no-errors\': loginForm.username.$valid}\">\n    <span class=\"input-label\">Username</span>\n    <input type=\"text\" name=\"username\" ng-model=\"authorization.username\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n  </label>\n       \n  <div class=\"error-container\" ng-show=\"loginForm.username.$error\" ng-messages=\"loginForm.username.$error\">\n    <div ng-messages-include=\"templates/errors.html\"></div>\n  </div>\n   \n  <label class=\"item item-input\" ng-class=\"{\'has-errors\': loginForm.password.$invalid && loginForm.$submitted, \'no-errors\': loginForm.password.$valid}\">\n    <span class=\"input-label\">Password</span>\n    <input type=\"password\" name=\"password\" ng-model=\"authorization.password\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n  </label>\n   \n  <div class=\"error-container last-error-container\" ng-show=\"loginForm.password.$error && loginForm.$submitted\" ng-messages=\"loginForm.password.$error\">\n    <div ng-messages-include=\"templates/errors.html\"></div> \n  </div>          \n \n  <button class=\"btn btn-primary\" type=\"submit\">\n    Sign In\n  </button>\n</form>");
$templateCache.put("nav.html","<!-- Static navbar -->\n<nav class=\"navbar navbar-default navbar-static-top\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">Verbs</a>\n    </div>\n    <div id=\"navbar\" class=\"navbar-collapse collapse\">\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li><a href=\"#about\">Practice</a></li>\n        <li><a href=\"#contact\">History</a></li>\n        <li uib-dropdown>\n          <a href=\"#\" uib-dropdown-toggle role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">User <span class=\"caret\"></span></a>\n          <ul class=\"dropdown-menu\">\n            <li><a href=\"#\">Login</a></li>\n            <li><a href=\"#\">Logout</a></li>\n            <li role=\"separator\" class=\"divider\"></li>\n            <li><a ui-sref=\"app.tenses\">Set Tenses</a></li>\n            <li><a ui-sref=\"app.verbs\">Set Verbs</a></li>\n          </ul>\n        </li>\n      </ul>\n    </div><!--/.nav-collapse -->\n  </div>\n</nav>\n\n<div class=\"container\">\n  <!-- Main component for a primary marketing message or call to action -->\n  <div class=\"jumbotron\">\n    <div ui-view=\"content\"></div>\n  </div>\n</div> <!-- /container -->");
$templateCache.put("tenses.html","<h3>Set Tenses</h3>\n");
$templateCache.put("verbs.html","<h1>Set Tenses</h1>\n");}]);