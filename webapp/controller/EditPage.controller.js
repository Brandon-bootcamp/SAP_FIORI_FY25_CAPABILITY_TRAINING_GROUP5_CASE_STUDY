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
            this.localOrdersModel = this.getView().getModel("localOrders");

            var oTable = this.byId("productTable");
            oTable.attachUpdateFinished(this.updateProductTitle.bind(this));
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
            const oLocalModel = this.getView().getModel("localOrders");
            const productData = oLocalModel.getProperty("/Order/Products/results/");

            // Defensive check: only block if productData is truly missing
            if (!Array.isArray(productData)) {
                MessageBox.error("Product data is not available.");
                return;
            }

            const oProductsModel = this.getOwnerComponent().getModel(); // default OData model

            if (!oProductsModel) {
                MessageBox.error("Products model is not available.");
                return;
            }

            oProductsModel.read("/Products", {
                success: (oData) => {
                    const aAllProducts = oData.results;

                    // Extract valid plant codes
                    const aPlantCodes = productData
                        .map(product => product.DeliveringPlantCode)
                        .filter(code => code !== null && code !== undefined && code !== "");

                    // Filter products based on valid codes
                    const aFilteredProducts = aPlantCodes.length === 0
                        ? aAllProducts
                        : aAllProducts.filter(product =>
                            aPlantCodes.includes(product.DeliveringPlantCode)
                        );

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
                error: (err) => {
                    MessageBox.error("Failed to load products.");
                    console.error("OData read error:", err);
                }
            });
        },

        onConfirmAddProduct: function () {
            const oDialogModel = this.getView().getModel("dialog");
            const oLocalModel = this.getView().getModel("localOrders");

            const aCurrentProducts = oLocalModel.getProperty("/Order/Products/results") || [];
            const aAvailableProducts = oDialogModel.getProperty("/availableProducts") || [];
            console.log(aAvailableProducts);
            
            const sSelectedProductId = oDialogModel.getProperty("/selectedProductId");
            const iQuantity = parseInt(oDialogModel.getProperty("/quantity"), 10);
            if (isNaN(iQuantity) || iQuantity <= 0) {
                MessageBox.error("Please enter a valid quantity greater than zero.");
                return;
            }
                
                // Find full product details from filtered list
            const oSelectedProduct = aAvailableProducts.find(product =>
                    String(product.ProductID) === String(sSelectedProductId)
                );
                console.log(oSelectedProduct);

            if (!oSelectedProduct) {
                MessageBox.error("Selected product not found in available list.");
                return;
            }

            const iPrice = oSelectedProduct.PricePerQuantity;
            const sPlantCode = oSelectedProduct.DeliveringPlantCode;
            const sPlantDescription = oSelectedProduct.DeliveringPlantDescription;

            const oNewProduct = {
                ProductID: sSelectedProductId,
                ProductName: oSelectedProduct.ProductName,
                Quantity: iQuantity,
                PricePerQuantity: iPrice,
                TotalPrice: iQuantity * iPrice,
                DeliveringPlantCode: sPlantCode,
                DeliveringPlantDescription: sPlantDescription,
                selected: false
            };

            // Prevent duplicates 
            const iExistingIndex = aCurrentProducts.findIndex(p => p.ProductID === sSelectedProductId);
            if (iExistingIndex > -1) {
                aCurrentProducts[iExistingIndex].Quantity += iQuantity;
                aCurrentProducts[iExistingIndex].TotalPrice += iQuantity * iPrice;
            } else {
                aCurrentProducts.push(oNewProduct);
            }

            oLocalModel.setProperty("/Order/Products/results", aCurrentProducts);
            MessageToast.show("Product added successfully.");

            this._pDialog.then(oDialog => oDialog.close());
        },

        onCancelAddProduct: function () {
            this._pDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        onSelectAllProducts: function (oEvent) {
            const bSelected = oEvent.getParameter("selected");
            const oLocalModel = this.getView().getModel("localOrders");
            const aProducts = oLocalModel.getProperty("/Order/Products/results") || [];

            aProducts.forEach(product => {
                product.selected = bSelected;
            });

            oLocalModel.setProperty("/Order/Products/results", aProducts);
        },

        onDeleteProduct: function () {
            const oLocalModel = this.getView().getModel("localOrders");
            const aProducts = oLocalModel.getProperty("/Order/Products/results") || [];

            // 🔍 Find selected products
            const aSelected = aProducts.filter(p => p.selected);
            console.log(aProducts);

            if (aSelected.length === 0) {
                MessageBox.error("Please select at least one product to delete.");
                return;
            }

            MessageBox.confirm(`Are you sure you want to delete ${aSelected.length} item(s)?`, {
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        const aRemaining = aProducts.filter(p => !p.selected);
                        oLocalModel.setProperty("/Order/Products/results", aRemaining);
                        MessageToast.show("Selected product(s) deleted.");
                    }
                }
            });
        },

onSave: function () {
    const oView = this.getView();
    const oModel = oView.getModel(); // OData model
    const oLocalModel = oView.getModel("localOrders"); // JSON model
    const oRouter = this.getOwnerComponent().getRouter();

    if (!oModel || !oLocalModel || !oRouter) {
        MessageBox.error("Unable to save. Missing model or router.");
        return;
    }

    const orderData = oLocalModel.getProperty("/Order");
    const sOrderNumber = orderData?.OrderNumber;

    if (!sOrderNumber) {
        MessageBox.error("Order number is missing. Cannot proceed with save.");
        return;
    }

    // Construct correct path for update
    const sOrderPath = `/Orders('${sOrderNumber}')`; // Use quotes if OrderNumber is a string

    MessageBox.confirm("Are you sure you want to save these changes?", {
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,

        onClose: (sAction) => {
            if (sAction === MessageBox.Action.OK) {
                oModel.update(sOrderPath, orderData, {
                    success: () => {
                        MessageBox.success(
                            `The Order ${sOrderNumber} has been successfully updated.`,
                            {
                                onClose: () => {
                                    oModel.refresh(true); // force backend refresh
                                    oRouter.navTo("RouteDetailPage", {
                                        orderId: sOrderNumber
                                    }, true); // force route reload
                                }
                            }
                        );
                    },
                    error: () => {
                        MessageBox.error(`Failed to update Order ${sOrderNumber}.`);
                    }
                });
            }
        }
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