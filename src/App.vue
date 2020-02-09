<template>
<div id="app" :class="typeof weather.main != 'undefined' && weather.main.temp > 10 ? 'warm' : '' ">
    <main>

        <div class="search-box">
            <input type="text" class="search-bar" placeholder="Search..." v-model="query" @keypress="funcs" />
        </div>

        <div class="weather-wrap" v-if="typeof weather.main != 'undefined'">
            <div class="location-box">
                <div class="location">{{ weather.name }}, {{ weather.sys.country }}</div>
                <div class="date" style="margin-top:15px; opacity:.75">{{date}}</div>
            </div>

            <div class="weather-box">
                <div class="temp">{{ Math.round( weather.main.temp )}}°C</div>
                <div class="weather">{{weather.weather[0].main}}</div>
            </div>

        </div>

    </main>
</div>
</template>

<script>
export default {
    name: 'app',
    data() {
        return {
            api_key: 'f161ff2d85a4004531b5735f1934ce36',
            url_base: 'http://api.openweathermap.org/data/2.5/',
            query: '',
            weather: {},
            date: ''
        }
    },
    methods: {
        fetchWeather() {
             fetch(`${this.url_base}weather?q=${this.query}&units=metric&APPID=${this.api_key}`)
            //fetch(`${this.url_base}forecast?q=${this.query}&units=metric&APPID=${this.api_key}`)
                .then(res => {
                    return res.json();
                }).then(this.setResults)
        },
        setResults(results) {

            // eslint-disable-next-line no-console
            console.log(results)
            this.weather = results;
        },
        getDate() {
            this.date = new Date().toLocaleString()
        },
        funcs(e) {
            if (e.key == "Enter") {
                this.fetchWeather();
                this.getDate();
            }
        }
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Quicksand&display=swap');

body {
    background-color: black;
}

* {
    margin: 0;
    padding: 0;
    font-family: 'Quicksand', sans-serif;
    font-weight: 600;
    box-sizing: border-box;
}

#app {
    background-image: url('./assets/cold.jpg');
    background-size: cover;
    background-position: bottom;
    transition: 0.4s;
}

#app.warm {
    background-image: url('./assets/sunny.jpg');
}

main {
    min-height: 100vh;
    padding: 25px;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75));
}

.search-box {
    width: 100%;
    margin-bottom: 30px;
}

.search-box .search-bar {
    display: block;
    width: 100%;
    padding: 15px;
    color: #313131;
    font-size: 20px;
    appearance: none;
    border: none;
    border-color: rgba(0, 0, 0, 0.5);
    border-radius: 0 15px 0 15px;
    transition: .4s;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.75);
}

.search-box .search-bar:focus {
    border-color: rgba(0, 0, 0, 0.75);
    border-radius: 15px 0 15px 0;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 1);
    outline: none;
}

.location-box .location {
    color: #fff;
    font-size: 32px;
    text-align: center;
    text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}

.location-box .date {
    color: #fff;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
    font-style: italic;
    text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}

.weather-box {
    text-align: center;
}

.weather-box .temp {
    display: inline-block;
    padding: 10px 25px;
    color: #fff;
    font-size: 102px;
    font-weight: 900;

    text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 15px;
    margin: 30px 0;

    box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

.weather-box .weather {
    color: #fff;
    font-size: 48px;
    font-style: italic;
    text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}
</style>
