function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 

    console.log(data);

    var id_data = data.samples;
    var id_meta = data.metadata;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = id_data.filter(sampleObj => sampleObj.id == sample);
    var metadaArray = id_meta.filter(metadaObj => metadaObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var sample_data = sampleArray[0];
    var metada_data = metadaArray[0];
    console.log(sample_data);
    console.log(metada_data);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids_data = sample_data.otu_ids;
    console.log(otu_ids_data);
    var otu_lab_data = sample_data.otu_labels;
    console.log(otu_lab_data);
    var sample_values_data = sample_data.sample_values;
    console.log(sample_values_data);

    var wFreq_val = metada_data.wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    top10_sampValues = sample_values_data.sort((a,b) => a - b).reverse().slice(0,10);
    //top10_sampIDs = 
    console.log(top10_sampValues);

    var yticks = otu_ids_data.slice(0,10).map(id => "OTU "+id.toString() + " ");

    // 8. Create the trace for the bar chart. 
    var barData = [{
        type: 'bar',
        y: yticks,
        x: top10_sampValues.reverse(),
        orientation: "h",
        text: otu_lab_data.slice(0,10)
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title:"Top 10 Bacteria Found"
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar",barData,barLayout); 
   
    //var colorsBubble = otu_ids_data.map(id => "rgb("+id.toString());
    //console.log(colorsBubble);


    // Bubble chart ///////////////
    var bubbleData = [{
        x: otu_ids_data,
        y: sample_values_data,
        text: otu_lab_data,
        mode: "markers",
        marker: {
            size:sample_values_data,
            color: otu_ids_data
        }
    }];

    var bubbleLayout = {
        title:"Bacteria Cultures Per Sample",
        xaxis:{title:"OTU ID"},
        showlegend: false,
        height: 600,
        width: 1200
    };

    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // Gauge chart ////////////////////
    var gaugeData = [{
        domain: {x:[0,1],y:[0,1]},
        value: wFreq_val,
        title: {text:"Belly Button Washing Frequency"},
        type:"indicator",
        mode: "gauge+number",
        gauge: {
            axis: {range:[null,10]},
            bar: {color:"black"},
            steps: [
                {range:[0,2], color:"red"},
                {range:[2,4], color:"orange"},
                {range:[4,6], color:"yellow"},
                {range:[6,8], color:"lightgreen"},
                {range:[8,10], color:"green"},
            ]
        }
     
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
        title: {text:"Belly Button"},
        width: 600,
        height: 500,
        margin: {t:0,b:0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
    
  });
}
