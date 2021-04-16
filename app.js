
// Function to be called upon update of selection via HTML
function loadPage(sampleId){

    // console.log(sampleId);

    d3.json("samples.json").then((sampleData) => {
                
        filteredData = sampleData.metadata.filter(obj => obj.id == sampleId);
        var demoPanel = d3.select("#sample-metadata");
        demoPanel.html("");
        Object.entries(filteredData[0]).forEach(([key, value]) => {
            demoPanel.append("h5").text(key + ": " + value)
        })


        filteredData = sampleData.samples.filter(obj => obj.id == sampleId);
        // console.log(filteredData);

        // HORIZONTAL BAR PLOT for the Sample Values by OTU:
        var trace1 = {
            x: filteredData[0].sample_values.slice(0,10).reverse(),
            y: filteredData[0].otu_ids.slice(0,10).map(el => "OTU " + el).reverse(),
            text: filteredData[0].otu_labels.slice(0,10).reverse(),
            name: "OTUs",
            type: "bar",
            orientation: "h"
        };

        // data
        var chartData = [trace1];

        // Apply the group bar mode to the layout
        var layout = {
            title: "Occurances by OTU ID",
            margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
            }
        };

        // Render the horizontal bar plot to the div tag with id "bar"
        Plotly.newPlot("bar", chartData, layout);


        // BUBBLE CHART for each Sample:
        var trace1 = {
            x: filteredData[0].otu_ids,
            y: filteredData[0].sample_values,
            text: filteredData[0].otu_labels,
            mode: 'markers',
            marker: {
            color: filteredData[0].otu_ids,
            size: filteredData[0].sample_values
            }
        };
        
        var data = [trace1];
        
        var layout = {
        title: 'Bubble Chart OTU Prevalence',
        showlegend: false,
        height: 600,
        width: 1200
        };
        
        Plotly.newPlot('bubble', data, layout);

    
		// GAUGE CHART for Wash Frequency of Participants:
		filteredData = sampleData.metadata.filter(obj => obj.id == sampleId);
		//console.log(filteredData);

		var data = [
			{
				domain: { x: [0, 1], y: [0, 1] },
				value: filteredData[0].wfreq,
				title: { text: "Wash Frequency of Participant (Scrubs per Week)" },
				type: "indicator",
				mode: "gauge+number"
			}
		];
		
		var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
		Plotly.newPlot('gauge', data, layout);
		
	});

}

// Use D3 fetch to read the JSON file
d3.json("samples.json").then((sampleData) => {
    
    //console.log(sampleData);
    var data = sampleData;

    var dropdown = d3.select("#selDataset");

    data.names.forEach( (id) => {
        console.log(id)
        dropdown.append("option").text(id).property("value", id);
    });
  
    loadPage(data.names[0])
    
    function updatePlotly(newParticipant) {

        var barchart = document.getElementById("bar");
        Plotly.restyle(barchart, "values", [newParticipant]);
    }

   

});

// Function to catch selection of participant in HTML
function optionChanged(participant) {

    loadPage(participant);
}