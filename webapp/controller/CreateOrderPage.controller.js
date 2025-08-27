sap.ui.define(
  ["sap/ui/core/mvc/Controller"],

  function (Controller) {
    "use strict";

    return Controller.extend(
      "com.ordermanagement.ordermanagement.controller.CreateOrderPage",
      {
        onInit: function () {
          // Real time total number of items of the Product table
          var oTable = this.byId("tbProd");
          oTable.attachUpdateFinished(this.updateProductTitle.bind(this));
        },

        // Get table length
        updateProductTitle: function () {
          var oTable = this.byId("tbProd");
          var iItemCount = oTable.getItems().length;

          this.byId("ttlProd").setText("Products (" + iItemCount + ")");
        },

        // Open CreateOrder Dialog
        onPressCreate: function () {
          var oView = this.getView();
          var oReceivingPlant = oView.byId("inpReceivingPlant");
          var oDeliveringPlant = oView.byId("inpDeliveringPlant");
          var sReceivingPlant = oView.byId("inpReceivingPlant").getValue();
          var sDeliveringPlant = oView.byId("inpDeliveringPlant").getValue();
          var bValid = true;

          if (sReceivingPlant === "") {
            oReceivingPlant.setValueState("Error");
            oReceivingPlant.setValueStateText("Receiving Plant is required.");
            bValid = false;
          } else {
            oReceivingPlant.setValueState("None");
          }

          if (sDeliveringPlant === "") {
            oDeliveringPlant.setValueState("Error");
            oDeliveringPlant.setValueStateText("Delivering Plant is required.");
            bValid = false;
          } else {
            oReceivingPlant.setValueState("None");
          }

          if (!bValid) {
            sap.m.MessageToast.show("Please fill required fields.");
            return;
          } else {
            oReceivingPlant.setValueState("None");
            oReceivingPlant.setValueState("None");
            if (!this.oCreateOrderDialog) {
              this.oCreateOrderDialog = this.loadFragment({
                name: "com.ordermanagement.ordermanagement.fragment.createOrder.CreateOrderDialog",
                controller: this,
              });
            }
            this.oCreateOrderDialog.then(function (oDialog) {
              oDialog.open();
            });
          }
        },

        // Ticked all checkbox on every items when checkbox header is ticked
        onSelectAllProducts: function (oEvent) {
          var bSelected = oEvent.getParameter("selected");
          var oTable = this.byId("tbProd");
          var aItems = oTable.getItems();

          aItems.forEach(function (oItem) {
            var oCheckBox = oItem.getCells()[0]; // Assuming checkbox is the first cell
            oCheckBox.setSelected(bSelected);
          });
        },

        // Open ReceivingPlantDialog when onReceivingPlant is called
        onReceivingPlant: function () {
          if (!this.oReceivingDialog) {
            this.oReceivingDialog = this.loadFragment({
              name: "com.ordermanagement.ordermanagement.fragment.createOrder.ReceivingPlantDialog",
              controller: this,
            });
          }
          this.oReceivingDialog.then(function (oDialog) {
            oDialog.open();
          });
        },

        // Open DeliveringPlantDialog when onDeliveringPlant is called
        onDeliveringPlant: function () {
          if (!this.oDeliveringDialog) {
            this.oDeliveringDialog = this.loadFragment({
              name: "com.ordermanagement.ordermanagement.fragment.createOrder.DeliveringPlantDialog",
              controller: this,
            });
          }
          this.oDeliveringDialog.then(function (oDialog) {
            oDialog.open();
          });
        },

        // Search filter for ReceivingPlant Dialog
        onSearchReceivingPlant: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oFilter = new sap.ui.model.Filter(
            "ReceivingPlantDescription",
            sap.ui.model.FilterOperator.Contains,
            sValue
          );
          var oBinding = oEvent.getSource().getBinding("items");
          oBinding.filter([oFilter]);
        },

        // Search filter for DeliveringPlant Dialog
        onSearchDeliveringPlant: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oFilter = new sap.ui.model.Filter(
            "DeliveringPlantDescription",
            sap.ui.model.FilterOperator.Contains,
            sValue
          );
          var oBinding = oEvent.getSource().getBinding("items");
          oBinding.filter([oFilter]);
        },

        // Search filter for DeliveringPlant Dialog
        onSearchProduct: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oFilter = new sap.ui.model.Filter(
            "ProductName",
            sap.ui.model.FilterOperator.Contains,
            sValue
          );
          var oBinding = oEvent.getSource().getBinding("items");
          oBinding.filter([oFilter]);
        },

        // Get Selected item from ReceivingPlant and set data to inpReceivingPlant
        onValueHelpReceivingPlantDialogClose: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem");
          if (oSelectedItem) {
            var sTitle = oSelectedItem.getTitle();
            var oInput = this.byId("inpReceivingPlant");
            oInput.setValue(sTitle);
          }
        },

        // Get Selected item from DeliveringPlant and set data to inpDeliveringPlant
        onValueHelpDeliveringPlantDialogClose: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem");
          if (oSelectedItem) {
            var sTitle = oSelectedItem.getTitle();
            var oInput = this.byId("inpDeliveringPlant");
            oInput.setValue(sTitle);
          }
        },

        // Navigate to OrderQuantityDialog
        onValueHelpProductName: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem");
          if (oSelectedItem) {
            if (!this.oOrderQuantityDialog) {
              this.oOrderQuantityDialog = this.loadFragment({
                name: "com.ordermanagement.ordermanagement.fragment.createOrder.OrderQuantityDialog",
                controller: this,
              });
            }
            this.oOrderQuantityDialog.then(function (oDialog) {
              oDialog.open();
            });
            var sTitle = oSelectedItem.getTitle();
            var oInput = this.byId("inpSelectedProduct");
            oInput.setValue(sTitle);
            // var oProductSelected = oView.byId("lblProductSelected");
            // oProductSelected.setValue(sTitle);
          }
        },

        // Confirm to Create the order
        onPressConfirmCreateOrder: function (oEvent) {
          var oView = this.getView();
          var oQuantity = oView.byId("inpQuantity");
          var sQuantity = oQuantity.getValue();

          if (sQuantity === "") {
            oQuantity.setValueState("Error");
            oQuantity.setValueStateText("Quantity is required.");
          } else {
            oQuantity.setValueState("Success");

            // Get Receiving and delivering plant from inp
            var oSelectedProduct = oView.byId("inpSelectedProduct");
            var oReceivingPlant = oView.byId("inpReceivingPlant");
            var oDeliveringPlant = oView.byId("inpDeliveringPlant");

            var sSelectedProduct = oSelectedProduct.getValue();
            var sReceivingPlant = oReceivingPlant.getValue();
            var sDeliveringPlant = oDeliveringPlant.getValue();

            // Get date today and format it
            var oDate = new Date();
            var iTime = oDate.getTime();
            var sFormattedDate = "/Date(" + iTime + ")/";

            // Get product.json for price quantity

            // var oProductsModel = new sap.ui.model.json.JSONModel();
            // oProductsModel.loadData("localService/data/Products.json");
            // this.getView().setModel(oProductsModel, "ProductsModel");

            // var oProductsModel = oView.getModel("ProductsModel");
            // var aProducts = oProductsModel.getProperty("/");

            // // Find the product by name
            // var oMatchedProduct = aProducts.find(function (product) {
            //   return product.ProductName === oSelectedProduct;
            // });

            // var fPricePerQuantity = oMatchedProduct
            //   ? oMatchedProduct.PricePerQuantity
            //   : 0;

            var oAddProduct = {
              ProductName: sSelectedProduct,
              // ReceivingPlantDescription: oReceivingPlant,
              // DeliveringPlantDescription: oDeliveringPlant,
              Quantity: parseFloat(sQuantity),
              PricePerQuantity: 321,
              Status: "Created",
              CreationDate: sFormattedDate,
            };

            // Get or create temporary model for new orders
            var oTempModel = oView.getModel("TempOrders");
            if (!oTempModel) {
              oTempModel = new sap.ui.model.json.JSONModel({ Products: [] });
              oView.setModel(oTempModel, "TempOrders");
            }

            // Add new product to temporary model
            var aTempProducts = oTempModel.getProperty("/Products") || [];
            aTempProducts.push(oAddProduct);
            oTempModel.setProperty("/Products", aTempProducts);

            sap.m.MessageToast.show(sSelectedProduct + " is added");

            // reset value
            oQuantity.setValue("");
            // oQuantity.setValueState("Default");
            this.onCloseFragment(oEvent);
          }
        },

        // Validation if there is tick in the table, if so then open ConfirmatDeleteDialog
        onOpenDelete: function () {
          var oTable = this.getView().byId("tbProd");
          var aItems = oTable.getItems();
          var aToDelete = [];

          // Loop through table items to find selected order
          aItems.forEach(function (oItem) {
            var bSelected = oItem.getCells()[0].getSelected();
            if (bSelected) {
              aToDelete.push(oItem);
            }
          });

          // Validation: Check if any checkbox is ticked
          if (aToDelete.length === 0) {
            sap.m.MessageToast.show(
              "Please select at least one order to delete."
            );
          } else {
            // Open confirmation dialog
            if (!this.oConfirmationDialog) {
              this.loadFragment({
                name: "com.ordermanagement.ordermanagement.fragment.createOrder.ConfirmatDeleteDialog",
                controller: this,
              }).then(
                function (oDialog) {
                  this.oConfirmationDialog = oDialog;
                  oDialog.open();
                }.bind(this)
              ); // Make sure to bind 'this'
            } else {
              this.oConfirmationDialog.open(); // Reuse the dialog
            }
          }
        },

        // Delete ticked cb order from the table
        onConfirmDeleteOrder: function (oEvent) {
          var oTable = this.getView().byId("tbProd");
          var oModel = this.getView().getModel("TempOrders");
          var aItems = oTable.getItems();
          var aToDeleteIndexes = [];

          // Loop through table items to find selected orders
          aItems.forEach(function (oItem, index) {
            var bSelected = oItem.getCells()[0].getSelected();
            if (bSelected) {
              aToDeleteIndexes.push(index);
            }
          });

          // Get current product data
          var aProducts = oModel.getProperty("/Products");

          // Remove selected items by index (reverse order to avoid shifting)
          aToDeleteIndexes
            .sort((a, b) => b - a)
            .forEach(function (iIndex) {
              aProducts.splice(iIndex, 1);
            });

          // Update the model with the new data
          oModel.setProperty("/Products", aProducts);

          this.byId("cbSelectProd").setSelected(false);

          // Show confirmation and close dialog
          sap.m.MessageToast.show("Selected product/s deleted.");
          this.onCloseFragment(oEvent);

          // Optional: Uncheck all checkboxes
          aItems.forEach(function (oItem) {
            oItem.getCells()[0].setSelected(false);
          });
        },

        // Close Fragment Dialog (reusable)
        onCloseFragment: function (oEvent) {
          var oSource = oEvent.getSource();
          var oDialog = oSource.getParent();

          if (oDialog) {
            oDialog.close();
          }
        },

        //Before saving, checks input is valid/blank
        onSavePressed: function () {
          var oReceivingPlantInput = this.byId("inpReceivingPlant");
          var oDeliveringPlantInput = this.byId("inpDeliveringPlant");
          var sReceivingPlant = oReceivingPlantInput.getValue();
          var sDeliveringPlant = oDeliveringPlantInput.getValue();
          var bValid = true;

          //  Get the temporary products from the model
          var oView = this.getView();
          var oTempModel = oView.getModel("TempOrders");
          var aTempProducts = oTempModel.getProperty("/Products") || [];

          if (!sReceivingPlant) {
            oReceivingPlantInput.setValueState("Error");
            oReceivingPlantInput.setValueStateText(
              "Receiving Plant is required."
            );
            bValid = false;
          } else {
            oReceivingPlantInput.setValueState("None");
          }

          if (!sDeliveringPlant) {
            oDeliveringPlantInput.setValueState("Error");
            oDeliveringPlantInput.setValueStateText(
              "Delivering Plant is required."
            );
            bValid = false;
          } else {
            oDeliveringPlantInput.setValueState("None");
          }

          // if (!bValid || aTempProducts.length === 0) {
          if (!bValid || aTempProducts === 0) {
            MessageBox.error(
              "Please select both Receiving and Delivering Plants."
            );
            return;
          } else {
            var oModelOrders = this.getOwnerComponent().getModel();
            // var oModelProducts = this.getOwnerComponent.getModel("Products");
            // var aTempProducts = oTempModel.getProperty("/Products");

            // Get productname, Receiving and Delivering Plant
            var oSelectedProduct = this.byId("inpSelectedProduct").getValue();

            // Get date today and format it
            var oDate = new Date();
            var iTime = oDate.getTime();
            var sFormattedDate = "/Date(" + iTime + ")/";

            // var oDataProducts = {
            //   ProductName: oSelectedProduct,
            //   Quantity: 231,
            //   PricePerQuantity: 123,
            // };

            var oDataOrder = {
              ReceivingPlantCode: oSelectedProduct,
              ReceivingPlantDescription: sReceivingPlant,
              DeliveringPlantDescription: sDeliveringPlant,
              CreationDate: sFormattedDate,
              Status: "Created",
              Products: aTempProducts,
            };

            oModelOrders.create("/Orders", oDataOrder, {
              success: function (data) {
                sap.m.MessageToast.show("Order has been added");

                // var oModel = new sap.ui.model.json.JSONModel();
                // oModel.loadData("localService/data/Orders.json"); // false = synchronous

                // // Log the entire data
                // console.log("Orders Data:", oModel);
              },
              error: function (data) {
                console.log("Something went wrong");
              },
            });

            var oRouter = this.getOwnerComponent().getRouter();

            var oView = this.getView();
            var oReceivingPlant = oView.byId("inpReceivingPlant");
            var oDeliveringPlant = oView.byId("inpDeliveringPlant");

            // reset value state for reuse
            oReceivingPlant.setValueState("None");
            oDeliveringPlant.setValueState("None");
            oReceivingPlant.setValue("");
            oDeliveringPlant.setValue("");

            // Clear temporary orders data when cancel order
            var oTempModel = oView.getModel("TempOrders");
            if (oTempModel) {
              oTempModel.setProperty("/Products", []);
            }

            var oRouter = this.getOwnerComponent().getRouter();
            // Route to Order Main Page when saved
            oRouter.navTo("RouteOrderMainPage");
          }
        },

        // Cancel Orders and route to main page
        onCancelPressed: function () {
          var oRouter = this.getOwnerComponent().getRouter();

          var oView = this.getView();
          var oReceivingPlant = oView.byId("inpReceivingPlant");
          var oDeliveringPlant = oView.byId("inpDeliveringPlant");

          // reset value state for reuse
          oReceivingPlant.setValueState("None");
          oDeliveringPlant.setValueState("None");
          oReceivingPlant.setValue("");
          oDeliveringPlant.setValue("");

          // Clear temporary orders data when cancel order
          var oTempModel = oView.getModel("TempOrders");
          if (oTempModel) {
            oTempModel.setProperty("/Products", []);
          }

          // Route to Order Main Page
          oRouter.navTo("RouteOrderMainPage");
        },
      }
    );
  }
);
