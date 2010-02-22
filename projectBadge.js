// Project Badge Widget
// Adam Kahtava - http://adam.kahtava.com/ - MIT Licensed
var projectBadge = function () {
	
  var serviceUri = 'http://adam.kahtava.com/services/open-source/projects.json';
  var accounts = '?project-host:username=';
  var filters = '&filters=';
  var template = '\
    <b>My Projects (<a href="http://code.google.com/u/<%= googleCode %>">Google</a>, <a href="http://github.com/<%= gitHub %>">GitHub</a>)</b>\
    <ul>\
      <% for ( var i = 0; i < projects.length; i++ ) { %>\
        <li class="<%= ((projects[i].Url.indexOf("github") !== -1) ? "github" : "google-code") %><%= (i % 2 == 1 ? " even" : "") %>">\
          <a href="<%= projects[i].Url %>"><%= projects[i].Name %></a>\
          <div class="extended">\
            <span class="description"><%= projects[i].Description %></span>\
            <span class="last-commit">Last commit: <%= projects[i].LastMessage %> <em>- <%= projects[i].LastModified %></em></span>\
          </div>\
        </li>\
      <% } %>\
    </ul>\
    <span class="credits"><a href="http://github.com/AdamDotCom/project-badge">Project badge</a> by <a href="http://AdamDotCom.com">AdamDotCom</a></span>\
    ';
  
  return {
    load: function (account, options) {
      if(account.gitHub){
        accounts = accounts + 'github:' + account.gitHub + ',';
      }
      if(account.googleCode){
        accounts = accounts + 'googlecode:' + account.googleCode + ',';
      }
      if(options && options.filters){
        filters = filters + options.filters;
      }
      
      $.getJSON(serviceUri + accounts + filters + '&callback=?', function(data) {      

        var projectsBadge = $('#project-badge');

        projectsBadge.html(projectBadge.renderTemplate(template, { gitHub: account.gitHub, googleCode: account.googleCode, projects : data }));
    
        var projectsList = projectsBadge.find('ul');
        var projects = projectsList.find('li');
        
        projects.bind('mouseenter', function() {
          projects.removeClass('entered');
          $(this).addClass('entered');
          projectsList.addClass("entered");
        });
        
        projects.bind('mouseleave', function() {
          projects.removeClass('entered');
          projectsList.removeClass("entered");
        });
      });
    }
  }
}();
 
// Yanked from: http://ejohn.org/blog/javascript-micro-templating/
//
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
  
  projectBadge.renderTemplate = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] :
      
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();