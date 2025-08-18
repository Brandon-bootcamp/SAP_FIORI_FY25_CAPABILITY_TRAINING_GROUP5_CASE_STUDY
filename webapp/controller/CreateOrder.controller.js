sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
], (Controller, Fragment) => {
    "use strict";

    return Controller.extend("casestudy.controller.CreateOrder", {
        onInit () {
			},

            onValueHelpRequest: function () {
			 if (!this.oDialog) {
                this.oDialog = this.loadFragment({
                    name: "casestudy.fragment.ValueHelpDialog"
                });

            }
            this.oDialog.then(function (oDialog) {
                oDialog.open();
            });

        },

        onCloseDialog: function () {
            this.getView().byId("idProductDialog").close();
        },
    });
});