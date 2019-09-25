// Ajout des dependances
define([
  "pentaho/module!_",
  "pentaho/visual/impl/View",
  "d3",
  "pentaho/visual/scene/Base",
  "./clickD3"
], function(module, BaseView, d3, Scene,d3ClickController) {
  
  "use strict";

  // Create and return the Bar View class
  return BaseView.extend(module.id, {
    
    _updateAll: function() {
      
	  // le Gantt model
      var model = this.model;
      var mySelf=this;
      //var dataTable = model.data;

      // Construire une liste d'élément, une par barre
      var scenes = Scene.buildScenesFlat(model).children;

      // The div where rendering takes place
	  
	  // Look and feel
	  var margin = {top: 50, right: 30, bottom: 30, left: 75};

      // Note use of the model's width and height properties
      var width = model.width - margin.left - margin.right;
      var height = model.height - margin.top - margin.bottom;
	  
      var dataTable = model.data;

	  
	  //Mon Gant copié de d3.js
	  d3.gantt = function(container) {
			var FIT_TIME_DOMAIN_MODE = "fit";
			var FIXED_TIME_DOMAIN_MODE = "fixed";
			
			var margin = {
			top : 20,
			right : 40,
			bottom : 20,
			left : 150
			};
			
			var timeDomainStart = d3.timeDay.offset(new Date(),-3);
			var timeDomainEnd = d3.timeHour.offset(new Date(),+3);
			var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
			var taskTypes = [];
			var taskStatus = [];
			var height = container.node().clientHeight - margin.top - margin.bottom-5;
			var width = container.node().clientWidth - margin.right - margin.left-5;

			var tickFormat = "%d %b";

			var keyFunction = function(scene) {
			return new Date(new Date(scene.vars.Date_debut.toString())) + scene.vars.Categorie.toString() + (new Date(scene.vars.Date_debut.toString())+scene.vars.Duree.value.toString());
			};

			var rectTransform = function(scene) {
			return "translate(" + x(new Date(scene.vars.Date_debut.toString())) + "," + y(scene.vars.Categorie.toString()) + ")";
			};

			var x,y,xAxis,yAxis;
			
			initAxis();
			
			var initTimeDomain = function() {
			 if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
				if (scenes === undefined || scenes.length < 1) {
				timeDomainStart = d3.timeDay.offset(new Date(), -3);
				timeDomainEnd = d3.timeDay.offset(new Date(), +3);
				return;
				}
				scenes.sort(function(a,b) {
					var a_Date_debut= new Date(a.vars.Date_debut.toString());
					var a_endDate= new Date(a_Date_debut);
					var a_measure=a.vars.Duree.value;
					a_endDate.setDate(a_endDate.getDate() + a_measure);		
					
				    var b_Date_debut= new Date(b.vars.Date_debut.toString());
					var b_endDate= new Date(b_Date_debut);
					var b_measure=b.vars.Duree.value;
					b_endDate.setDate(b_endDate.getDate() + b_measure);			
										
					return a_endDate-b_endDate;
				});
				
				
				var date_debut=new Date(scenes[scenes.length - 1].vars.Date_debut.toString())
				var measure=scenes[scenes.length - 1].vars.Duree.value
				timeDomainEnd = d3.timeDay.offset(date_debut, measure);
				
				scenes.sort(function(a, b) {
				return (new Date(a.vars.Date_debut.toString()) - new Date(b.vars.Date_debut.toString()));
				});
				timeDomainStart = new Date(scenes[0].vars.Date_debut.toString());
			}
			};
			
			function initAxis() {
				var tickFormat = model.tickFormat;
				x = d3.scaleTime().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

				y = d3.scaleBand().domain(taskTypes).rangeRound([ 0, height - margin.top - margin.bottom ], .1);

				xAxis = d3.axisBottom().scale(x).tickFormat(d3.timeFormat(tickFormat))
				  .tickSize(8).tickPadding(8);

				yAxis = d3.axisLeft().scale(y).tickSize(0);
			  };

			
			 function gantt(scenes) {

				initTimeDomain();
				initAxis();
				d3.select(".tooltip").remove();
				var div = d3.select("body").append("div")	
                  .attr("class", "tooltip")				
                  .style("opacity", 0);

				var svg = d3.select(container.node())
				  .append("svg")
				  .attr("class", "chart")
				  .attr("width", width + margin.left + margin.right)
				  .attr("height", height + margin.top + margin.bottom)
				  .append("g")
				  .attr("class", "gantt-chart")
				  .attr("width", width + margin.left + margin.right)
				  .attr("height", height + margin.top + margin.bottom)
				  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

				svg.selectAll(".chart")
				  .data(scenes, keyFunction).enter()
				  .append("rect")
				  .attr("rx", 5)
				  .attr("ry", 5)
				  .attr("class", function(scene){ 
				  if(taskStatus[scene.vars.Statut] == null){ return "bar task";}
					return taskStatus[scene.vars.Statut.toString()]+" task";
				  }) 
				  .attr("y", 0)
				  .attr("transform", rectTransform)
				  .attr("height", function(scene) { return y.bandwidth()-6; })
				  .attr("width", function(scene) { 
					 var Date_debut= new Date(scene.vars.Date_debut.toString());
			         var endDate= new Date(Date_debut);
			         var measure=scene.vars.Duree.value;
			         endDate.setDate(endDate.getDate() + measure);		
					 return (x(endDate)-x(Date_debut));
				  })
				  // Popup on mouseover
				  .on("mouseover", function(scene,event) {		 
				    div.transition()		
					.duration(200)		
					.style("opacity", .9);		
				    div.html(scene.vars.Date_debut.toString() + " "  + scene.vars.Categorie.toString() + " "  +scene.vars.Statut.toString()+" "+scene.vars.Duree.value+" day(s)")
					.style("left", (d3.event.pageX) + "px")		
					.style("top", (d3.event.pageY)+ "px");
				    });
                
				  svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
					.transition()
					.call(xAxis);
				  svg.append("g").attr("class", "y axis").transition().call(yAxis);	 				  
				  				  
				  return gantt;

			  };

			  gantt.margin = function(value) {
				if (!arguments.length)
				  return margin;
				margin = value;
				return gantt;
			  };

			  gantt.timeDomain = function(value) {
				if (!arguments.length)
				  return [ timeDomainStart, timeDomainEnd ];
				timeDomainStart = +value[0], timeDomainEnd = +value[1];
				return gantt;
			  };

				/**
			  * @param {string}
			  *                vale The value can be "fit" - the domain fits the data or
			  *                "fixed" - fixed domain.
			  */
			  gantt.timeDomainMode = function(value) {
				if (!arguments.length)
				  return timeDomainMode;
				timeDomainMode = value;
				return gantt;

			  };

			  gantt.taskTypes = function(value) {
				if (!arguments.length)
				  return taskTypes;
				taskTypes = value;
				return gantt;
			  };

			  gantt.taskStatus = function(value) {
				if (!arguments.length)
				  return taskStatus;
				taskStatus = value;
				return gantt;
			  };

			  gantt.width = function(value) {
				if (!arguments.length)
				  return width;
				width = +value;
				return gantt;
			  };

			  gantt.height = function(value) {
				if (!arguments.length)
				  return height;
				height = +value;
				return gantt;
			  };

			  gantt.tickFormat = function(value) {
				if (!arguments.length)
				  return tickFormat;
				tickFormat = value;
				return gantt;
			  };

			  return gantt;
			};
		
		/* Fin Drawing the Gantt */
		/*var tasks=[];*/
		var taskNames=[];
	    var statuses = [];
		/* Prepa des données pour le gantt*/
		/* Il faut ici convertir en date la string date_debut et calculer */
		/* La date de fin = date_debut+nbjour */
		/* on sttock tout dans la matrice task"*/
		/* pour le "statut, on affecte un ombre auquel correspondra une couleur dans la CSS : .bar-X*/

	    for(var i = 0, R = scenes.length; i < R; i++) {
          
			
			taskNames.push(scenes[i].vars.Categorie.toString());
			
			//Attribution d'un stlye à chaque status de tâche"
			var statuses_index=-1;
			  if(i==0)
			  { 
				 statuses.push(scenes[i].vars.Statut.toString());
				
			  }
			  else
			  {
				  
				  var found=false;
				  for(var t=0;t<statuses.length&&found==false;t++)
				  {
					  if(scenes[i].vars.Statut.toString()==statuses[t])
					  {
						found=true;					  
					  }
				  }
				  if(!found)
				  {				 
					 statuses.push(scenes[i].vars.Statut.toString());				 
				  }		 
				
			}
		}
		/*	var taskStatus = {
					"SUCCEEDED" : "bar-succeeded task",
					"FAILED" : "bar-failed task",
					"RUNNING" : "bar-running task",
					"KILLED" : "bar-killed task"
					};*/
		var taskStatus = {};
		for(var j=0;j<statuses.length;j++)
		{
			var columnName=statuses[j];
			taskStatus[columnName]="bar-"+j.toString();
			
		}
		
		
		/* Fin prepa donnée */
		
		
		var container = d3.select(this.domContainer);

		container.selectAll("*").remove();
		
	
		scenes.sort(function(scene) {
			return scene.vars.Duree.value;
		});
		
		var maxDate = new Date(scenes[scenes.length - 1].vars.Date_debut.toString()); //On prend la donnee 
		scenes.sort(function(a, b) {
			return (new Date(a.vars.Date_debut.toString()) - new Date(b.vars.Date_debut.toString()));
		});
		
		var minDate = new Date(scenes[0].vars.Date_debut.toString());

		var format = "%H:%M";

		var gantt = d3.gantt(container).taskTypes(taskNames).taskStatus(taskStatus).tickFormat(format);
		gantt(scenes);
		
        var cc = d3ClickController();
             
	    var bar = d3.selectAll(".task");
	    bar.call(cc);

	    cc.on("dblclick", function(event, scene) {
		// A filter that selects the data that the bar visually represents
		var filter = scene.createFilter();
        d3.select(".tooltip").remove();
		// Dispatch an "execute" action through the model
		model.execute({dataFilter: filter});
	    });

	    // Part 4 - Emit select action
	    cc.on("click", function(event, scene) {
		// A filter that selects the data that the bar visually represents
			var filter = scene.createFilter();
			d3.select(".tooltip").remove();
			
			// Dispatch a "select" action through the model
			
			model.select({
			  dataFilter: filter,
			  selectionMode: event.ctrlKey || event.metaKey ? "toggle" : "replace"
			});
			bar.classed("selected", function(scene) {
				var selectionFilter = model.selectionFilter;
			   var result=!!selectionFilter && dataTable.filterMatchesRow(selectionFilter, scene.index);
			   return result;
			});
		// Part 5 - Update each bars' selection state
	 
	     });
	 



	},
	
	   /**
     * Gets a label that describes a visual role given its mapping.
     *
     * @param {pentaho.visual.role.Mapping} mapping - The visual role mapping.
     * @return {string} The visual role label.
     * @private
     */
    __getRoleLabel: function(mapping) {

      if(!mapping.hasFields) {
        return "";
      }

      var data = this.model.data;

      var columnLabels = mapping.fieldIndexes.map(function(fieldIndex) {
        return data.getColumnLabel(fieldIndex);
      });

      return columnLabels.join(", ");
    }
  });
});