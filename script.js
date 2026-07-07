//==========================================
// El Niño Dashboard
//==========================================

const apiURL = "https://script.google.com/macros/s/AKfycbwk2TtKwzNSW50aJAFPrtB5MfJq62d-ijHlShWQMJ83zLfossaIh47rCqttrz3beG232w/exec";

let advisoryData = [];

const stateSelect = document.getElementById("state");
const districtSelect = document.getElementById("district");
const messageBox = document.getElementById("message");

//-----------------------------------

async function loadData(){

    try{

        console.log("Loading data...");

        const response = await fetch(apiURL);

        advisoryData = await response.json();

        console.log("Data Loaded:", advisoryData);

        loadStates();

    }

    catch(err){

        console.error(err);

        messageBox.innerHTML="Unable to load data.";

    }

}

//-----------------------------------

function loadStates(){

    stateSelect.innerHTML='<option value="">Select State</option>';

    const states=[...new Set(advisoryData.map(item=>item.State.trim()))];

    console.log(states);

    states.forEach(state=>{

        let option=document.createElement("option");

        option.value=state;

        option.textContent=state;

        stateSelect.appendChild(option);

    });

}

//-----------------------------------

stateSelect.addEventListener("change",function(){

    districtSelect.innerHTML='<option>Select District</option>';

    messageBox.innerHTML="";

    const districts=advisoryData.filter(item=>item.State.trim()==this.value);

    districts.forEach(item=>{

        let option=document.createElement("option");

        option.value=item.District;

        option.textContent=item.District;

        districtSelect.appendChild(option);

    });

});

//-----------------------------------

districtSelect.addEventListener("change",function(){

    const row=advisoryData.find(item=>

        item.State.trim()==stateSelect.value &&

        item.District.trim()==districtSelect.value

    );

    if(row){

        messageBox.innerHTML=row.Message;

    }

});

//-----------------------------------

loadData();
