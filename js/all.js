const updateArea = document.querySelector('.js-updateText');
const areaSelect = document.querySelector('.js-areaSelect');
const cityName = document.querySelector('.js-cityName');
const AQIDataArea = document.querySelector('.js-AQIData');
const AQICardList = document.querySelector('.js-AQICardList');

let data = [];
let updateTime = '';
let cityArr = [];
let districtNum = {};
let currentCity = '';
let currentDistrict = '';
let currentCityData = [];

axios.get('https://data.epa.gov.tw/api/v1/aqx_p_432?limit=1000&api_key=9be7b239-557b-4c10-9775-78cadfc555e9&sort=ImportDate%20desc&format=json')
  .then((res) => {
    data = res.data.records;
    updateTime = res.data.records[0].PublishTime;
    init();
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
    alert('資料讀取錯誤，請稍後再嘗試！')
  })

function init() {
  updateAreaRender();
  getCityData();
  areaSelectRender();
}
function updateAreaRender() {
  let date = ((updateTime.split(' ')[0]).split('/')).join('-');
  let time = ((updateTime.split(' ')[1]).split(':'));
  let timeDel = time.pop();
  time = time.join(':');
  updateArea.innerHTML = `${date}<span>${time}</span>`;
}
function getCityData() {
  data.forEach((item) => {
    if (districtNum[item.County] === undefined) {
      districtNum[item.County] = 1;
    } else {
      districtNum[item.County]++;
    }
  })
  cityArr = Object.keys(districtNum);
  console.log(cityArr);
}
function areaSelectRender() {
  let str = '';
  cityArr.forEach((item) => {
    str += `<option value="${item}">${item}</option>`;
  })
  areaSelect.innerHTML = str;
  cityName.textContent = areaSelect.value;
  currentCity = areaSelect.value;
  getDistrictData();
  AQICardListRender();
  AQIDataRender();
  areaSelect.addEventListener('change', () => {
    cityName.textContent = areaSelect.value;
    currentCity = areaSelect.value;
    getDistrictData();
    AQICardListRender();
    AQIDataRender();
  })
}
function getDistrictData() {
  currentCityData = [];
  data.forEach((item) => {
    if (item.County === currentCity) {
      currentCityData.push(item);
    }
  })
  currentDistrict = currentCityData[0].SiteName;
  console.log(currentCityData);
}
function AQICardListRender() {
  let str = '';
  currentCityData.forEach((item) => {
    let AQIBgColor = getBgAQIColor(item.AQI);
    str += `<li>
            <a class="card" data-district="${item.SiteName}" href="javascript:;">
              <h3 class="district" data-district="${item.SiteName}">${item.SiteName}</h3>
              <p class="AQIValue ${AQIBgColor}" data-district="${item.SiteName}">${item.AQI}</p>
            </a>
          </li>`
  })
  AQICardList.innerHTML = str;
  const AQICard = document.querySelectorAll('.js-AQICardList .card');
  AQICard.forEach((item) => {
    item.addEventListener('click', (e) => {
      currentDistrict = e.target.getAttribute('data-district');
      AQIDataRender();
      console.log(currentDistrict);
    })
  })
}
function AQIDataRender() {
  let str = '';
  currentCityData.forEach((item) => {
    let AQIBgColor = getBgAQIColor(item.AQI);
    if (item.SiteName === currentDistrict) {
      str = `<div class="card">
                <h3 class="district">${item.SiteName}</h3>
                <p class="AQIValue ${AQIBgColor}">${item.AQI}</p>
              </div>
              <ul class="dataList">
                <li>
                  <div class="d-flex ai-end">
                    <h4 class="fs-4">臭氧</h4>
                    <h4 class="englishName fs-5 fw-400">O<span class="sub">3</span> (ppb)</h4>
                  </div>
                  <p class="fs-4">${item.O3}</p>
                </li>
                <li>
                  <div class="d-flex ai-end">
                    <h4 class="fs-4">懸浮微粒</h4>
                    <h4 class="englishName fs-5 fw-400">PM<span class="sub">10</span> (μg/m³)</h4>
                  </div>
                  <p class="fs-4">${item.PM10}</p>
                </li>
                <li>
                  <div class="d-flex ai-end">
                    <h4 class="fs-4">細懸浮微粒</h4>
                    <h4 class="englishName fs-5 fw-400">PM<span class="sub">2.5</span> (μg/m³)</h4>
                  </div>
                  <p class="fs-4">${item['PM2.5']}</p>
                </li>
                <li>
                  <div class="d-flex ai-end">
                    <h4 class="fs-4">一氧化碳</h4>
                    <h4 class="englishName fs-5 fw-400">CO (ppm)</h4>
                  </div>
                  <p class="fs-4">${item.CO}</p>
                </li>
                <li>
                  <div class="d-flex ai-end">
                    <h4 class="fs-4">二氧化硫</h4>
                    <h4 class="englishName fs-5 fw-400">SO<span class="sub">2</span> (ppb)</h4>
                  </div>
                  <p class="fs-4">${item.SO2}</p>
                </li>
                <li>
                  <div class="d-flex ai-end">
                    <h4 class="fs-4">二氧化氮</h4>
                    <h4 class="englishName fs-5 fw-400">NO<span class="sub">2</span> (ppb)</h4>
                  </div>
                  <p class="fs-4">${item.NO2}</p>
                </li>
              </ul>`
    }
  })
  AQIDataArea.innerHTML = str;
}
function getBgAQIColor(AQI) {
  let AQIBgColor = '';
  if (AQI <= 50) {
    AQIBgColor = 'bg-green';
  } else if (AQI > 51 && AQI <= 100) {
    AQIBgColor = 'bg-orange-light';
  } else if (AQI > 101 && AQI <= 150) {
    AQIBgColor = 'bg-orange';
  } else if (AQI > 151 && AQI <= 200) {
    AQIBgColor = 'bg-red';
  } else if (AQI > 201 && AQI <= 300) {
    AQIBgColor = 'bg-blue';
  } else if (AQI > 301 && AQI <= 400) {
    AQIBgColor = 'bg-purple';
  }
  return AQIBgColor;
}