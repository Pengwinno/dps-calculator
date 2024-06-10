document.addEventListener('DOMContentLoaded', function () {
    const minDamageInput = document.getElementById('minDamage');
    const maxDamageInput = document.getElementById('maxDamage');
    const shotCountInput = document.getElementById('shotCount');
    const rateOfFireInput = document.getElementById('rateOfFire');
    const userAttackInput = document.getElementById('userAttack');
    const userDexterityInput = document.getElementById('userDexterity');
    const userCritChanceInput = document.getElementById('userCritChance');
    const userCritDamageInput = document.getElementById('userCritDamage');

    const calculateBtn = document.getElementById('calculateBtn');
    const dpsChart = document.getElementById('dpsChart').getContext('2d');

    function calculateDPS() {
        // Get input values or default to 0
        const minDamage = parseFloat(minDamageInput.value) || 100;
        const maxDamage = parseFloat(maxDamageInput.value) || 250;
        const shotCount = parseFloat(shotCountInput.value) || 1;
        const rateOfFire = parseFloat(rateOfFireInput.value) || 100;
        const userAttack = parseFloat(userAttackInput.value) || 75;
        const userDexterity = parseFloat(userDexterityInput.value) || 75;
        const userCritChance = parseFloat(userCritChanceInput.value) / 100 || 0;
        const userCritDamage = parseFloat(userCritDamageInput.value) / 100 || 0;

        // Calculate DPS
        const weaponAverage = (minDamage + maxDamage) / 2;
        const rateOfFireConfigured = rateOfFire / 100;
        const dps = (((((weaponAverage * (0.5 + userAttack / 50))) - 0) * shotCount) *
            ((1.5 + 6.5 * (userDexterity / 75)) * rateOfFireConfigured)) *
            (1 + (userCritChance * userCritDamage));

        // Update chart
        updateChart(weaponAverage, userAttack, userDexterity, rateOfFireConfigured, userCritChance, userCritDamage, shotCount);
    }

    function updateChart(weaponAverage = 0, userAttack = 0, userDexterity = 0, rateOfFireConfigured = 0, userCritChance = 0, userCritDamage = 0, shotCount = 0) {
        if (window.myChart !== undefined) {
            window.myChart.destroy();
        }

        // Generate defense and dps values for chart
        const defenseValues = Array.from({ length: 21 }, (_, i) => i * 5);
        const dpsValues = defenseValues.map(defense => {
            return (((((weaponAverage * (0.5 + userAttack / 50))) - defense) * shotCount) *
                ((1.5 + 6.5 * (userDexterity / 75)) * rateOfFireConfigured)) *
                (1 + (userCritChance * userCritDamage));
        });

        // Set Chart.js options
        Chart.defaults.color = 'white'; // Set default text color
        Chart.defaults.font.family = 'Arial'; // Set default font family
        Chart.defaults.font.size = 12; // Set default font size

        window.myChart = new Chart(dpsChart, {
            type: 'line',
            data: {
                labels: defenseValues,
                datasets: [{
                    label: 'DPS',
                    data: dpsValues,
                    backgroundColor: 'rgba(0, 0, 0, 0)', // Set background color to transparent
                    borderColor: 'white', // Set line color
                    borderWidth: 2,
                    pointRadius: 4, // Set point radius
                    pointBackgroundColor: 'white', // Set point color
                    pointBorderColor: 'white', // Set point border color
                    hoverRadius: 16 // Set hover radius to increase area for tooltip trigger
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white' // Set text color for y-axis
                        },
                        grid: {
                            color: 'rgba(128, 128, 128, 0.2)' // Set grid line color for y-axis
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white', // Set text color for x-axis
                            maxTicksLimit: 21 // Specify the maximum number of ticks
                        },
                        grid: {
                            display: false // Hide grid lines on x-axis
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide legend
                    },
                    tooltip: {
                        caretPadding: 10,
                        callbacks: {
                            label: function (context) {
                                const index = context.dataIndex;
                                const defense = defenseValues[index];
                                const dps = dpsValues[index].toFixed(2);
                                return `Defense: ${defense}, DPS: ${dps}`;
                            }
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Tooltip background color
                        titleFont: {
                            family: 'Arial', // Tooltip title font family
                            size: 14, // Tooltip title font size
                            weight: 'bold', // Tooltip title font weight
                            color: '#ffffff' // Tooltip title font color
                        },
                        bodyFont: {
                            family: 'Arial', // Tooltip body font family
                            size: 12, // Tooltip body font size
                            color: '#ffffff' // Tooltip body font color
                        },
                        cornerRadius: 4, // Tooltip corner radius
                        padding: 10, // Tooltip padding
                        displayColors: false // Hide tooltip item colors
                    }
                }
            }
        });
    }

    calculateDPS(); // Initialize the graph immediately when the site is opened

    calculateBtn.addEventListener('click', calculateDPS);
});
