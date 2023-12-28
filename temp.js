function aviatorSimulator() {
    let multiplier = 1;
    let timer = setInterval(() => {
        multiplier += Math.random() * 0.05;
        console.log("Current multiplier: " + multiplier.toFixed(2));

        if (Math.random() < 0.01) {
            console.log("Airplane flew away!");
            clearInterval(timer);
        }
    }, 100);
}

aviatorSimulator();
