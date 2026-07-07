//====================================================
// El Niño Dashboard
// Google Apps Script JSON Version
//====================================================

const apiURL =
"https://script.google.com/macros/s/AKfycbwk2TtKwzNSW50aJAFPrtB5MfJq62d-ijHlShWQMJ83zLfossaIh47rCqttrz3beG232w/exec";

let advisoryData = [];

const stateSelect = document.getElementById("state");
const districtSelect = document.getElementById("district");
const messageBox = document.getElementById("message");

//--------------------------------------------
// Load data
//--------------------------------------------

async function loadData(){

    try{

        const response = await fetch(apiURL);

        advisoryData = await response.json();

        loadStates();

    }

    catch(error){

        console.error(error);

        messageBox.innerHTML =
        "Unable to connect to Google Sheet.";

    }

}

//--------------------------------------------
// Load States
//--------------------------------------------

function loadStates(){

    const states =
    [...new Set(advisoryData.map(item=>item.State))];

    stateSelect.innerHTML =
    '<option value="">Select State</option>';

    states.sort();

    states.forEach(state=>{

        stateSelect.innerHTML +=
        `<option value="${state}">${state}</option>`;

    });

}

//--------------------------------------------
// State Changed
//--------------------------------------------

stateSelect.addEventListener("change",function(){

    districtSelect.innerHTML =
    '<option value="">Select District</option>';

    messageBox.innerHTML =
    "Please select a district.";

    const districts =
    advisoryData.filter(item=>item.State===this.value);

    districts.forEach(item=>{

        districtSelect.innerHTML +=
        `<option value="${item.District}">
        ${item.District}
        </option>`;

    });

});

//--------------------------------------------
// District Changed
//--------------------------------------------

districtSelect.addEventListener("change",function(){

    const state = stateSelect.value;

    const district = this.value;

    const record =
    advisoryData.find(item=>

        item.State===state &&
        item.District===district

    );

    if(record){

        messageBox.innerHTML = record.Message;

    }

});

//--------------------------------------------

loadData();