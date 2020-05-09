// API url locations
const urlForecast = "./static/json/forecast.json";
const urlCriteria = "./static/json/criteria.json";

const matrix = document.querySelector("#matrix");

const getDataForMatrix = () => {
	axios
		.all([
			axios({
				method: "get",
				url: urlForecast,
				onDownloadProgress: function () {
					//reqFcst.innerHTML = "<span class='spinner-border'></span> Loading...";
				},
			}),
			axios.get(urlCriteria),
		])
		.then(
			axios.spread(({ data: forecast }, { data: criteria }) => {
				buildMatrix(forecast, criteria);
			})
		);
};

const buildMatrix = (forecast, criteria) => {
	const datesArray = buildDatesArray(forecast.validPeriod);
	for (let i = 0; i < datesArray.length; i++) {
		const dateDiv = document.createElement("div");
		dateDiv.classList.add("date-header");
		dateDiv.innerText = datesArray[i];
		matrix.append(dateDiv);
		fillDataForDay(forecast, criteria, i);
	}
};

// loops through and constructs an array of the "Day - Date"
const buildDatesArray = (validPeriod) => {
	const datesArray = [];
	for (let i = 0; i < validPeriod.day.length; i++) {
		datesArray.push(validPeriod.day[i] + " - " + validPeriod.date[i]);
	}
	return datesArray;
};

// populates data for the matrix for one day
const fillDataForDay = ({ forecast }, criteria, i) => {
	for (let j = 0; j < forecast.length; j++) {
		const matrixLineDiv = document.createElement("div");
		matrixLineDiv.classList.add("matrix-line");
		const fieldNameDiv = document.createElement("div");
		const fieldValueDiv = document.createElement("div");
		fieldNameDiv.innerText = forecast[j].fullName;
		fieldValueDiv.innerText = forecast[j].values[i];
		matrixLineDiv.append(fieldNameDiv);
		matrixLineDiv.append(fieldValueDiv);
		matrix.append(matrixLineDiv);
	}
};

getDataForMatrix();
