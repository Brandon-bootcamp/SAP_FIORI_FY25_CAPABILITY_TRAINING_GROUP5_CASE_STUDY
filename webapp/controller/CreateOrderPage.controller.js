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
            if (!this.oCreateOrderDialog) {
              this.oCreateOrderDialog = this.loadFragment({
                name: "com.ordermanagement.ordermanagement.fragment.CreateOrderDialog",
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
              name: "com.ordermanagement.ordermanagement.fragment.ReceivingPlantDialog",
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
              name: "com.ordermanagement.ordermanagement.fragment.DeliveringPlantDialog",
              controller: this,
            });
          }
          this.oDeliveringDialog.then(function (oDialog) {
            oDialog.open();
          });
        },

        //Before saving, checks input is valid/blank
        onSavePressed: function () {
          var oReceivingPlantInput = this.byId("inpReceivingPlant");
          var oDeliveringPlantInput = this.byId("inpDeliveringPlant");
          var sReceivingPlant = oReceivingPlantInput.getValue();
          var sDeliveringPlant = oDeliveringPlantInput.getValue();
          var bValid = true;

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

          if (!bValid) {
            MessageBox.error(
              "Please select both Receiving and Delivering Plants."
            );
            return;
          }
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
            var sTitle = oSelectedItem.getTitle(); // Assuming ProductName is in title
            var oInput = this.byId("inpReceivingPlant");
            oInput.setValue(sTitle);
          }
        },

        // Get Selected item from DeliveringPlant and set data to inpDeliveringPlant
        onValueHelpDeliveringPlantDialogClose: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem");
          if (oSelectedItem) {
            var sTitle = oSelectedItem.getTitle(); // Assuming ProductName is in title
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
                name: "com.ordermanagement.ordermanagement.fragment.OrderQuantityDialog",
                controller: this,
              });
            }
            this.oOrderQuantityDialog.then(function (oDialog) {
              oDialog.open();
            });
            var sTitle = oSelectedItem.getTitle();
            var oInput = this.byId("inpSelectedProduct");
            oInput.setValue(sTitle);
          }
        },

        onPressConfirmCreateOrder: function (oEvent) {
          var oView = this.getView();
          var oQuantity = oView.byId("inpQuantity");
          var sQuantity = oQuantity.getValue();
          // bValid = true;

          if (sQuantity === "") {
            oQuantity.setValueState("Error");
            oQuantity.setValueStateText("Quantity is required.");
            // bValid = false;
          } else {
            oQuantity.setValueState("Success");

            // Get the Model Orders
            var oModel = this.getOwnerComponent().getModel();

            // get the Product selected
            var oSelectedProduct = oView.byId("inpSelectedProduct").getValue();

            // Get receiving and delivering plant
            var oReceivingPlant = oView.byId("inpReceivingPlant").getValue();
            var oDeliveringPlant = oView.byId("inpDeliveringPlant").getValue();

            // Get current date when the order is created
            var oDate = new Date();
            var iTime = oDate.getTime();
            var sFormattedDate = "/Date(" + iTime + ")/";

            var that = this;

            // Add data to model
            var oData = {
              ProductName: oSelectedProduct,
              ReceivingPlantDescription: oReceivingPlant,
              DeliveringPlantDescription: oDeliveringPlant,
              Quantity: sQuantity,
              Status: "Created",
              CreationDate: sFormattedDate,
            };

            oModel.create("/Orders", oData, {
              success: function (data) {
                sap.m.MessageToast.show(oSelectedProduct + " is added");
                oQuantity.setValue(""); // reset value for reuse
                // that.onCloseDialog();
                that.onCloseFragment(oEvent);
              },
              error: function (data) {},
            });
          }
          // }
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
              this.oConfirmationDialog = this.loadFragment({
                name: "com.ordermanagement.ordermanagement.fragment.ConfirmatDeleteDialog",
                controller: this,
              });

              this.oConfirmationDialog.then(function (oDialog) {
                oDialog.open();
              });
            } else {
              this.oConfirmationDialog.open();
            }
          }
        },

        // Delete ticked cb order from the table
        onConfirmDeleteOrder: function (oEvent) {
          var oTable = this.getView().byId("tbProd");
          var oModel = this.getOwnerComponent().getModel();
          var aItems = oTable.getItems();
          var aToDelete = [];

          // Loop through table items to find selected order
          aItems.forEach(function (oItem) {
            var oContext = oItem.getBindingContext();
            var bSelected = oItem.getCells()[0].getSelected();
            if (bSelected) {
              aToDelete.push(oContext);
            }
          });

          // Delete selected items from the model
          var that = this;
          aToDelete.forEach(function (oContext) {
            var sPath = oContext.getPath();
            oModel.remove(sPath, {
              success: function () {
                sap.m.MessageToast.show("Order deleted successfully.");
                that.onCloseFragment(oEvent);
              },
              error: function () {
                sap.m.MessageToast.show("Error deleting order.");
              },
            });
          });

          // Uncheck all checkboxes
          aItems.forEach(function (oItem) {
            var oCheckBox = oItem.getCells()[0];
            oCheckBox.setSelected(false);
          });
        },

        onCloseFragment: function (oEvent) {
          var oSource = oEvent.getSource();
          var oDialog = oSource.getParent();

          if (oDialog) {
            oDialog.close();
          }
        },
      }
    );
  }
);
