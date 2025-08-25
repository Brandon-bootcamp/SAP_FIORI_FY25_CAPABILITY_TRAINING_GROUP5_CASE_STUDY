sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("casestudy.controller.EditPage", {

        onInit: function () {
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
            var oDialogModel = new JSONModel({
                selectedProductId: "",
                quantity: " ",
                availableProducts: [
                    { id: "Widget A", name: "Widget A" },
                    { id: "Widget B", name: "Widget B" },
                    { id: "Widget C", name: "Widget C" }
                ]
            });
            this.getView().setModel(oDialogModel, "dialog");

            if (!this._pDialog) {
                this._pDialog = this.loadFragment({
                    name: "casestudy.fragment.ProductDialog",
                    controller: this // ensure event handlers are bound
                });
            }

            this._pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onConfirmAddProduct: function () {
            var oDialogModel = this.getView().getModel("dialog");
            var oMainModel = this.getView().getModel();
            var aProducts = oMainModel.getProperty("/products");

            var sProductName = oDialogModel.getProperty("/selectedProductId");
            var iQuantity = parseInt(oDialogModel.getProperty("/quantity"), 10);
            var iPrice = 10; // Static price, can be dynamic

            if (!sProductName || iQuantity <= 0) {
                MessageBox.error("Please enter valid product and quantity.");
                return;
            }

            var oNewProduct = {
                ProductName: sProductName,
                Quantity: iQuantity,
                PricePerQuantity: iPrice,
                TotalPrice: iQuantity * iPrice,
                selected: false
            };

            aProducts.push(oNewProduct);
            oMainModel.setProperty("/products", aProducts);
            MessageToast.show("Product added.");

            this.byId("_IDGenDialog1").close();
        },

        onCancelAddProduct: function () {
            this.byId("_IDGenDialog1").close();
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
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                oRouter.navTo("DetailPage");
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
                        oRouter.navTo("DetailPage");
                    }
                }
            });
        }

    });
});