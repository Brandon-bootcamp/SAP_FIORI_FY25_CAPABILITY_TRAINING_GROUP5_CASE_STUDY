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

            // Get the binding context of the selected item
            var oContext = oSelectedItem.getBindingContext();
            var sProductName = oContext.getProperty("ProductName");
            var sProductID = oContext.getProperty("ProductID");
            var sPricePerQuantity = oContext.getProperty("PricePerQuantity");
            var sDeliveringPlantCode = oContext.getProperty(
              "DeliveringPlantCode"
            );

            var oProductName = this.byId("inpSelectedProduct");
            var oProductID = this.byId("inpSelectedProductID");
            var oPricePerQuantity = this.byId("inpPricePerQuantity");
            var oDeliveringPlantCode = this.byId("inpDeliveringPlantCode");

            oProductName.setValue(sProductName);
            oProductID.setValue(sProductID);
            oPricePerQuantity.setValue(sPricePerQuantity);
            oDeliveringPlantCode.setValue(sDeliveringPlantCode);
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

            // Get Selected Product adn productid
            var sSelectedProductName = oView
              .byId("inpSelectedProduct")
              .getValue();
            var sSelectedProductID = oView
              .byId("inpSelectedProductID")
              .getValue();
            var sSelectedPricePerQuantity = oView
              .byId("inpPricePerQuantity")
              .getValue();
            var sDeliveringPlantCode = oView
              .byId("inpDeliveringPlantCode")
              .getValue();

            // // Load the Products.json using JSONModel
            // var oProductModel = new sap.ui.model.json.JSONModel();
            // oProductModel.loadData(
            //   "localservice/data/Products.json",
            //   null,
            //   false
            // ); // synchronous load

            // // Get the data from the model
            // var aProducts = oProductModel.getData();

            // // Find the product by name
            // var oSelectedProduct = aProducts.find(function (product) {
            //   return product.ProductName === sSelectedProduct;
            // });

            var oAddProduct = {
              ProductID: sSelectedProductID,
              ProductName: sSelectedProductName,
              DeliveringPlantCode: sDeliveringPlantCode,
              Quantity: parseFloat(sQuantity),
              PricePerQuantity: sSelectedPricePerQuantity,
              Status: "Created",
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

            sap.m.MessageToast.show(sSelectedProductName + " is added");

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

          // Loop through table items to find selected orders
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

                  // Set the dynamic text with the number of selected items
                  var oText = oDialog.getContent()[0].getContent()[0]; // Assuming Text is first in SimpleForm
                  oText.setText(
                    "Are you sure you want to delete " +
                      aToDelete.length +
                      " item(s)?"
                  );

                  oDialog.open();
                }.bind(this)
              );
            } else {
              // Update the text before opening
              var oText = this.oConfirmationDialog
                .getContent()[0]
                .getContent()[0];
              oText.setText(
                "Are you sure you want to delete " +
                  aToDelete.length +
                  " item(s)?"
              );

              this.oConfirmationDialog.open();
            }
          }
        },

        // confirm Delete ticked cb order from the table (confirm delete dialog)
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

        // Open ConfirmSaveDialog
        onSavePressed: function () {
          var oReceivingPlantInput = this.byId("inpReceivingPlant");
          var oDeliveringPlantInput = this.byId("inpDeliveringPlant");
          var sReceivingPlant = oReceivingPlantInput.getValue();
          var sDeliveringPlant = oDeliveringPlantInput.getValue();
          var bValid = true;

          //  Get the temporary products from the model
          var oView = this.getView();
          var oTable = this.byId("tbProd");
          var iItemCount = oTable.getItems().length;

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
          if (!bValid) {
            sap.m.MessageToast.show(
              "Please fill the required fields"
            );
            return;
          }

          if (iItemCount === 0){
            sap.m.MessageToast.show(
              "Please add at least one product"
            );
            return;
          } else {
            if (!this.oConfirmSaveDialog) {
              this.oConfirmSaveDialog = this.loadFragment({
                name: "com.ordermanagement.ordermanagement.fragment.createOrder.ConfirmSaveDialog",
                controller: this,
              });
            }
            this.oConfirmSaveDialog.then(function (oDialog) {
              oDialog.open();
            });
          }
        },

        //Before saving, checks input is valid/blank
        onConfirmSaveOrder: function () {
          var oReceivingPlantInput = this.byId("inpReceivingPlant");
          var oDeliveringPlantInput = this.byId("inpDeliveringPlant");
          var sReceivingPlant = oReceivingPlantInput.getValue();
          var sDeliveringPlant = oDeliveringPlantInput.getValue();

          var oModelOrders = this.getOwnerComponent().getModel();

          //  Get the temporary products from the model
          var oView = this.getView();
          var oTempModel = oView.getModel("TempOrders");
          var aTempProducts = oTempModel.getProperty("/Products") || [];
          
          // var oModelProducts = this.getOwnerComponent.getModel("Products");
          // var aTempProducts = oTempModel.getProperty("/Products");

          // Get productname and id,
          var oSelectedProductName = this.byId("inpSelectedProduct").getValue();
          // var sDeliveringPlantCode = oView
          //   .byId("inpDeliveringPlantCode")
          //   .getValue();

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
            ReceivingPlantCode: oSelectedProductName,
            ReceivingPlantDescription: sReceivingPlant,

            DeliveringPlantDescription: sDeliveringPlant,
            CreationDate: sFormattedDate,
            Status: "Created",
            Products: aTempProducts,
          };

          oModelOrders.create("/Orders", oDataOrder, {
            success: function (data) {
              var sOrderNumber = data.OrderNumber;
              sap.m.MessageToast.show("The Order " + sOrderNumber + " has been successfully created.");

              // var oModel = new sap.ui.model.json.JSONModel();
              // oModel.loadData("localService/data/Orders.json"); // false = synchronous

              // Log the entire data
              // console.log("Orders Data:", oModel);
              console.log("Full Order Data:\n", JSON.stringify(data, null, 2));
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
        },

        // Open ConfirmCancelDialog.fragment
        onCancelPressed: function () {
          if (!this.oConfirmCancelDialog) {
            this.oConfirmCancelDialog = this.loadFragment({
              name: "com.ordermanagement.ordermanagement.fragment.createOrder.ConfirmCancelDialog",
              controller: this,
            });
          }
          this.oConfirmCancelDialog.then(function (oDialog) {
            oDialog.open();
          });
        },

        // Cancel Orders and route to main page
        onConfirmCancelOrder: function () {
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
