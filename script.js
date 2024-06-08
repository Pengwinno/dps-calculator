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
        // Get input values
        const minDamage = parseFloat(minDamageInput.value);
        const maxDamage = parseFloat(maxDamageInput.value);
        const shotCount = parseFloat(shotCountInput.value);
        const rateOfFire = parseFloat(rateOfFireInput.value);
        const userAttack = parseFloat(userAttackInput.value);
        const userDexterity = parseFloat(userDexterityInput.value);
        const userCritChance = parseFloat(userCritChanceInput.value) / 100;
        const userCritDamage = parseFloat(userCritDamageInput.value) / 100;
        const enemyDefense = parseFloat(enemyDefenseInput.value);

        // Calculate DPS
        const weaponAverage = (minDamage + maxDamage) / 2;
        const rateOfFireConfigured = rateOfFire / 100;
        const dps = (((((weaponAverage * (0.5 + userAttack / 50))) - enemyDefense) * shotCount) * ((1.5 + 6.5 * (userDexterity / 75)) * rateOfFireConfigured)) * (1 + (userCritChance * userCritDamage));
        const formattedDPS = dps.toFixed(2);

        // Update chart
        updateChart(enemyDefense, dps);
    }

    function updateChart(defense, dps) {
        if(window.myChart !== undefined) {
            window.myChart.destroy();
        }
    
        // Set Chart.js options
        Chart.defaults.color = 'white'; // Set default text color
        Chart.defaults.font.family = 'Arial'; // Set default font family
        Chart.defaults.font.size = 12; // Set default font size
    
        window.myChart = new Chart(dpsChart, {
            type: 'line',
            data: {
                labels: Array.from({ length: 11 }, (_, i) => `Defense ${i * 10}`),
                datasets: [{
                    label: 'DPS',
                    data: Array.from({ length: 11 }, () => dps),
                    backgroundColor: 'rgba(0, 0, 0, 0)', // Set background color to transparent
                    borderColor: '#1A1A1A', // Set line color
                    borderWidth: 2,
                    pointBackgroundColor: '#1A1A1A', // Set point color
                    pointBorderColor: '#1A1A1A', // Set point border color
                    pointHoverBackgroundColor: '#1A1A1A', // Set point hover color
                    pointHoverBorderColor: '#1A1A1A', // Set point hover border color
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
                            color: 'white' // Set text color for x-axis
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white' // Set text color for legend
                        }
                    }
                }
            }
        });
    }

    calculateBtn.addEventListener('click', calculateDPS);
});
