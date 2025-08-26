sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.ordermanagement.ordermanagement.controller.DetailPage", {
        
onInit: function () {
      },

onEdit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteEditPage");
    },

onCancel: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteOrderMainPage");
      }  
      
    });
});