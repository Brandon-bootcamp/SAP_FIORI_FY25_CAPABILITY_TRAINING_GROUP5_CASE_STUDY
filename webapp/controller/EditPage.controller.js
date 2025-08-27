sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.ordermanagement.ordermanagement.controller.EditPage", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteEditPage").attachPatternMatched(this._onObjectMatched, this);

        },

_onObjectMatched: function (oEvent) {
    var sOrderNumber = oEvent.getParameter("arguments").orderId;
    var sPath = "/Orders(" + sOrderNumber + ")";
    this.getView().bindElement({ path: sPath });

    // Example: filter Products from backend or dataset
    var oModel = this.getView().getModel();
    var aAllOrders = oModel.getProperty("/Orders") || [];
    var aProducts = aAllOrders
          .filter(o => o.OrderNumber === parseInt(sOrderNumber))
          .map(o => ({
              ProductName: o.ProductName,
              Quantity: o.Quantity,
              PricePerQuantity: o.PricePerQuantity,
              TotalPrice: o.Quantity * o.PricePerQuantity,
              selected: false
          }));
    oModel.setProperty("/products", aProducts);
    console.log("Products set for order", sOrderNumber, aProducts);
},

        updateProductTitle: function () {
            var oTable = this.byId("productTable");
            var iItemCount = oTable.getItems().length;

            this.byId("productTitle").setText("Products (" + iItemCount + ")");
        },

        onChangeStatus: function (oEvent) {
            var sKey = oEvent.getSource().getSelectedKey();
            this.getView().getModel().setProperty("/Status", sKey);
            MessageToast.show("Status updated to: " + sKey);
        },

onAddProduct: function () {
    const oModel = this.getView().getModel();
    const sDeliveringPlant = oModel.getProperty("/DeliveringPlant");
    const aOrders = oModel.getProperty("/Orders") || [];

    const aFilteredProducts = aOrders
        .filter(order => order.DeliveringPlantCode === sDeliveringPlant)
        .map(order => ({
            ProductID: order.ProductID,
            ProductName: order.ProductName
        }));

    const oDialogModel = new sap.ui.model.json.JSONModel({
        selectedProductId: "",
        quantity: "",
        availableProducts: aFilteredProducts
    });
    this.getView().setModel(oDialogModel, "dialog");

    if (!this._pDialog) {
        this._pDialog = this.loadFragment({
            name: "com.ordermanagement.ordermanagement.fragment.ProductDialog",
            controller: this
        });
    }

    this._pDialog.then(oDialog => oDialog.open());
},

        onConfirmAddProduct: function () {
            var oDialogModel = this.getView().getModel("dialog");
            var oMainModel = this.getView().getModel();
            var aProducts = oMainModel.getProperty("/products");

            var sProductName = oDialogModel.getProperty("/selectedProductId");
            var iQuantity = parseInt(oDialogModel.getProperty("/quantity"), 10);
            var iPrice = 10;

            if (!sProductName || isNaN(iQuantity) || iQuantity <= 0) {
                MessageBox.error("Please enter a valid product and quantity.");
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

            this._pDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        onCancelAddProduct: function () {
            this._pDialog.then(function (oDialog) {
                oDialog.close();
            });
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
    var aProducts = oModel.getProperty("/products") || [];
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
    const oCtx = this.getView().getBindingContext();
    const sOrderNumber = oCtx.getProperty("OrderNumber");
    const oModel = this.getView().getModel();
    const oRouter = this.getOwnerComponent().getRouter();

    MessageBox.confirm("Are you sure you want to save these changes?", {
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,

        onClose: function (sAction) {
            if (sAction === MessageBox.Action.OK) {
                // Commit changes to backend
                oModel.submitChanges({
                    success: function () {
                        MessageBox.success(
                            "The Order " + sOrderNumber + " has been successfully updated.",
                            {
                                onClose: function () {
                                    // Navigate to detail page again
                                    oRouter.navTo("RouteDetailPage", {
                                        orderId: sOrderNumber
                                    });
                                }.bind(this)
                            }
                        );
                    }.bind(this),
                    error: function () {
                        MessageBox.error("Failed to update Order " + sOrderNumber + ".");
                    }
                });
            }
        }.bind(this)
    });
},

        onCancel: function () {
            MessageBox.confirm("Are you sure you want to cancel the changes done in the page?", {
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        var sOrderNumber = this.getView().getBindingContext().getProperty("OrderNumber");
                        var oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("RouteDetailPage", {
                            orderId: sOrderNumber
                        });
                    }
                }.bind(this)
            });
        }

    });
});