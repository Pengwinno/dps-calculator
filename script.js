function calculateDPS() {
    const damage = document.getElementById('damage').value;
    const speed = document.getElementById('speed').value;
    const dps = damage * speed;
    document.getElementById('result').innerText = `DPS: ${dps}`;
}
