sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("casestudy.controller.EditPage", {

        onInit: function () {
            // Load existing order data (mocked for now)
            var oData = {
                OrderNumber: "ORD12345",
                CreatedOn: "2025-08-18",
                ReceivingPlant: "Plant A",
                DeliveringPlant: "Plant B",
                Status: "Created",
                products: [
                    {
                        ProductName: "Widget A",
                        Quantity: 10,
                        PricePerQuantity: 5,
                        TotalPrice: 50,
                        selected: false
                    }
                ]
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        },

        onChangeStatus: function (oEvent) {
            var sKey = oEvent.getSource().getSelectedKey();
            this.getView().getModel().setProperty("/Status", sKey);
            MessageToast.show("Status updated to: " + sKey);
        },

        onAddProduct: function () {
            // Simulate product selection based on DeliveringPlant
            var oModel = this.getView().getModel();
            var aProducts = oModel.getProperty("/products");

            // Mock product selection
            var oNewProduct = {
                ProductName: "New Widget",
                Quantity: 1,
                PricePerQuantity: 10,
                TotalPrice: 10,
                selected: false
            };

            aProducts.push(oNewProduct);
            oModel.setProperty("/products", aProducts);
            MessageToast.show("Product added.");
        },
        onSelectAllProducts: function (oEvent) {
            var bSelected = oEvent.getParameter("selected");
            var oModel = this.getView().getModel();
            var aProducts = oModel.getProperty("/products");

            aProducts.forEach(function (product) {
                product.selected = bSelected;
            });

            oModel.setProperty("/products", aProducts);
        },

        onDeleteProduct: function () {
            var oModel = this.getView().getModel();
            var aProducts = oModel.getProperty("/products");
            var aSelected = aProducts.filter(p => p.selected);

            if (aSelected.length === 0) {
                MessageBox.error("Please select an item from the table");
                return;
            }

            MessageBox.confirm("Are you sure you want to delete " + aSelected.length + " items?", {
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        var aRemaining = aProducts.filter(p => !p.selected);
                        oModel.setProperty("/products", aRemaining);
                        MessageToast.show("Selected items deleted.");
                    }
                }
            });
        },

        onSave: function () {
            var oModel = this.getView().getModel();
            var sOrderNumber = oModel.getProperty("/OrderNumber");

            MessageBox.confirm("Are you sure you want to Save these changes?", {
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        MessageBox.success("The Order " + sOrderNumber + " has been successfully updated.", {
                            onClose: function () {
                                // Navigate back to Detail Page
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                oRouter.navTo("DetailPage"); // Replace with actual route name
                            }.bind(this)
                        });
                    }
                }.bind(this)
            });
        },

        onCancel: function () {
            MessageBox.confirm("Are you sure you want to cancel the changes done in the page?", {
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("DetailPage"); // Replace with actual route name
                    }
                }
            });
        }

    });
});