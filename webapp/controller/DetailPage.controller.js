sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], (Controller, MessageToast) => {
  "use strict";

  return Controller.extend("com.ordermanagement.ordermanagement.controller.DetailPage", {

    onInit: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("RouteDetailPage").attachPatternMatched(this._onRouteMatched, this);
    },
    
    _onRouteMatched: function (oEvent) {
        const oArgs = oEvent.getParameter("arguments");
        const sOrderNumber = oArgs.orderId; // assuming your route is configured with 'OrderNumber' as a parameter
        const oModel = this.getView().getModel(); // or this.getOwnerComponent().getModel()

        oModel.read("/Orders", {
            filters: [
                new sap.ui.model.Filter("OrderNumber", sap.ui.model.FilterOperator.EQ, sOrderNumber)
            ],
                success: (oData) => {
                    const aResults = oData.results;
                    if (aResults.length > 0) {
                        const aResult = aResults[0];

                    const oLocalModel = new sap.ui.model.json.JSONModel({
                        Order: aResult // wrap the single order object
                    });

                        // Set it to the view
                    this.getView().setModel(oLocalModel, "localOrders");
                    console.log(oLocalModel);

                    } else {
                        console.warn("No order found with OrderNumber:", sOrderNumber);
                    }
                },
                
                error: (err) => {
                    console.error("Read failed:", err);
                }
        });
    },



    onEdit: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteEditPage");
    },

    onCancel: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteOrderMainPage");
    },

  });
});