import { saveToStorage } from './trails.js';

const trailID = new URLSearchParams(window.location.search).get('id');

function getTrailByID(id) {
   const trails = JSON.parse(localStorage.getItem('trails'));
    console.log(trails[id]);
    return trails[id];
}

/*
* Fetches JSON data from a URL and returns it as a JavaScript object
*/
export async function fetchJSONData() {
    const url = 'form.json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.filters;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// generate form based on trail data and prepopulate with trail data
function generateForm(fields, trail) {
    const form = document.createElement('form');
    form.id = 'editTrailForm';

    fields.forEach(field => {
        const label = document.createElement('label');
        const fieldset = document.createElement('fieldset');


        label.textContent = field.name;

        const input = document.createElement('input');

        // set up differently depending on the type of field, options are fields.type = text, checkbox, or toggle. If text create a text input, if checkbox create a checkbox input, if toggle create single checkbox input
        if (field.type === 'text') {
            input.type = 'text';
            input.value = trail[field.name];
            label.appendChild(input);
            fieldset.appendChild(label);
            form.appendChild(fieldset);
        }
        if (field.type === 'checkbox') {
            input.type = 'checkbox';
            // loop through the array of values and create a checkbox for each one
            field.options.forEach(option => {
                const optionInput = document.createElement('input');
                optionInput.type = 'checkbox';
                optionInput.value = option;
                optionInput.name = field.name;
                optionInput.checked = trail[field.name].includes(option);
                const optionLabel = document.createElement('label');
                optionLabel.textContent = option;
                optionLabel.appendChild(optionInput);
                fieldset.appendChild(optionLabel);
                form.appendChild(fieldset);
            });
        }
        if (field.type === 'toggle') {
            input.type = 'checkbox';
            input.name = field.name;
            // input.checked = trail[field.name];
            label.appendChild(input);
            fieldset.appendChild(label);
            form.appendChild(fieldset);
        }


 
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', (event) => {
        // prevent form from submitting
        event.preventDefault();

        editTrail(trail);
    });
    form.appendChild(submitButton);

    document.body.appendChild(form);
}


function createInput(label, type, value) {
    const labelElement = document.createElement('label');
    labelElement.textContent = label;

    const input = document.createElement('input');
    input.type = type;
    input.value = value;
    input.name = label;

    labelElement.appendChild(input);

    return labelElement;
}

function editTrail(trail) {
    const form = document.getElementById('editTrailForm');
    const formData = new FormData(form);
    let formoutput;
    for (const [key, value] of formData) {
        formoutput += `${key}: ${value}\n`;
      }

    const updatedTrail = {
        title: formData.get('Title'),
        communities: formData.get('Communities'),
        activities: formData.get('Activities'),
        length: formData.get('Length'),
        pets: formData.get('Pets') !== null,
        accessibility: formData.get('Accessibility') !== null,
        fee: formData.get('Fee') !== null,
        bikeRepair: formData.get('Bike Repair')!== null,
        waterViews: formData.get('Water Views') !== null
    };

    console.log(updatedTrail);

    const trails = JSON.parse(localStorage.getItem('trails'));
    trails[trailID] = updatedTrail;
    // saveToStorage(trails);
    // location.href = 'index.html';
}


document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchJSONData();
    // generate form fields
    

    generateForm(data, getTrailByID(trailID));
});