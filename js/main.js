const url ='https://api.github.com/repositories/19438/commits';

//function to make offBoard request
const getData = (url) => {
  console.debug(` Get data request started at  ${new Date().toJSON()}`);
  return fetch(url)
    .then(handleErrors)
    .then(response => response.json())
    .then(data => {
      console.debug(` Get data request successful at  ${new Date().toJSON()}`);
      return populateTable(data);
    })
    .catch(function(error) {
      console.debug(` Get data request error at  ${new Date().toJSON()}`);
      console.debug(` Error type  ${error}`);
      return populateTable();
    });
}

//error handler
const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

//function to populate table
const populateTable = (data = []) => {
  console.debug(` Table population started at ${new Date().toJSON()}`);
  let t = "";
  if(data.length > 0){
    for (let i = 0; i < data.length; i++){
      let tr = "<tr>";
      let currentRow = i+1;
      tr += "<td>"+currentRow+"</td>";
      tr += "<td>"+data[i].commit.author.name+"</td>";
      tr += "<td>"+data[i].commit.author.date+"</td>";
      tr += "<td>"+data[i].commit.message+"</td>";
      tr += "<td>"+data[i].commit.url+"</td>";
      tr += "</tr>";
      t += tr;
    }
  } else {
    t = "<tr><th style='text-align:center;' colspan='5' scope='row'>No Data Available</tr></th";
  }
  console.debug(`Table population completed at ${new Date().toJSON()}`);
  return document.getElementById("tableContent").innerHTML = t;
}

//function to sort table
const sortTable = (n = 0,isNum = false) => {
  let table, tableRows, loopThrough, i, x, y, shouldSwitch, dir, switchCount = 0;

  console.debug(` Table sorting started at ${new Date().toJSON()}`);
  // table selector
  table = document.getElementById("myTable");
  loopThrough = true;
  // default direction to ascending
  dir = "asc";

  //loop to switch each row
  while (loopThrough) {
    //start by saying: no loopThrough is done:
    loopThrough = false;
    tableRows = table.getElementsByTagName("tr");

    //for loop to loop through each table elements apart from the header
    for (i = 1; i < (tableRows.length - 1); i++) {
      //set Loop to false
      shouldSwitch = false;
      //compare current and next row
      x = tableRows[i].getElementsByTagName("td")[n].innerHTML;
      y = tableRows[i + 1].getElementsByTagName("td")[n].innerHTML;
      //check if current row is numeric
      if (isNum) {
        //convert to float for comparison
        x = parseFloat(x);
        y = parseFloat(y);
      } else {
        // change to lowercase for comparison
        x = x.toLowerCase();
        y = y.toLowerCase();
      }

      //compare row switching base on direction
      shouldSwitch = ((dir === "asc") && (x > y)) || ((dir === "desc" && (x < y)));

      if (shouldSwitch) {
        //switch the two compared rows
        tableRows[i].parentNode.insertBefore(tableRows[i + 1], tableRows[i]);
        loopThrough = true;
        // increase switch counter to move to next line
        switchCount++;
      } else {
        //if on click no loop is performed, reverse the loop to desc to perform desc switching
        if (switchCount === 0 && dir === "asc") {
          dir = "desc";
          loopThrough = true;
        }
      }
    }
  }
  console.debug(`Table sorting completed at ${new Date().toJSON()}`);
}

//listener on windows load
window.addEventListener('load', function() {
  getData(url);
}, true);
