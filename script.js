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
        Chart.defaults.color = '#FFFFFF'; // Set default text color
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
                    borderColor: '#FFFFFF', // Set line color
                    borderWidth: 2,
                    pointRadius: 4, // Set point radius
                    pointBackgroundColor: '#FFFFFF', // Set point color
                    pointBorderColor: '#FFFFFF', // Set point border color
                    hoverRadius: 16 // Set hover radius to increase area for tooltip trigger
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#FFFFFF' // Set text color for y-axis
                        },
                        grid: {
                            color: '#666666' // Set grid line color for y-axis
                        }
                    },
                    x: {
                        ticks: {
                            color: '#FFFFFF', // Set text color for x-axis
                            maxTicksLimit: 21 // Specify the maximum number of ticks
                        },
                        grid: {
                            color: '#666666' // Set grid line color for x-axis
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
                        backgroundColor: '#1A1A1A',
                        titleFont: {
                            family: 'Arial',
                            size: 14,
                            weight: 'bold',
                            color: '#FFFFFF'
                        },
                        bodyFont: {
                            family: 'Arial',
                            size: 12,
                            color: '#FFFFFF'
                        },
                        borderColor: '#FFFFFF',
                        borderWidth: 1
                    }
                }
            }
        });
    }

    calculateDPS(); // Initialize the graph immediately when the site is opened

    calculateBtn.addEventListener('click', calculateDPS);
});
