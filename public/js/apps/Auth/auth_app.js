define([
    "app",
    "apps/Auth/auth_controller",
    "utilities/utilities"
  ],
  function(VirtualDojo, AuthController, Utilities) {
    VirtualDojo.module("AuthApp", function(AuthApp, VirtualDojo, Backbone, Marionette, $, _){
      AuthApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
          "login": "showLoginPage",
          "signup": "showSignUpPage",
          "logout": "logout"
        }
      });
     
      var API = {
        showLoginPage: function(){
          AuthController.showLoginPage();
        },

        showSignUpPage: function() {
          AuthController.showSignUpPage();
        },

        login: function(data) {
          AuthController.authenticate(data.username, data.password, data.unauthorized);
        },

        signup: function(data) {
          AuthController.signup(data.username, data.password, data.whenDone)
        },

        logout: function() {
          AuthController.logout();
        }
      };

      VirtualDojo.on("authenticate:init", function(userdata){
        console.log("authenticate initializing");
        //Make empty ajax GET
        require(["entities/auth"], function() {
          var checkAuth = VirtualDojo.request("entities:auth:checkAuth");
          checkAuth
            .done(function(data){
              //means cookie is respected, authorized
              console.log('Successful AJAX request to server.', data)
              if (data.isAuthed) {
                // store the username on global object
                UTConfig.username = data.username;

                VirtualDojo.Utilities.enterApplication();

              } else {
                VirtualDojo.trigger("auth:login:show");
              }
            })
        }); // end of require block
      });

      VirtualDojo.on("auth:login:show", function(){
    		API.showLoginPage();
      });

      VirtualDojo.on("auth:signup:show", function(){
        API.showSignUpPage();
      });

      VirtualDojo.on("authenticate:login", function(data) {
        API.login(data);
      });

      VirtualDojo.on('authenticate:signup', function(data) {
        API.signup(data);
      });

      VirtualDojo.on("authenticate:logout", function(){
        API.logout();
      });

      AuthApp.on("start", function(){
        new AuthApp.Router({
    	    controller: API
        });
      });
    });
    return VirtualDojo.AuthApp;
  }
);
