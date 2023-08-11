document.addEventListener("DOMContentLoaded", async () => { //when dom loads, using async function, g
    //giving promise, try-catch method to handle promise

    //converting html divs and storing into js variables
    const cityInput = document.getElementById("cityInput");
    const fetchButton = document.getElementById("fetchButton");
    const temperatureChart = document.getElementById("temperatureChart");

    //getting 2D area for drawing graph using getContext and storing it in 'ctx'
    const ctx = temperatureChart.getContext("2d");

    //after network stability , free from errors, handling promise using async function
    fetchButton.addEventListener("click", async () => {
        const city = cityInput.value; //accessing using .value for city
        const apiKey = "c7abc9492cf357ff9cccb8db1d33b5e6";  //openweatherapi key
        const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl); //await because it would take some time for 
            //openweather(external) source
            
            const data = await response.json();//response has data in json format from api, converting to objects

            console.log(data);//in browser console, for checking
            const tempArray=data.list;
            const hourlyData = tempArray.map(item => (item.main.temp)-273.15);//hourlyData is new array containg temp
            

            // Calculate IST offset (in milliseconds)
            const istOffset = 5.5 * 60 * 60 * 1000;
            const labels = [];
            for (let hour = 6; hour <= 18; hour++) {
                const istTime = new Date(data.list[0].dt * 1000 + istOffset);
                istTime.setUTCHours(hour);
                labels.push(istTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            }

            // Clear previous chart instance
            if (window.tempChart instanceof Chart) {
                window.tempChart.destroy();//destroying
            }

            // Create new chart using Chart.js library 
            window.tempChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Temperature',
                        data: hourlyData,
                        backgroundColor: 'black'
                    }]
                },
                options: {
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Time (IST)'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Temperature (°C)'
                            }
                        }
                    }
                }
            });
        } 
        catch (error) {
            console.error("Error fetching temperature data:", error);
        }
    });
});
