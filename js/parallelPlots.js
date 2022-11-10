var data = [];
const bounds = {};

const loadData = (file) => {
  // read the csv file
  d3.csv(file).then(function (
    fileData // iterate over the rows of the csv file
  ) {
    fileData.forEach((d) => {
      // get the min bounds
      bounds.minEnergy = Math.min(bounds.minEnergy || Infinity, d.energy);

      // get the max bounds
      bounds.maxEnergy = Math.max(bounds.maxEnergy || -Infinity, d.energy);
    
      // add the element to the data collection
      data.push({
        bulk_symbols:   d.bulk_symbols,
        ads_symbols:    d.ads_symbols,
        miller_index:   d.miller_index,
        energy:         d.energy,
        bulk_mpid:      d.bulk_mpid,
        class:          d.class,
        shift:          d.shift,
        top:            d.top,
        adsorption_site:d.adsorption_site
      });
    });
    console.log(data[0])
    console.log(bounds)
  });
};

loadData("./data/clean_data_vds.csv");

