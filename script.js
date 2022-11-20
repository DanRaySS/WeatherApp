function addWidget() {
    let latitudeInput = Number(document.querySelector('.coordinats__wrapper__latitude__input').value);
    let longitudeInput = Number(document.querySelector('.coordinats__wrapper__longitude__input').value);
    let msg = document.querySelector(".coordinats__wrapper_error");
    msg.textContent = "";
    if (!isInRange(latitudeInput, longitudeInput)) {
        msg.textContent = "Введена неверная геолокация. Повторите попытку.";
    }
    let widgets = document.querySelector('.widgets');
    let widget = document.createElement('div');
    createEl(widget, 'widget', widgets);
    createLayout(widget, latitudeInput, longitudeInput);
    widget.querySelector('.latitude').textContent = `Широта: ${latitudeInput}`;
    widget.querySelector('.longitude').textContent = `Долгота: ${longitudeInput}`;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitudeInput}&longitude=${longitudeInput}&current_weather=true`)
        .then(response => response.json())
        .then(data => {
            widget.querySelector('.widget__left-side_wind-speed').textContent = `Скорость ветра: ${data.current_weather.windspeed}` + ' ' + 'км/ч';
            widget.querySelector('.widget__left-side_temperature').innerHTML = `Температура: ${data.current_weather.temperature}` + '&deg';
            let weatherValue = Number(data.current_weather.weathercode);
            let typeIcon = defineIcon(weatherValue);
            widget.querySelector('.widget__right-side').innerHTML = `<img class="widget__right-side_icon" src="${typeIcon}">`;
        })
}

function isInRange(latitude, longitude) {
    return (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude < 180);
}

function createLayout(widget, latitudeInput, longitudeInput) {
    let map = document.createElement('div');
    map.classList.add('widget__map');
    widget.append(map);
    getMap(map, latitudeInput, longitudeInput);
    createInfoBlock(widget);
}

function createInfoBlock(widget) {
    let infoBlock = document.createElement('div');
    createEl(infoBlock, 'widget__info-block', widget);
    let widgetLeft = document.createElement('div');
    createEl(widgetLeft, 'widget__left-side', infoBlock);
    let coordinats = document.createElement('div');
    createEl(coordinats, 'widget__left-side__coordinats', widgetLeft);
    let lat = document.createElement('span');
    createEl(lat, 'latitude', coordinats);
    let lon = document.createElement('span');
    createEl(lon, 'longitude', coordinats);
    let windSpeed = document.createElement('span');
    createEl(windSpeed, 'widget__left-side_wind-speed', widgetLeft);
    let temperature = document.createElement('span');
    createEl(temperature, 'widget__left-side_temperature', widgetLeft);
    let widgetRight = document.createElement('div');
    createEl(widgetRight, 'widget__right-side', infoBlock);
}

function createEl(elem, name, parent) {
    elem.classList.add(name);
    parent.append(elem);
}

function getMap(map, latitudeInput, longitudeInput) {
    let myMap = new ymaps.Map(map, {
        center: [latitudeInput, longitudeInput],
        zoom: 7
    });
    let myPlaceMark = new ymaps.Placemark([latitudeInput, longitudeInput]);
    myMap.geoObjects.add(myPlaceMark);
}

function defineIcon(weatherValue) {
    if (weatherValue === 0) {
        return "./icons/sunny.png"
    }
    else if (weatherValue <= 3) {
        return "./icons/cloudy.png"
    }
    else if (weatherValue <= 48) {
        return "./icons/foggy.png"
    }
    else if (weatherValue <= 77 || weatherValue === 86 || weatherValue === 85) {
        return "./icons/snowfall.png"
    }
    return "./icons/rainy.png"
}