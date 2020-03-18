/* eslint-disable no-console */
<template>
<div id="app" :class="typeof weather.main != 'undefined'">
    <main :class="firstWeatherStatus">
        <div @keypress="funcs" class="search-box">
            <input type="text" class="search-bar" placeholder="Search..." v-model="query" />
        </div>

        <!-- input group -->
        <div id="inputGroup" v-if="showDays">
            <label v-for="(day, index) in daysforLabels" :key="index" @click="currentDayFirstWeather">
                <span> {{day.text}} </span>
                <input class="day-button" type="radio" v-model="currentList" v-bind:value="day.value">
            </label>
        </div>

        <div>
            <div class="weather-part" v-for="item of items" v-bind:key="item.id" v-on:click="displayToggle()">
                <div class="weather-wrap" v-if="typeof item.main != 'undefined'" :class="item.weather[0].main">
                    <div class="weather-box">
                        <div class="date">
                            <span> {{dateFormatter(item.dt_txt)}} </span>
                            <span> {{timeFormatter(item.dt_txt)}} </span>
                        </div>
                        <div class="temp">{{ Math.round( item.main.temp )}}°C</div>
                        <div class="weather">{{item.weather[0].main}}</div>
                        <img src="./assets/sun.png" alt="clear" v-if="item.weather[0].main == 'Clear'" class="weather-image">
                        <img src="./assets/cloud.png" alt="clouds" v-if="item.weather[0].main == 'Clouds'" class="weather-image">
                        <img src="./assets/rain.png" alt="rain" v-if="item.weather[0].main == 'Rain'" class="weather-image">
                        <img src="./assets/snow.png" alt="snow" v-if="item.weather[0].main == 'Snow'" class="weather-image">
                    </div>
                </div>
            </div>
        </div>

        <!-- </div> -->
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
            showDays: false,
            daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            next5days: [],
            currentDayIndex: 0,
            daysforLabels: [
                {
                    text: "Today",
                    value: "day1"
                },
                {
                    text: "2. Day",
                    value: "day2"
                },
                {
                    text: "3. Day",
                    value: "day3"
                },
                {
                    text: "4. Day",
                    value: "day4"
                },
                {
                    text: "5. Day",
                    value: "day5"
                }
            ],
            day1Count: 1,
            timestamp: '',
            detailWeather: true,
            whichDay: '',
            counter: 0,
            lists: {
                day1: {},
                day2: {},
                day3: {},
                day4: {},
                day5: {}
            },
            currentList: 'day1',
        }
    },
    computed: {
        items() {
            return this.lists[this.currentList]
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
                    this.getTodayName();
                    this.showDays = true;

                }, 650);
            }

            setInterval(function () {
                if (document.querySelector('.weather-part') != null) {

                    let styleObj = document.querySelectorAll('.weather-part')[0].style;
                    styleObj.visibility = 'visible'
                    styleObj.opacity = '1';
                }
            }, 500);
        },
        //get today's name
        getTodayName() {
            let todayString = new Date().toLocaleString('en-us', {
                weekday: 'long'
            });
            this.timestamp = todayString;

            //günleri sıralama ** this.timestamp = "saturday"
            for (let i in this.daysOfWeek) {

                if (this.daysOfWeek[i] == this.timestamp.slice(0, 3)) {
                    this.currentDayIndex = i;
                    this.daysforLabels[0].text = this.daysOfWeek[i]
                }
            }

            //günler için sıralı dizi oluşturma. Today'den itibaren

            let dayArr = [];
            let firstTurnMaxCount = 7;
            let secondTurnCount = 5;
            this.currentDayIndex = parseInt(this.currentDayIndex);

            if(this.currentDayIndex < 3) {

                firstTurnMaxCount = (this.daysOfWeek.length - this.currentDayIndex);

                for (let j = this.currentDayIndex; j < this.daysOfWeek.length; j++) {

                    dayArr.push(this.daysOfWeek[j]);
                }

            }else {
                
                firstTurnMaxCount = (this.daysOfWeek.length - this.currentDayIndex);
                secondTurnCount = 5 - firstTurnMaxCount;
                
                for (let j = this.currentDayIndex; j < this.daysOfWeek.length; j++) {

                    dayArr.push(this.daysOfWeek[j]);
                }
                for(let k=0; k< secondTurnCount; k++) {
                    dayArr.push(this.daysOfWeek[k]);
                }

            }          

            let _daysforLabels = [];

            this.next5days = dayArr;

            this.daysforLabels.forEach((item, index) => {

                _daysforLabels.push({
                    text: this.next5days[index],
                    value: item.value
                });

            });
            this.daysforLabels = _daysforLabels;

        },
        dateFormatter(a) {
            return a.split(" ")[0]
        },
        timeFormatter(a) {
            return a.split(" ")[1].split(":")[0] + ':00'
        },
        //splitting all days ass today and other days
        daySplitter() {

            let vm = this;

            for (let i = 0; i < vm.weather.length; i++) {
                if (parseFloat(vm.weather[i].dt_txt.split("-")[2]) == vm.currentDay) {
                    this.day1Count++;
                }
            }

            this.lists.day1 = this.weather.slice(0, this.day1Count)
            this.lists.day2 = this.weather.slice(this.day1Count, this.day1Count + 8)
            this.lists.day3 = this.weather.slice(this.day1Count + 8, this.day1Count + 16)
            this.lists.day4 = this.weather.slice(this.day1Count + 16, this.day1Count + 24)
            this.lists.day5 = this.weather.slice(this.day1Count + 24, this.day1Count + 32)

        },
        displayToggle() {
            let el = document.querySelectorAll('.weather-part');

            if (this.detailWeather) {
                for (let i = 0; i < el.length; i++) {
                    el[i].style.visibility = 'visible';
                    el[i].style.opacity = '1';
                }
                this.detailWeather = !this.detailWeather;
            } else {
                for (let i = 1; i < el.length; i++) {
                    el[i].style.visibility = 'hidden';
                    el[i].style.opacity = '0';
                }
                this.detailWeather = !this.detailWeather;
            }
        },
        currentDayFirstWeather() {
            //change background color by current day first weather status
            let vm = this
            setTimeout(function(){                
                vm.firstWeatherStatus = document.querySelectorAll(".weather-wrap")[0].className.split(" ")[1];

                 let el = document.querySelectorAll('.weather-part');
                 for (let i = 1; i < el.length; i++) {
                    el[i].style.visibility = 'hidden';
                    el[i].style.opacity = '0';
                } 
                vm.detailWeather = true;

            },5)
        }
    },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Quicksand&display=swap');

