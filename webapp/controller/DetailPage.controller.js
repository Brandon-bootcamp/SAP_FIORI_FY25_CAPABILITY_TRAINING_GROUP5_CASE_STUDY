sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("com.ordermanagement.ordermanagement.controller.DetailPage", {

        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetailPage").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            const sOrderNumber = oEvent.getParameter("arguments").orderId;
            const oModel = this.getView().getModel();

            // Read the specific Order and expand Products
            oModel.read(`/Orders(${sOrderNumber})`, {
                urlParameters: {
                    "$expand": "Products"
                },
                success: (oData) => {
                    const oLocalModel = new JSONModel({
                        Order: oData,
                        Products: oData.Products || []
                    });
                    this.getView().setModel(oLocalModel, "localOrders");
                    console.log(oLocalModel);
                },
                error: (err) => {
                    console.error("Failed to fetch order details:", err);
                }
            });
        },

        onEdit: function (oEvent) {
            const oRouter = this.getOwnerComponent().getRouter();
            const oLocalModel = this.getView().getModel("localOrders");
            const selectedOrder = oLocalModel.getProperty("/Order");

            if (selectedOrder && selectedOrder.OrderNumber) {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteEditPage", {
                    orderId: selectedOrder.OrderNumber
                });
            } else {
                console.warn("Order data not available in local model.");
            }
        },

        onCancel: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteOrderMainPage");
        }

    });
});