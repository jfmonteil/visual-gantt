define(function() {
  
  "use strict";
  
  return {
    rules : [
      // Sample rule
      {
        priority: -1,
        select: {
          module: "./Model"
        },
        apply: {
          props: {
            barSize: {defaultValue: 50}
          }
        }
      },
	  // Analyzer integration
      {
        priority: -1,
        select: {
          module: "./Model",
          annotation: "pentaho/analyzer/visual/Options",
          application: "pentaho/analyzer"
        },
        apply: {
          keepLevelOnDrilldown: false
        }
      }
    ]
  };
});