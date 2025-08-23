sap.ui.define(
  ["sap/ui/core/mvc/Controller"],

  function (Controller) {
    "use strict";

    return Controller.extend(
      "com.ordermanagement.ordermanagement.controller.OrderManagement",
      {
        onInit: function () {
          var oTable = this.byId("tbProd");

          oTable.attachUpdateFinished(this.updateProductTitle.bind(this));
        },

        // Real time total number of items of the Product table
        updateProductTitle: function () {
          var oTable = this.byId("tbProd");
          var iItemCount = oTable.getItems().length;

          this.byId("ttlProd").setText("Products(" + iItemCount + ")");
        },

        // Open Add Dialog
        onPressCreate: function () {
          if (!this.oAddDialog) {
            this.oAddDialog = this.loadFragment({
              name: "com.ordermanagement.ordermanagement.fragment.AddDialog",
              controller: this,
            });
          }
          this.oAddDialog.then(function (oDialog) {
            oDialog.open();
          });
        },

        // Add New Product to model
        onAddProduct: function () {
          var oModel = this.getOwnerComponent().getModel();
          var oView = this.getView();

          //Get inputs
          var oNewProductName = oView.byId("inpAddProductName");
          var oNewQuantity = oView.byId("inpAddQuantity");
          var oNewPricePerQuantity = oView.byId("inpAddPricePerQuantity");

          var sNewProductName = oNewProductName.getValue();
          var sNewQuantity = oNewQuantity.getValue();
          var sNewPricePerQuantity = oNewPricePerQuantity.getValue();

          var bValid = true;

          // Validations for inputs
          if (sNewProductName === "") {
            oNewProductName.setValueState("Error");
            oNewProductName.setValueStateText("Product Name is required.");
            bValid = false;
          } else {
            oNewProductName.setValueState("None");
          }

          if (sNewQuantity === "") {
            oNewQuantity.setValueState("Error");
            oNewQuantity.setValueStateText("Quantity is required.");
            bValid = false;
          } else {
            oNewQuantity.setValueState("None");
          }

          if (sNewPricePerQuantity === "") {
            oNewPricePerQuantity.setValueState("Error");
            oNewPricePerQuantity.setValueStateText("Quantity is required.");
            bValid = false;
          } else {
            oNewPricePerQuantity.setValueState("None");
          }

          if (!bValid) {
            sap.m.MessageToast.show("Please fill required fields.");
            return;
          } else {
            var that = this;

            // Get current date when the product is created
            var oDate = new Date();
            var iTime = oDate.getTime();
            var sFormattedDate = "/Date(" + iTime + ")/";

            // Add data to model
            var oData = {
              ProductName: sNewProductName,
              Quantity: sNewQuantity,
              PricePerQuantity: sNewPricePerQuantity,
              Status: "Created",
              CreationDate: sFormattedDate,
            };

            oModel.create("/Orders", oData, {
              success: function (data) {
                sap.m.MessageToast.show(sNewProductName + " was added.");
                that.onCloseDialog();
              },
              error: function (data) {},
            });
          }
        },

        // Close open dialog
        onCloseDialog: function () {
          const oDialog = this.byId("dialogAdd");

          // Clear input fields when reusing the Add Dialog
          this.byId("inpAddProductName").setValue("");
          this.byId("inpAddQuantity").setValue("");
          this.byId("inpAddPricePerQuantity").setValue("");

          // Setting the state to none for the red outline to be removed when reusing
          this.byId("inpAddProductName").setValueState("None");
          this.byId("inpAddQuantity").setValueState("None");
          this.byId("inpAddPricePerQuantity").setValueState("None");

          oDialog.close();
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

        // onValueHelpDialogClose: function (oEvent) {
        //   var oSelectedItem = oEvent.getParameter("selectedItem");

        //   if (oSelectedItem) {
        //     var sTitle = oSelectedItem.getTitle();
        //     var oModel = this.getView().getModel();

        //     // Set the selected value to the model
        //     oModel.setProperty("/ReceivingPlant", sTitle);
        //   }

        //   // Close the dialog
        //   this.byId("SelectDialogReceivingPlant").close();
        // },
      }
    );
  }
);
