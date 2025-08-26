sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.ordermanagement.ordermanagement.controller.DetailPage", {
        
onInit: function () {
      const oRouter = this.getOwnerComponent().getRouter();
  oRouter.getRoute("RouteDetailPage").attachPatternMatched(this._onRouteMatched, this);
},

_onRouteMatched(oEvent) {
  const orderId = oEvent.getParameter("arguments").orderId;
  const oModel = this.getView().getModel();
 
  // Assuming /Orders is your collection
  const selectedOrder = oModel.getProperty("/Orders").find(order => order.OrderNumber === orderId);
 
  if (selectedOrder) {
    this.getView().setModel(new sap.ui.model.json.JSONModel(selectedOrder), "selectedOrder");
  }
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