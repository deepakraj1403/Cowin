let mobilenumber = window.localStorage.getItem("mobile");
let state_name = window.localStorage.getItem("state");
let district_name = window.localStorage.getItem("district");
let first_5_pin_digits = window.localStorage.getItem("pincode");
let allow_multiple = window.localStorage.getItem("allow_multiple")==="true"?true:false;
let ageSelectorText = window.localStorage.getItem("age");
let searchByDistrictFlag = window.localStorage.getItem("searchpref")==="district"?true:false;
console.log(typeof(allow_multiple));

var waitForEl = function(selector, callback) {
  if ($(selector).length) {
    callback();
    
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

var waitForElAgain = function(selector, callback) {
  if ($(selector).length) {
    callback();
    waitForElAgain(selector, callback);
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

const repFun = () => {
  waitForEl("[formcontrolname=mobile_number]", function() {
    $("[formcontrolname=mobile_number]").val(mobilenumber);
    $("[formcontrolname=mobile_number]").on('input', (e) => {
      if(e.target.value.length===10){
        $('.login-btn').trigger('click');
      }
    })
  });
  
  waitForEl("[formcontrolname=otp]", function() {
    $("[formcontrolname=otp]").on('input', (e) => {
      if(e.target.value.length===6){
        $('.vac-btn').trigger('click');
      }
    })
  });
  
  waitForEl(".register-btn", () => {
    if(!!!allow_multiple) $('.register-btn').trigger('click');
  })

  const dispatchAgeSelectorClick = () => {
    setTimeout(()=>{
      $(`label:contains(${ageSelectorText})`).trigger('click');
    }, 500);
  }

  const dispatchStateDistrictClick = () => {
    // checked = district
    // unchecked = pincode
    setTimeout(()=>{
      if(searchByDistrictFlag) {
        if($("[formcontrolname=searchType]")[0] && !!!$("[formcontrolname=searchType]")[0].checked)
          $("[formcontrolname=searchType]").trigger('click')
      } else {
        $("[formcontrolname=pincode]").val(first_5_pin_digits);
      }
    }, 500);
  }

  waitForEl("[formcontrolname=searchType]", function() {

    dispatchStateDistrictClick();
    $("[formcontrolname=pincode]").on('input', (e) => {
      if(e.target.value.length===6){
        $('.pin-search-btn').trigger('click');
        dispatchAgeSelectorClick();
      }
    })
    
    $("[formcontrolname=searchType]").on('change', () => {
      let searchByDistrict = $("[formcontrolname=searchType]")[0].checked;
      if(searchByDistrict){
        $("[formcontrolname=state_id]").trigger('click');
        $(`span:contains(${state_name})`).trigger('click');
        setTimeout(()=>{
          $("[formcontrolname=district_id]").trigger('click');
          $(`span:contains(${district_name})`).trigger('click');
          setTimeout(()=>{
            $('.pin-search-btn').trigger('click');
          }, 500);
          dispatchAgeSelectorClick();
        }, 500);
      } else {
        $("[formcontrolname=pincode]").val(first_5_pin_digits);
        $("[formcontrolname=pincode]").on('input', (e) => {
          if(e.target.value.length===6){
            $('.pin-search-btn').trigger('click');
            dispatchAgeSelectorClick();
          }
        })
      
      }
  
    })
  })

}

$(window).on("load", () => {
  console.log("loaded");
  repFun();
});

let focus_ids = ["[formcontrolname=otp]", "[formcontrolname=mobile_number]", "[formcontrolname=pincode]"];

if (window.location.hash) {
  $(window).trigger('hashchange')
}
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const get_mins = (tm) => {
  let mins = Math.floor(tm/60);
  let secs = Math.floor(tm - mins * 60);
  return `${mins}:${secs}`
}

const expirationUpdate = () => {
  let token = window.sessionStorage["userToken"];
  if(token===undefined){
    return;
  }
  let parsed = parseJwt(token);
  if(!!!parsed){
    return;
  }
  let exp = parsed.exp;
  let curr = new Date();
  let expd = new Date(0);
  expd.setUTCSeconds(exp);
  document.title = get_mins((expd - curr)/1000);
}

setInterval(expirationUpdate, 5000);


var current_href = location.href;
setInterval(function(){
    if(current_href !== location.href){
        repFun();
        current_href = location.href;
    }else{
    }
},100);


const keep_focusing = () => {

  setInterval(()=>{
    focus_ids.forEach(element => {
      
      if($("#formWrapper").is(":hidden")) if($(element).length!==0) $(element).focus();
    });
    
  }, 1000);  
}


keep_focusing();

const createInput = (id, style, type, value) => {
  let retel = document.createElement("input");
  retel.id = id;
  retel.type = type;
  retel.style = style;
  retel.value = value;
  return retel;
}

const createLabel = (id, forid, labelText, style) => {
  let retel = document.createElement("label");
  retel.id = id;
  retel.for = forid;
  retel.appendChild(document.createTextNode(labelText));
  retel.style = style;
  return retel;
}

const createWarningText = (warningtext, style) => {
  let retel = document.createElement('p');
  retel.appendChild(document.createTextNode(warningtext));
  retel.style = style;
  return retel;
}

const createSelectInput = (id, style, value) => {
  let retel = document.createElement("select");
  retel.style = style;
  retel.id = id;
  retel.value = value;
  return retel;
}

const createSelectOptions = (id, text, value, selected) => {
  let retel = document.createElement("option");
  retel.id = id;
  retel.value = value;
  retel.appendChild(document.createTextNode(text));
  if(selected) retel.selected = true;
  return retel;
}
 
const createForm = () => {

  // basic styles : reused
  let textLabelStyles = "color: black; padding-left: 1%;";
  let inputStyles = "color: black; background: white;";
  let warnLabelStyles = "color: red; padding-left: 1%;";

  // parent div for form
  let wrapperDiv = document.createElement("div");
  wrapperDiv.id = "formWrapper";
  wrapperDiv.style = "position: fixed; background: white; top: 12.5%; width: 75%; left: 12.5%; border: 3px solid #73AD21;"

  // mobile number input field
  let mobileinputid = "data-mob";
  let mobileInput = createInput(mobileinputid, inputStyles, "number", mobilenumber);
  let mobileLabel = createLabel("mobileinputlabel", mobileinputid, "Mobile number (first 9 digits): ", textLabelStyles);
  let mobileNumberWarn = createWarningText(
    "You will have to enter the 10th digit in the actual website form to proceed with automation.",
    warnLabelStyles
  )

  // pin code field
  let pincodeinputid = "pincodeinput";
  let pincodeinput = createInput(pincodeinputid, inputStyles, "number", first_5_pin_digits);
  let pincodelabel = createLabel("pincodeinputlabel", pincodeinputid, "PIN Code (First 5 digits)", textLabelStyles);
  let pincodewarn = createWarningText("You will have to enter the 6th digit in the actual website form manually to proceed with automation.", warnLabelStyles);

  // state name input field
  let stateinputid = "data-state";
  let stateInput = createInput(stateinputid, inputStyles, "text", state_name);
  let stateLabel = createLabel("stateinputlabel", stateinputid, "Name of the state: ", textLabelStyles)

  // district name input field
  let districtinputid = "data-district";
  let districInput = createInput(districtinputid, inputStyles, "text", district_name);
  let districLabel = createLabel("districtinputlabel", districtinputid, "District name: ", textLabelStyles);

  let ageSelector = createSelectInput("ageselect", inputStyles, ageSelectorText);
  let age18 = createSelectOptions("age18", "Age 18+", "Age 18+", ageSelectorText === "Age 18+");
  let age45 = createSelectOptions("age45", "Age 45+", "Age 45+", ageSelectorText === "Age 45+");
  ageSelector.appendChild(age18);
  ageSelector.appendChild(age45);
  let AgeSelectLabel = createLabel("ageselectlabel", "ageselect", "Age group: ", textLabelStyles)


  // multiple members allow checkbox
  let allowMultipleid = "allowMultiple";
  let allowMultipleInput = createInput(allowMultipleid, inputStyles, "checkbox", "");
  allowMultipleInput.checked = allow_multiple;
  let allowMultipleInputLabel = createLabel("multipleinputlabel", allowMultipleid, "Allow multiple members", textLabelStyles);
  let allowMultipleWarn = createWarningText("This will prevent automatic click on the Schedule Now button", warnLabelStyles);

  // search preferrance
  let searchprefid = "searchpref";
  let searchPrefSelector = createSelectInput(searchprefid, inputStyles, searchByDistrictFlag?"district":"pincode");
  let districtoption = createSelectOptions("districtoption", "District", "district", searchByDistrictFlag);
  let pincodeoption = createSelectOptions("pincodeoption", "PIN code", "pincode", !!!searchByDistrictFlag);
  searchPrefSelector.appendChild(districtoption);
  searchPrefSelector.appendChild(pincodeoption);
  let searchPrefLabel = createLabel("searchpreflabel", searchprefid, "Search by", textLabelStyles);

  // submit button
  let submitButton = document.createElement("button");
  submitButton.appendChild(document.createTextNode("Save inputs"));
  submitButton.id = "data-submit";
  submitButton.style = "color: black; background: #c2d6d6; font-size:20px; border-radius: 10px;"

  // cancel button
  let cancelbutton = document.createElement("button");
  cancelbutton.id = "cancelbutton";
  cancelbutton.appendChild(document.createTextNode("Cancel"));
  cancelbutton.style = "color: white; background: black; font-size:20px; border-radius: 10px;";

  // add components to wrapper div
  wrapperDiv.appendChild(mobileLabel);
  wrapperDiv.appendChild(mobileInput);
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(mobileNumberWarn);
  wrapperDiv.appendChild(document.createElement('hr'));
  wrapperDiv.appendChild(pincodelabel);
  wrapperDiv.appendChild(pincodeinput);
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(pincodewarn);
  wrapperDiv.appendChild(document.createElement('hr'));

  wrapperDiv.appendChild(stateLabel);
  wrapperDiv.appendChild(stateInput);
  wrapperDiv.appendChild(document.createElement('hr'));
  wrapperDiv.appendChild(districLabel);
  wrapperDiv.appendChild(districInput);
  wrapperDiv.appendChild(document.createElement('hr'));
  wrapperDiv.appendChild(AgeSelectLabel);
  wrapperDiv.appendChild(ageSelector);
  wrapperDiv.appendChild(document.createElement('hr'));

  wrapperDiv.appendChild(allowMultipleInputLabel);
  wrapperDiv.appendChild(allowMultipleInput);
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(allowMultipleWarn);
  wrapperDiv.appendChild(document.createElement('hr'));
  wrapperDiv.appendChild(searchPrefLabel);
  wrapperDiv.appendChild(searchPrefSelector);
  wrapperDiv.appendChild(document.createElement('hr'));
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(submitButton);
  wrapperDiv.appendChild(cancelbutton)
  wrapperDiv.appendChild(document.createElement('br'));
  wrapperDiv.appendChild(document.createElement('br'));

  // add form
  document.body.appendChild(wrapperDiv);
}

const createHideShowButton = () => {
  $("#formWrapper").hide();
  let formShowHide = document.createElement("button");
  formShowHide.id = "formshowhidebutton";
  formShowHide.appendChild(document.createTextNode("click to edit the autofill inputs"));
  formShowHide.style = "background: red; position: sticky; top:0; left: 0; font-size: 32px; border-radius: 20px;";
  document.body.appendChild(formShowHide);
  $('#formshowhidebutton').on('click', ()=>{
    $("#formWrapper").toggle();
  })
}

const bindSubmitButtonToSaveInfo = () => {
  let submitbtn = document.getElementById("data-submit");
  let cancelbutton = document.getElementById("cancelbutton");
  cancelbutton.addEventListener("click", () => {
    $("#formWrapper").toggle();
  });
  submitbtn.addEventListener("click", () => {
    mobilenumber = document.getElementById("data-mob").value;
    state_name = document.getElementById("data-state").value;
    district_name = document.getElementById("data-district").value;
    allow_multiple = document.getElementById("allowMultiple").checked;
    ageSelectorText = document.getElementById("ageselect").value;
    let searchPreftext = document.getElementById("searchpref").value;
    first_5_pin_digits = document.getElementById("pincodeinput").value;
    console.log(allow_multiple);
    $("#formWrapper").hide();
    window.localStorage.setItem("mobile", mobilenumber);
    window.localStorage.setItem("state", state_name);
    window.localStorage.setItem("district", district_name);
    window.localStorage.setItem("allow_multiple", allow_multiple);
    window.localStorage.setItem("age", ageSelectorText);
    window.localStorage.setItem("searchpref", searchPreftext);
    window.localStorage.setItem("pincode", first_5_pin_digits);
    window.location.reload();
  })
}

const createFormAndOthers = () => {
  createForm();
  createHideShowButton();
  bindSubmitButtonToSaveInfo();
}

createFormAndOthers();