label {
    margin: 0 10px;
    box-shadow: 0 5px 5px 0 rgba(100, 100, 100, 0.5);
    padding: 5px;
    border-radius: 4px;
    color: #fff;
    display: inline-grid;
    height: 55px;
}

#inputGroup label {
    font-size: 15px;
}

.day-button {
    width: 40px;
    position: relative;
    height: 20px;
    opacity: 1;
}

#inputGroup {
    margin: 0 0 10px 0;
    padding: 15px 0;
    text-align:center;
}

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
    transition: opacity 1.5s ease-in-out;
    border-bottom: 1px solid rgba(204, 204, 204, 0.233);

    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.5s linear;
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
    background-color: #fff;
}

.search-box {
    background-color: transparent;
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
    margin: 0 0 0 10px;
    width: 50px;
    height: 50px;
    position: relative;
    display: inline-block;
    top: 20px;
}

.weather-box .date {
    color: #fff;
    font-size: 16px;
    top: 5px;
    text-align: center;
    text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
    display: inline-block;
    position: relative;
    opacity: .75;
    height: auto;
}

.weather-box .date span {
    display: block;
}

.weather-box .temp {
    display: inline-block;
    padding: 5px 25px;
    color: #fff;
    font-size: 30px;
    font-weight: 900;

    text-shadow: 3px 3px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 15px;
    margin: 20px 15px;
    box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

.weather-box .weather {
    color: #fff;
    font-size: 18px;
    font-style: italic;
    text-shadow: 3px 3px rgba(0, 0, 0, 0.25);
    display: inline-block;
}
</style>
