<template>
<div id="app" :class="typeof day1.main != 'undefined'">
    <main>

        <div @keypress="funcs" class="search-box" :class="firstWeatherStatus">
            <input type="text" class="search-bar" placeholder="Search..." v-model="query" />
        </div>

        <div class="weather-part" v-for="item of day1" v-bind:key="item.id">
            <div class="weather-wrap" v-if="typeof item.main != 'undefined'" :class="item.weather[0].main">

                <div class="weather-box">
                    <div class="date" style="display:block; opacity:.75">
                        {{formatter(item.dt_txt)}} {{formatter2(item.dt_txt)}}
                    </div>
                    <div class="temp">{{ Math.round( item.main.temp )}}°C</div>
                    <div class="weather">{{item.weather[0].main}}</div>
                    <img src="./assets/sun.png" alt="sun" v-if="item.weather[0].main == 'Clear'" class="weather-image">
                    <img src="./assets/cloud.png" alt="sun" v-if="item.weather[0].main == 'Clouds'" class="weather-image">
                    <img src="./assets/rain.png" alt="sun" v-if="item.weather[0].main == 'Rain'" class="weather-image">
                    <img src="./assets/snow.png" alt="cloud" v-if="item.weather[0].main == 'Snow'" class="weather-image">
                </div>

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
            date: '',
            currentDay: '',
            firstWeatherStatus: '',
            day: {
                0: 'Sunday',
                1: 'Monday',
                2: 'Tuesday',
                3: 'Wednesday',
                4: 'Thursday',
                5: 'Friday',
                6: 'Saturday'
            },
            
            day1: {},
            remainingDays: {},
            day1Count : 1,
            remainingDayCount: 1
        }
    },
    methods: {
        fetchWeather() {
            // fetch(`${this.url_base}weather?q=${this.query}&units=metric&APPID=${this.api_key}`)
            fetch(`${this.url_base}forecast?q=${this.query}&units=metric&APPID=${this.api_key}`)
                .then(res => {
                    return res.json();
                }).then(this.setResults)
        },
        setResults(data) {
            // eslint-disable-next-line no-console
            console.log(data.list)
            this.weather = data.list;
            this.firstWeatherStatus = data.list[0].weather[0].main;
            this.currentDay = parseFloat(data.list[0].dt_txt.split("-")[2]);
        },
        getDate() {
            this.date = new Date()
        },
        funcs(e) {
            if (e.key == "Enter") {
                this.fetchWeather();
                this.getDate();

                setTimeout(() => {
                    this.daySplitter();

                }, 650);
            }

            setInterval(function(){
                if(document.getElementsByClassName('weather-part').length > 1) {
                    document.querySelectorAll('.weather-part')[0].style.display = 'block';
                } 
            }, 1000); // check after 100ms every time
        },
        formatter(a) {
            return a.split(" ")[0]
        },
        formatter2(a) {
            return a.split(" ")[1].split(":")[0] + ':00'
        },
        daySplitter() {

            let vm = this;

            for (let i = 0; i < vm.weather.length; i++) {
                if (parseFloat(vm.weather[i].dt_txt.split("-")[2]) == vm.currentDay) {                    
                    this.day1Count++;
                }else {
                    this.remainingDayCount++
                }
            }

            this.day1 = this.weather.slice(0,this.day1Count)
            this.remainingDays = this.weather.slice(this.day1Count,this.weather.length)

        },
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Quicksand&display=swap');

* {
    margin: 0;
    padding: 0;
    font-family: 'Quicksand', sans-serif;
    font-weight: 600;
    box-sizing: border-box;
}

.weather-part {
    /* background-image: url('./assets/cold.jpg'); */
    background-size: cover;
    background-position: bottom;
    transition: 0.4s;
    border-bottom: 1px solid rgba(204, 204, 204, 0.233);

    display:none;
}

.weather-wrap.warm {
    /* background-image: url('./assets/sunny.jpg'); */
    background-size: contain;
}

.Clear {
    background-image: linear-gradient(to bottom, rgb(54, 167, 243), rgba(48, 171, 253, 0.75));
}

.Clouds {
    background-image: linear-gradient(to bottom, rgb(116, 133, 146), rgba(27, 52, 56, 0.75));
}

.Rain {
    background-image: linear-gradient(to bottom, #262747ee, #141429);
}

.Snow {
    background-image: linear-gradient(to bottom, rgb(202, 202, 202), rgba(99, 99, 99, 0.75));
}

main {
    height: 100vh;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25));
    overflow-y: auto;
    background-color: #606060;
}

.search-box {
    width: 100%;
    padding: 25px;
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

.weather-box {
    text-align: center;
}

.weather-image {
    background-color: transparent;
    margin: 0 0 0 20px;
    width: 50px;
    height: 50px;
    position: relative;
    display: inline-block;
    top: 20px;
}

.weather-box .date {
    color: #fff;
    font-size: 20px;
    opacity: 1;
    text-align: center;
    text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
    padding-top: 10px;
}

.weather-box .temp {
    display: inline-block;
    padding: 10px 25px;
    color: #fff;
    font-size: 30px;
    font-weight: 900;

    text-shadow: 3px 3px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 15px;
    margin: 30px 15px;
    box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

.weather-box .weather {
    color: #fff;
    font-size: 22px;
    font-style: italic;
    text-shadow: 3px 3px rgba(0, 0, 0, 0.25);
    display: inline-block;
}
</style>
