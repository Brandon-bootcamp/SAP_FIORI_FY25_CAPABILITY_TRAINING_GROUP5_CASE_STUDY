sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.ordermanagement.ordermanagement.controller.DetailPage", {
        
onInit: function () {
//   var oModel = new sap.ui.model.json.JSONModel({
//     orderNumber: "012201",
//     createdOn: "01 Jan 2025",
//     receivingPlant: "9101 - Singapore",
//     deliveringPlant: "9102 - Malaysia",
//     status: "Created",
//     products: ""
//   });
//   this.getView().setModel(oModel, "orderModel");
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