sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("casestudy.controller.detail", {
        
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
      MessageToast.show("Edit button pressed");
    },

onCancel: function () {
      MessageToast.show("Cancel button pressed");
      }  
      
    });
});