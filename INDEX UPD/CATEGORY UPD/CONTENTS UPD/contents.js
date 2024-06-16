document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const rowData = urlParams.get('category');
    const categoryData = JSON.parse(decodeURIComponent(rowData));
    const machineVariant = urlParams.get('topic');
    const categoryName = urlParams.get('categoryName');  // Get the category name from URL
    const employeeId = sessionStorage.getItem('employeeId');

    // Display the machine variant and category
    const topicContainer = document.getElementById('topic-container');
    topicContainer.textContent = `Machine Variant: ${machineVariant}`;

    const categoryContainer = document.getElementById('category-container');
    categoryContainer.textContent = `Category: ${categoryName}`;

    // Fetch and display employee name
    fetchEmployeeName(employeeId);

    fetchContents(categoryData);

    // Add event listener for the "Request Support" button
    document.getElementById('submit-request').addEventListener('click', function() {
        requestSupport(machineVariant, categoryName, employeeId);
    });
});

function fetchEmployeeName(employeeId) {
    const scriptUrl = `https://script.google.com/macros/s/AKfycbzpgU5fcdKqfQzo3mX47CTr5gx7DuzGrBbhQYKgt821tOYaQpVMFRsKsylHCuqWDZGN/exec?employeeId=${encodeURIComponent(employeeId)}`;

    fetch(scriptUrl)
        .then(response => response.text())
        .then(name => {
            const employeeNameContainer = document.getElementById('employee-name-container');
            employeeNameContainer.textContent = `Welcome, ${name}`;
            sessionStorage.setItem('employeeName', name);
        })
        .catch(error => {
            console.error('Error fetching employee name:', error);
        });
}

function fetchContents(categoryData) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzpgU5fcdKqfQzo3mX47CTr5gx7DuzGrBbhQYKgt821tOYaQpVMFRsKsylHCuqWDZGN/exec?category=' + encodeURIComponent(JSON.stringify(categoryData));

    fetch(scriptUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateContents(data);
            document.getElementById('submit-request').style.display = 'block';
            document.getElementById('note').style.display = 'block';
            document.getElementById('additional-fields').style.display = 'block';
            document.getElementById('button-container').style.display = 'block'; // Show button container
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const container = document.getElementById('contents-container');
            container.innerHTML = '<p>Failed to load contents</p>';
        });
}

function populateContents(data) {
    const container = document.getElementById('contents-container');
    container.innerHTML = ''; // Clear existing items and loading text

    const [headers, contents] = data;

    if (!Array.isArray(contents)) {
        container.innerHTML = '<p>Failed to load contents</p>';
        return;
    }

    if (contents.length === 0) {
        container.innerHTML = '<p>No contents available</p>';
        return;
    }

    for (let i = 0; i < contents.length; i += 2) {
        if (contents[i]) {
            const div = document.createElement('div');
            div.className = 'content-box';
            div.innerHTML = `
                <div class="list-content-container">
                    <strong>Check ${Math.floor(i / 2) + 1}:</strong> <span class="list-content">${contents[i]}</span>
                    <div class="checkbox-group">
                        <label>
                            <input type="checkbox" name="check${i}" value="Yes"> Yes
                        </label>
                        <label>
                            <input type="checkbox" name="check${i}" value="No"> No
                        </label>
                        ${containsMeasurementTerms(contents[i]) ? `<input type="text" name="field${i}" placeholder="Enter value">` : ''}
                    </div>
                </div>
            `;

            if (contents[i + 1]) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'thumbnail-container';
                const img = document.createElement('img');
                const imgSrc = `https://drive.google.com/thumbnail?id=${contents[i + 1]}&sz=w1000`; // Use Drive thumbnail link
                img.src = imgSrc; // Use Drive thumbnail link
                img.className = 'thumbnail';
                img.onerror = function() {
                    console.error('Error loading image:', imgSrc);
                };
                img.onload = function() {
                    console.log('Successfully loaded image:', imgSrc);
                };
                imgContainer.appendChild(img);
                div.appendChild(imgContainer);

                console.log(`Generated Image URL: ${imgSrc}`); // Log the image URL

                img.addEventListener('click', function() {
                    openImageModal(`https://drive.google.com/thumbnail?id=${contents[i + 1]}&sz=w1000`);
                });
            }

            container.appendChild(div);
        }
    }
}

function containsMeasurementTerms(content) {
    const terms = ['voltage', 'current', 'resistance', 'ohms'];
    return terms.some(term => content.toLowerCase().includes(term));
}

function requestSupport(machineVariant, categoryName, employeeId) {
    const employeeName = sessionStorage.getItem('employeeName');
    const listItems = document.querySelectorAll('#contents-container .content-box');
    const submissionData = [];

    for (const item of listItems) {
        const checkboxes = item.querySelectorAll('input[type="checkbox"]');
        const field = item.querySelector('input[type="text"]');
        const content = item.querySelector('.list-content').innerText;

        let checkboxValue = '';
        for (const checkbox of checkboxes) {
            if (checkbox.checked) {
                checkboxValue = checkbox.value;
                break;
            }
        }

        if (!checkboxValue || (field && !field.value)) {
            alert(`Please fill all fields for: ${content}`);
            return;
        }

        submissionData.push({
            content,
            checkbox: checkboxValue,
            field: field ? field.value : ''
        });
    }

    const machineNumber = document.getElementById('machine-number').value;
    const observations = document.getElementById('observations').value;

    if (!machineNumber) {
        alert('Please fill the Machine number.');
        return;
    }

    document.getElementById('submitting-text').style.display = 'block';

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwrAiSLKfpmP-5dbR4r9HaBZwdqL6lJvAdYEz3Ul45Ddo1C-pLc_ZpTy1ydmi-qI6E/exec';

    fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `machineVariant=${encodeURIComponent(machineVariant)}&employeeName=${encodeURIComponent(employeeName)}&employeeId=${encodeURIComponent(employeeId)}&machineNumber=${encodeURIComponent(machineNumber)}&category=${encodeURIComponent(categoryName)}&observations=${encodeURIComponent(observations)}&submissionData=${encodeURIComponent(JSON.stringify(submissionData))}`,
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('submitting-text').style.display = 'none';
            if (data.result === 'success') {
                alert('Request raised successfully');
                location.reload(); // Refresh the page
            } else {
                alert('Failed to raise request');
            }
        })
        .catch(error => {
            document.getElementById('submitting-text').style.display = 'none';
            console.error('Error:', error);
        });
}

function openImageModal(src) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="close-button">&times;</span>
            <img src="${src}" class="expanded-image">
        </div>
    `;
    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', function() {
        modal.remove();
    });

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
}
