let map, heatLayer, complaintsData = [], complaintChart;

function initMap() {
    // Wait for the map container to be fully loaded
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }

    // Initialize the map
    map = L.map('map', {
        center: [40.7128, -74.0060],
        zoom: 11,
        zoomControl: true
    });

    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Force a resize event to ensure the map renders properly
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

function loadData() {
    Papa.parse('311sample.csv', {
        download: true,
        header: true,
        complete: results => {
            complaintsData = results.data;
            updateDashboard(complaintsData);
            updateFilters(complaintsData);
            plotComplaints(complaintsData);
        }
    });
}

function updateDashboard(data) {
    document.getElementById('total-complaints').textContent = data.length;
    document.getElementById('open-complaints').textContent = data.filter(d => d.Status === 'In Progress').length;

    const complaintTypes = {};
    data.forEach(d => complaintTypes[d['Complaint Type']] = (complaintTypes[d['Complaint Type']] || 0) + 1);
    document.getElementById('top-complaint').textContent = Object.entries(complaintTypes)
        .sort((a, b) => b[1] - a[1])[0][0];

    const closedComplaints = data.filter(d => d.Status === 'Closed' && d['Created Date'] && d['Closed Date']);
    if (closedComplaints.length) {
        const avgHours = closedComplaints.reduce((acc, d) => 
            acc + (new Date(d['Closed Date']) - new Date(d['Created Date'])), 0) 
            / (closedComplaints.length * 1000 * 60 * 60);
        document.getElementById('avg-response').textContent = avgHours.toFixed(1) + ' hrs';
    }
}

function updateFilters(data) {
    const boroughs = new Set(data.map(d => d.Borough));
    const complaintTypes = new Set(data.map(d => d['Complaint Type']));

    const boroughSelect = document.getElementById('borough-filter');
    const complaintSelect = document.getElementById('complaint-filter');

    boroughs.forEach(borough => {
        if (borough) {
            const option = document.createElement('option');
            option.value = option.textContent = borough;
            boroughSelect.appendChild(option);
        }
    });

    complaintTypes.forEach(type => {
        if (type) {
            const option = document.createElement('option');
            option.value = option.textContent = type;
            complaintSelect.appendChild(option);
        }
    });
}

function plotComplaints(data) {
    if (!map) {
        console.error('Map not initialized');
        return;
    }

    // Remove existing heat layer if it exists
    if (heatLayer) {
        map.removeLayer(heatLayer);
    }

    // Prepare data for heatmap
    const heatData = data
        .filter(d => d.Latitude && d.Longitude)
        .map(d => [parseFloat(d.Latitude), parseFloat(d.Longitude), 1]);

    // Create new heat layer
    heatLayer = L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        max: 1.0,
        gradient: {
            0.4: 'blue',
            0.6: 'cyan',
            0.7: 'lime',
            0.8: 'yellow',
            1.0: 'red'
        }
    }).addTo(map);

    // Update complaint type distribution chart
    const complaintTypes = {};
    data.forEach(d => complaintTypes[d['Complaint Type']] = (complaintTypes[d['Complaint Type']] || 0) + 1);

    if (complaintChart) complaintChart.destroy();

    const sortedComplaints = Object.entries(complaintTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    complaintChart = new Chart(document.getElementById('complaint-chart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: sortedComplaints.map(d => d[0]),
            datasets: [{
                data: sortedComplaints.map(d => d[1]),
                backgroundColor: '#4A90E2',
                borderColor: '#357ABD',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function filterData() {
    const borough = document.getElementById('borough-filter').value;
    const complaintType = document.getElementById('complaint-filter').value;
    const status = document.getElementById('status-filter').value;

    let filteredData = complaintsData;
    if (borough !== 'all') filteredData = filteredData.filter(d => d.Borough === borough);
    if (complaintType !== 'all') filteredData = filteredData.filter(d => d['Complaint Type'] === complaintType);
    if (status !== 'all') filteredData = filteredData.filter(d => d.Status === status);

    updateDashboard(filteredData);
    plotComplaints(filteredData);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadData();
    
    document.getElementById('borough-filter').addEventListener('change', filterData);
    document.getElementById('complaint-filter').addEventListener('change', filterData);
    document.getElementById('status-filter').addEventListener('change', filterData);
}); 