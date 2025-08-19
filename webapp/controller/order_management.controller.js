sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("casestudy.controller.order_management", {
        onInit: function () {
            const oModel = new JSONModel({ orders: [] });
            this.getView().setModel(oModel);
        },

        onFilter: function () {
            const oBundle = this.getView().getModel("i18n").getResourceBundle();
            const orderValue = this.byId("orderNumberInput").getValue();
            const dateValue = this.byId("creationDateInput").getValue();
            const statusValue = this.byId("statusSelect").getSelectedKey();

            if (orderValue && !/^\d+$/.test(orderValue)) {
                MessageToast.show(oBundle.getText("orderNumberInvalid"));
                return;
            }

            if (dateValue && isNaN(Date.parse(dateValue))) {
                MessageToast.show(oBundle.getText("creationDateInvalid"));
                return;
            }

            MessageToast.show(oBundle.getText("showingResults"));
        },

        onClear: function () {
            this.byId("orderNumberInput").setValue("");
            this.byId("creationDateInput").setValue("");
            this.byId("statusSelect").setSelectedKey("");
        },

        onDeleteOrder: function () {
            const oBundle = this.getView().getModel("i18n").getResourceBundle();
            const oModel = this.getView().getModel();
            const aOrders = oModel.getProperty("/orders");
            const aSelectedOrders = aOrders.filter(order => order.selected);

            if (aSelectedOrders.length === 0) {
                MessageBox.error(oBundle.getText("selectItemError"));
                return;
            }

            const iCount = aSelectedOrders.length;
            const sConfirmMessage = oBundle.getText("confirmDeletionMessage", [iCount, iCount > 1 ? "s" : ""]);

            MessageBox.confirm(sConfirmMessage, {
                title: oBundle.getText("confirmDeletionTitle"),
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.YES) {
                        const aRemainingOrders = aOrders.filter(order => !order.selected);
                        oModel.setProperty("/orders", aRemainingOrders);
                        const sDeletedMessage = oBundle.getText("itemsDeletedMessage", [iCount, iCount > 1 ? "s" : ""]);
                        MessageToast.show(sDeletedMessage);
                    }
                }
            });
        },

        onAddOrder: function () {
            const oModel = this.getView().getModel();
            const aOrders = oModel.getProperty("/orders");

            const newOrder = {
                orderNumber: (Math.floor(Math.random() * 10000)).toString(),
                creationDate: new Date().toISOString().split("T")[0],
                receivingPlant: "New Plant",
                deliveringPlant: "Main Plant",
                status: "Created",
                selected: false
            };

            aOrders.push(newOrder);
            oModel.setProperty("/orders", aOrders);

            const oBundle = this.getView().getModel("i18n").getResourceBundle();
            MessageToast.show(oBundle.getText("orderAddedMessage", [newOrder.orderNumber]));
        },

        onOrderSelect: function (oEvent) {
            const oBundle = this.getView().getModel("i18n").getResourceBundle();
            const selectedOrder = oEvent.getSource().getBindingContext().getObject();
            MessageToast.show(oBundle.getText("selectedOrderMessage", [selectedOrder.orderNumber]));
        },

        onSelectAll: function (oEvent) {
            const bSelected = oEvent.getParameter("selected");
            const oModel = this.getView().getModel();
            const aOrders = oModel.getProperty("/orders");

            aOrders.forEach(order => {
                order.selected = bSelected;
            });

            oModel.setProperty("/orders", aOrders);
        },

        onRowSelect: function () {
            const oModel = this.getView().getModel();
            const aOrders = oModel.getProperty("/orders");
            const bAllSelected = aOrders.every(order => order.selected);

            this.byId("selectAllCheckbox").setSelected(bAllSelected);
        }
    });
});
