sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
 
    return Controller.extend("com.ordermanagement.ordermanagement.controller.DetailPage", {
 
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetailPage").attachPatternMatched(this._onObjectMatched, this);
 
        },
 
        _onObjectMatched: function (oEvent) {
            var sOrderNumber = oEvent.getParameter("arguments").orderId;
            var sPath = "/Orders(" + sOrderNumber + ")";
            console.log(sPath);
            this.getView().bindElement({
                path: sPath
            });       
        },
 
        onEdit: function (oEvent) {
            const selectedOrder = oEvent.getSource().getBindingContext().getObject();
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteEditPage", {
                orderId: selectedOrder.OrderNumber
            });
        },
 
        onCancel: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteOrderMainPage");
        }
 
    });
});