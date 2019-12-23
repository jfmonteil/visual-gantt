# v8-gantt-graph-viz
Gantt Graph vizualisation for Pentaho V8.3+

This is the adaptaion of a d3js Gantt to Pentaho V8 (Viz API 3.0)
This **does not work** with V7 of Pentaho
The original d3js is here : [d3js Gantt](http://bl.ocks.org/dk8996/5449641)

The following dimensions are needed :

 - Start date of the task : (String) 
 - Category of the task (String) Each category has a bar   
 - Status of the task, the bar will be colored according to the status (15 different statuses can be defined - free values)

The following measure needs to be defined :

 - Number of days : length of the task in days
 
More details here : https://www.linkedin.com/pulse/ajouter-un-graph-d3js-dans-pentaho-analyzer-avec-la-nouvelle-monteil/
 
## Support Statement
 
This work is at Stage 1 : Development Phase: Start-up phase of an internal project. Usually a Labs experiment. (Unsupported)



