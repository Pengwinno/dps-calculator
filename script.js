document.addEventListener('DOMContentLoaded', function () {
    const minDamageInput = document.getElementById('minDamage');
    const maxDamageInput = document.getElementById('maxDamage');
    const shotCountInput = document.getElementById('shotCount');
    const rateOfFireInput = document.getElementById('rateOfFire');
    const userAttackInput = document.getElementById('userAttack');
    const userDexterityInput = document.getElementById('userDexterity');
    const userCritChanceInput = document.getElementById('userCritChance');
    const userCritDamageInput = document.getElementById('userCritDamage');
    const enemyDefenseInput = document.getElementById('enemyDefense');

    const calculateBtn = document.getElementById('calculateBtn');
    const dpsChart = document.getElementById('dpsChart').getContext('2d');

    function calculateDPS() {
        // Get input values or default to 0
        const minDamage = parseFloat(minDamageInput.value) || 0;
        const maxDamage = parseFloat(maxDamageInput.value) || 0;
        const shotCount = parseFloat(shotCountInput.value) || 0;
        const rateOfFire = parseFloat(rateOfFireInput.value) || 0;
        const userAttack = parseFloat(userAttackInput.value) || 0;
        const userDexterity = parseFloat(userDexterityInput.value) || 0;
        const userCritChance = parseFloat(userCritChanceInput.value) / 100 || 0;
        const userCritDamage = parseFloat(userCritDamageInput.value) / 100 || 0;
        const enemyDefense = parseFloat(enemyDefenseInput.value) || 0;

        // Calculate DPS
        const weaponAverage = (minDamage + maxDamage) / 2;
        const rateOfFireConfigured = rateOfFire / 100;
        const dps = (((((weaponAverage * (0.5 + userAttack / 50))) - enemyDefense) * shotCount) *
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
        const defenseValues = Array.from({ length: 101 }, (_, i) => i);
        const dpsValues = defenseValues.map(defense => {
            return (((((weaponAverage * (0.5 + userAttack / 50))) - defense) * shotCount) *
                ((1.5 + 6.5 * (userDexterity / 75)) * rateOfFireConfigured)) *
                (1 + (userCritChance * userCritDamage));
        });

        // Filter defense and dps values for dots every 5 units
        const dotDefenseValues = defenseValues.filter(value => value % 5 === 0);
        const dotDpsValues = dpsValues.filter((_, index) => index % 5 === 0);

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
                    pointBackgroundColor: dotDefenseValues.map(() => 'white'), // Set point color only for dots
                    pointBorderColor: dotDefenseValues.map(() => 'white'), // Set point border color only for dots
                    pointHoverBackgroundColor: dotDefenseValues.map(() => 'white'), // Set point hover color only for dots
                    pointHoverBorderColor: dotDefenseValues.map(() => 'white'), // Set point hover border color only for dots
                    pointRadius: defenseValues.map((_, index) => index % 5 === 0 ? 4 : 0), // Dots only every 5 units
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white' // Set text color for y-axis
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white', // Set text color for x-axis
                            stepSize: 5 // Set tick interval to 5
                        },
                        grid: {
                            display: false // Hide grid lines on x-axis
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white' // Set text color for legend
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Defense: ${context.label}, DPS: ${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Initialize chart with default values
    updateChart();

    calculateBtn.addEventListener('click', calculateDPS);
});
