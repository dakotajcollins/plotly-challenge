function optionChanged(ID){

  console.log(ID)
  let samples_path = "../samples.json"
  d3.json(samples_path).then(function(data){
    console.log(data)

    data.metadata.forEach(id => {
      d3.selectAll("#selDataset").append('option').attr('value',id.id).text(id.id)
    })

    d3.selectAll("#selDataset").node().value = ID;

    var indv_info = data.metadata.filter(i=> (i.id == ID));

    console.log(indv_info)

    var info = d3.select("#sample-metadata");
    info.html("");
    Object.entries(indv_info[0]).forEach(i=> {
          info.append("p").text(`${i[0]}: ${i[1]}`)
    });  


    var id2 = data.samples.filter(item => parseInt(item.id) == ID);

    console.log(id2)

    var values = id2[0].sample_values.slice(0,10).reverse()
    var otus =  id2[0].otu_ids.slice(0,10).reverse()
    var otu = otus.map(item => `OTU: ${item}`)
    var labels =  id2[0].otu_labels.slice(0,10).reverse()

    // bar chart

    let trace1 = {
      x: values,
      y: otu,
      text: labels,
      name: "OTU",
      type: "bar",
      orientation: "h",
    };
  
    let traceData = [trace1];
  
    let layout = {
      title: `Top OTUs found in Patient: ${ID}`,
    };
  
    Plotly.newPlot("bar", traceData,layout);

    // bubble graph

    var all_values = id2[0].sample_values
    var all_otu = id2[0].otu_ids


    var trace2 = {
      x: all_otu,
      y: all_values,
      mode: 'markers',
      marker: {
        size: all_values,
        color: all_otu
      }
    };
    
    var bub = [trace2];
    
    var layout2 = {
      title: 'Prevalence of OTU in Patient',
      showlegend: false,
      xaxis:{
        title:'OTU ID'
      }
    };
    
    Plotly.newPlot('bubble', bub, layout2);


    // Guage viz

    var scrub = indv_info[0].wfreq

    var gauge = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: scrub,
        title: { text: "Scrubs per Week", font: { size: 16 } },
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "red" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 1], color: "white" },
            { range: [1, 2], color: "aliceblue" },
            { range: [2, 3], color: "lightcyan" },
            { range: [3, 4], color: "lightblue" },
            { range: [4, 5], color: "cyan" },
            { range: [5, 6], color: "darkturquoise" },
            { range: [6, 7], color: "royalblue" },
            { range: [7, 8], color: "mediumblue" },
            { range: [8, 9], color: "navy" }
          ],
          threshold: {
            line: { color: "red", width: 3 },
            thickness: 0.75,
            value: scrub
          }
        }
      }
    ];
    
    var layout3 = {
      title: "Belly Button Washing Frequency",
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial", size: 20,  fontWeight: "bold"}
    };
    
    Plotly.newPlot('gauge', gauge, layout3);
  
  });
}
optionChanged(940);