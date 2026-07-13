//==========================================================
// El Niño Preparedness District Contingent Plan Dashboard
// Version 2.0
//==========================================================

const apiURL =
"https://script.google.com/macros/s/AKfycbxk062j8IyhbMQs082nWduVPzd51O33bzMLlHqAQK5OX_X30mgBIjZ5X3xxVlLGlm7U8w/exec";

let advisoryData = [];

//---------------------------------------------
// HTML Elements
//---------------------------------------------

const stateSelect = document.getElementById("state");
const districtSelect = document.getElementById("district");

const infoState = document.getElementById("infoState");
const infoDistrict = document.getElementById("infoDistrict");
const issueNo = document.getElementById("issueNo");
const issueDate = document.getElementById("issueDate");
const preparedBy = document.getElementById("preparedBy");

const pdfViewer = document.getElementById("pdfViewer");

const viewBtn = document.getElementById("viewBtn");
const downloadBtn = document.getElementById("downloadBtn");

//---------------------------------------------
// Load Data
//---------------------------------------------

async function loadData() {

    try {

        const response = await fetch(apiURL);

        advisoryData = await response.json();

        console.log(advisoryData);
        console.log(Object.keys(advisoryData[0]));

        loadStates();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load Google Sheet data.");

    }

}

//---------------------------------------------
// Load States
//---------------------------------------------

function loadStates() {

    stateSelect.innerHTML =
    '<option value="">Select State</option>';

    const states =
    [...new Set(advisoryData.map(item => item.State.trim()))];

    states.sort();

    states.forEach(state => {

        const option =
        document.createElement("option");

        option.value = state;

        option.textContent = state;

        stateSelect.appendChild(option);

    });

}

//---------------------------------------------
// State Changed
//---------------------------------------------

stateSelect.addEventListener("change", function () {

    districtSelect.innerHTML =
    '<option value="">Select District</option>';

    const districts =
    advisoryData.filter(item =>
        item.State.trim() === this.value
    );

    districts.sort((a,b)=>
        a.District.localeCompare(b.District)
    );

    districts.forEach(item => {

        const option =
        document.createElement("option");

        option.value = item.District;

        option.textContent = item.District;

        districtSelect.appendChild(option);

    });

});

//---------------------------------------------
// District Changed
//---------------------------------------------

districtSelect.addEventListener("change", function () {

    const row =
    advisoryData.find(item =>

        item.State.trim() === stateSelect.value &&
        item.District.trim() === districtSelect.value

    );

    if (!row) return;

    //-----------------------------------------
    // Information
    //-----------------------------------------

    infoState.innerHTML = row.State;

    infoDistrict.innerHTML = row.District;

    issueNo.innerHTML = row.Issue_No;

    const formattedDate = new Date(row.Issue_Date);

    issueDate.innerHTML = formattedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
    });

    preparedBy.innerHTML = row.Prepared_By;

    //-----------------------------------------
    // Google Drive PDF
    //-----------------------------------------

    const pdfURL = row.PDF_URL;

    const fileID =
    pdfURL.match(/\/d\/(.*?)\//)[1];

    //-----------------------------------------
    // Preview
    //-----------------------------------------

    pdfViewer.src =
    "https://drive.google.com/file/d/" +
    fileID +
    "/preview";

    //-----------------------------------------
    // View
    //-----------------------------------------

    viewBtn.href = pdfURL;

    //-----------------------------------------
    // Download
    //-----------------------------------------

    downloadBtn.href =
    "https://drive.google.com/uc?export=download&id=" +
    fileID;

});

//---------------------------------------------
// Print PDF
//---------------------------------------------

function printPDF(){

    window.open(viewBtn.href);

}

//---------------------------------------------
//---------------------------------------------
// Visitor Counter
//---------------------------------------------

async function loadVisitorCount(){

    try{

        const response = await fetch(apiURL + "?action=visitor");

        const data = await response.json();

        document.getElementById("visitorCount").innerHTML =
            data.visitors;

    }

    catch(error){

        console.log(error);

    }

}
loadData();
loadVisitorCount();
