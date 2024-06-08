document.addEventListener("DOMContentLoaded", function () {
    const minDamageInput = document.getElementById('minDamage');
    const maxDamageInput = document.getElementById('maxDamage');
    const shotCountInput = document.getElementById('shotCount');
    const rateOfFireInput = document.getElementById('rateOfFire');
    const userAttackInput = document.getElementById('userAttack');
    const userDexterityInput = document.getElementById('userDexterity');
    const userCritChanceInput = document.getElementById('userCritChance');
    const userCritDamageInput = document.getElementById('userCritDamage');
    const enemyDefenseInput = document.getElementById('enemyDefense');
    const dpsResult = document.getElementById('dpsResult');
    const calculateDPSButton = document.getElementById('calculateDPS');
    const updateChartButton = document.getElementById('updateChart');
    const resetChartButton = document.getElementById('resetChart');

    let chart;

    function calculateDPS() {
        const minDamage = parseFloat(minDamageInput.value);
        const maxDamage = parseFloat(maxDamageInput.value);
        const shotCount = parseFloat(shotCountInput.value);
        const rateOfFire = parseFloat(rateOfFireInput.value) / 100;
        const userAttack = parseFloat(userAttackInput.value);
        const userDexterity = parseFloat(userDexterityInput.value);
        const userCritChance = parseFloat(userCritChanceInput.value) / 100;
        const userCritDamage = parseFloat(userCritDamageInput.value) / 100;
        const enemyDefense = parseFloat(enemyDefenseInput.value);

        const weaponAverage = (minDamage + maxDamage) / 2;
        const dps = (((((weaponAverage * (0.5 + userAttack / 50))) - enemyDefense) * shotCount) * ((1.5 + 6.5 * (userDexterity / 75)) * rateOfFire)) * (1 + (userCritChance * userCritDamage));
        return dps;
    }

    function updateDPSDisplay() {
        const dps = calculateDPS();
        dpsResult.textContent = `DPS = ${dps.toFixed(2)}`;
    }

    function updateChart() {
        const defenseValues = Array.from({ length: 101 }, (_, i) => i);
        const dpsValues = defenseValues.map(defense => {
            const minDamage = parseFloat(minDamageInput.value);
            const maxDamage = parseFloat(maxDamageInput.value);
            const shotCount = parseFloat(shotCountInput.value);
            const rateOfFire = parseFloat(rateOfFireInput.value) / 100;
            const userAttack = parseFloat(userAttackInput.value);
            const userDexterity = parseFloat(userDexterityInput.value);
            const userCritChance = parseFloat(userCritChanceInput.value) / 100;
            const userCritDamage = parseFloat(userCritDamageInput.value) / 100;

            const weaponAverage = (minDamage + maxDamage) / 2;
            const dps = (((((weaponAverage * (0.5 + userAttack / 50))) - defense) * shotCount) * ((1.5 + 6.5 * (userDexterity / 75)) * rateOfFire)) * (1 + (userCritChance * userCritDamage));
            return dps;
        });

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('dpsChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: defenseValues,
                datasets: [{
                    label: 'DPS',
                    data: dpsValues,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1,
                    pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                    pointBorderColor: 'rgba(255, 255, 255, 1)'
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Defense',
                            color: 'white'
                        },
                        ticks: {
                            color: 'white'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'DPS',
                            color: 'white'
                        },
                        ticks: {
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    }

    function resetChart() {
        if (chart) {
            chart.destroy();
        }
    }

    calculateDPSButton.addEventListener('click', updateDPSDisplay);
    updateChartButton.addEventListener('click', updateChart);
    resetChartButton.addEventListener('click', resetChart);
});
