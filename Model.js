define([
  "pentaho/module!_",
  "pentaho/visual/Model"
], function(module, BaseModel) {

  "use strict";

  // Return the Model factory function.
  return BaseModel.extend({
      $type: {
        id: module.id,

        // CSS class.
        styleClass: "visual-gantt",

        // The label may show up in menus.
        label: "D3 Gantt",

        // The default view to use to render this visualization is
        // a sibling module named `view-d3.js`.
        defaultView: "./view-d3-Gantt",

        // Properties
        props: [
          // Dimension Categorie  (nom de la tache)     
          {
			name: "Categorie",
			base: "pentaho/visual/role/Property",
		    fields: {isRequired: true}
          },
		   // Dimension date de debut
          {
            name: "Date_debut",
            base: "pentaho/visual/role/Property",
			fields: {isRequired: true}

          },
          // dimension Status
		  {
            name: "Statut",
			base: "pentaho/visual/role/Property",
			fields: {isRequired: false}

          }, 
          // la mesure : duree de la tache
		  {
            name: "Duree", 
            base: "pentaho/visual/role/Property",
		    modes:[{dataType: "number"}],
            fields: {isRequired: true}
		  }		   
        ]
      }
    }).configure();
  });

