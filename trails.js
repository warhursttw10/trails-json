export async function fetchJSONData() {
    const url = 'data.json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.trails;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function generateTrailTable(data) {
    const table = document.createElement('table');
    table.classList.add('trail-table');

    const header = table.createTHead();
    const headerRow = header.insertRow(0);
    const headers = ['Title', 'Communities', 'Activities', 'Length', 'Pets', 'Accessibility', 'Fee', 'Bike Repair', 'Water Views'];
    headers.forEach((header, index) => {
        const cell = headerRow.insertCell(index);
        cell.textContent = header;
    });

    const body = table.createTBody();
    data.forEach((trail, index) => {
        const row = body.insertRow();
        const cells = [
            trail.title,
            trail.communities.join(', '),
            trail.activities.join(', '),
            trail.length.join(', '),
            trail.pets ? 'true' : 'false',
            trail.accessibility ? 'true' : 'false',
            trail.fee ? 'true' : 'false',
            trail.bikeRepair ? 'true' : 'false',
            trail.waterViews ? 'true' : 'false'
        ];
        cells.forEach((cellData, index) => {
            const cell = row.insertCell(index);
            cell.textContent = cellData;
        });

        // Add edit button
        const editCell = row.insertCell(cells.length);
        const editButton = document.createElement('a');
        editButton.href = `trail.html?id=${index}`;
        editButton.textContent = 'Edit Trail';
        editCell.appendChild(editButton);

        // Add delete button
        const deleteCell = row.insertCell(cells.length + 1);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Trail';
        deleteButton.addEventListener('click', () => deleteTrail(index));
        deleteCell.appendChild(deleteButton);
    });

    return table;
}

export function deleteTrail(index) {
    console.log(index);
    let trails = JSON.parse(localStorage.getItem('trails'));
    trails.splice(index, 1);
    saveToStorage(trails);
    location.reload();
}

export function addTrail(trail) {
    console.log(trail);
}

export async function loadFromStorage() {
    let trails = JSON.parse(localStorage.getItem('trails'));

    if (!trails) {
        trails = await fetchJSONData();
        saveToStorage(trails);
    }

    if (trails) {
        console.log(trails);
        const table = generateTrailTable(trails);
        document.body.appendChild(table);
    }
}

export function saveToStorage(trails) {
    localStorage.setItem('trails', JSON.stringify(trails));
}

/* this function gets called from another event listener function i have attached to a button
* I want it to download a json file with the data from the trails object
*/
export function downloadJSON() {
    const trails = JSON.parse(localStorage.getItem('trails'));
    const data = JSON.stringify(trails);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const event = new MouseEvent('click');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.dispatchEvent(event);
    URL.revokeObjectURL(url);
}


export async function initializePage() {
    await loadFromStorage();
}

