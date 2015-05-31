define([
    "app",
    "tpl!apps/sidenav/list/templates/list.tpl",
    "tpl!apps/sidenav/list/templates/list_item.tpl"
  ], function(VirtualDojo, listTpl, listItemTpl){

    VirtualDojo.module("SidenavApp.List.View", function(View, VirtualDojo, Backbone, Marionette, $, _){
      View.Sidenav = Marionette.ItemView.extend({
        template: listItemTpl,
        tagName: "li",

        events: {
          "click a": "navigate"
        },

        navigate: function(e){
          e.preventDefault();
          this.trigger("navigate", this.model);
        },

        onRender: function(){
          if(this.model.selected) {
            this.$el.addClass("active");
          };
        }     
      });
      
      View.Menu = Marionette.CompositeView.extend({
        template: listTpl,
        className: "navbar navbar-inverse navbar-fixed-top",
        childView: View.Sidenav,
        childViewContainer: "ul",
        events: {
          "click a.brand": "brandClicked"
        },

        brandClicked: function(e) {
          e.preventDefault();
          this.trigger("brand:clicked");
        }
      });
    });
    console.log(VirtualDojo.SidenavApp)

    return VirtualDojo.SidenavApp.List.View;

})