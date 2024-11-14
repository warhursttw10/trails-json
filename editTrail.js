import { saveToStorage } from './trails.js';

function getTrailByID(id) {
    if (!id) {
        return null;
    }

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
function generateForm(fields, trailID) {
    const trail = getTrailByID(trailID);
    const form = document.createElement('form');
    form.id = 'editTrailForm';

    fields.forEach(field => {
        const label = document.createElement('label');
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');


        label.textContent = field.name;
        legend.textContent = field.name;
        fieldset.appendChild(legend);

        const input = document.createElement('input');

        // set up differently depending on the type of field, options are fields.type = text, checkbox, or toggle. If text create a text input, if checkbox create a checkbox input, if toggle create single checkbox input
        if (field.type === 'text') {
            input.type = 'text';
            input.name = field.name;
            input.value = trail ? trail[field.name] ?? '' : '';
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
                optionInput.checked = trail ? trail[field.name].map(value => value.toLowerCase()).includes(option.toLowerCase()) : false;
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

            input.checked = trail ? trail[field.name] : false;
            label.appendChild(input);
            fieldset.appendChild(label);
            form.appendChild(fieldset);
        }
        if(field.type === 'object') {
            console.log(field);
            field.options.forEach(option => {
                const optionInput = document.createElement('input');
                optionInput.type = 'text';
                optionInput.value = trail ? trail[field.name][option] ?? '' : '';
                optionInput.name = option;
                const optionLabel = document.createElement('label');
                optionLabel.textContent = option;
                optionLabel.appendChild(optionInput);
                fieldset.appendChild(optionLabel);
                form.appendChild(fieldset);
            });
        }
    });

    // create submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', (event) => {
        // prevent form from submitting
        event.preventDefault();

        editTrail(trailID);
    });

    form.appendChild(submitButton);
    document.body.appendChild(form);
}


function editTrail(trailID) {
    const form = document.getElementById('editTrailForm');
    const formData = new FormData(form);
    
    let formoutput;
    for (const [key, value] of formData) {
        formoutput += `${key}: ${value}\n`;
      }

      console.log(formoutput);

    const updatedTrail = {
        title: formData.get('title'),
        communities: formData.getAll('communities'),
        activities: formData.getAll('activities'),
        length: formData.get('length').split(',').map(Number),
        pets: formData.get('pets') !== null,
        accessibility: formData.get('accessibility') !== null,
        fee: formData.get('fee') !== null,
        bikeRepair: formData.get('bikeRepair') !== null,
        waterViews: formData.get('waterViews') !== null,
        filename: formData.get('filename'),
        image: formData.get('image'),
        spatialReference: formData.get('spatialReference')
    };

    const xMin = formData.get('xMin');
    const xMax = formData.get('xMax');
    const yMin = formData.get('yMin');
    const yMax = formData.get('yMax');

    if (xMin && xMax && yMin && yMax) {
        updatedTrail.bounds = {
            xMin: Number(xMin),
            xMax: Number(xMax),
            yMin: Number(yMin),
            yMax: Number(yMax)
        };
    }

    console.log(updatedTrail);

    const trails = JSON.parse(localStorage.getItem('trails'));
    if(trailID) {
        trails[trailID] = updatedTrail;
    } else {
        trails.push(updatedTrail);
    }
    
    saveToStorage(trails);
    location.href = 'index.html';
}


document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchJSONData();
    // generate form fields
    
    const trailID = new URLSearchParams(window.location.search).get('id');

    generateForm(data, trailID);
});