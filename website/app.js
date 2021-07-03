/* Global Variables */


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

// listener to button click
document.getElementById('generate').addEventListener('click', performAction);
// callback for click listener
function performAction(){
    // access values from user
    const zipCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
    if(!zipCode || !feelings){
        alert('Please fill all the fields');
        return;
    }
    // chaining promises
    getWeather(zipCode)
    .then(function(data){
    postData('/journal', {temp: data.main.temp, date: newDate, feels_like: data.main.feels_like, feeling: feelings})
    .then(updateErase())
})
}
function updateErase(){
    updateUI();
    document.getElementById('zip').value = '';
    document.getElementById('feelings').value = '';
}
// Get weather from API
const getWeather = async (zipCode)=>{
    const apiKey = 'debdd1dcdd2e3fa985e31c252c3049d0'
    const baseURL = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=metric&appid=${apiKey}`
    const res = await fetch(baseURL)
    try {
        const data = await res.json();
        if(res.status !== 200){
            alert(data.message);
            throw new Error(data.message);
        }
        return data;
    } catch(error) {
        console.log(error);
    }
}

// post data
const postData = async (url= '', data = {})=>{
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch(error) {
        console.log(error);
        alert(error);
    }
}

// dynamic UI update
const updateUI = async () => {
    const request = await fetch('/journal/latest');
    try{
        const entry = await request.json();
        console.log(entry);
        document.getElementById('date').innerHTML = "Date " + entry.date;
        document.getElementById('temp').innerHTML = "Weather: " + entry.temp + "ºC";
        document.getElementById('feels').innerHTML = "Feels like " + entry.feels_like + "ºC";
        document.getElementById('content').innerHTML = "I am " + entry.feeling;
    }
    catch(error){
        console.log(error);
        alert(error);
    }
}