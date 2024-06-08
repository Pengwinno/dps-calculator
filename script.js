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

        window.myChart = new Chart(dpsChart, {
            type: 'line',
            data: {
                labels: Array.from({ length: 11 }, (_, i) => `Defense ${i * 10}`),
                datasets: [{
                    label: 'DPS',
                    data: Array.from({ length: 11 }, () => dps),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    calculateBtn.addEventListener('click', calculateDPS);
});
