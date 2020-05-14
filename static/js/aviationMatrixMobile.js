// API url locations
const urlForecast = "./static/json/forecast.json";
const urlCriteria = "./static/json/criteria.json";

const matrix = document.querySelector("#matrix");
const criteriaPopup = document.querySelector("#criteria-popup");
const criteriaPopupName = document.querySelector(".criteria-name");
const criteriaPopupTable = document.querySelector(".criteria-table");

// variable to handle setTimeout/clearTimeout
let timeout;

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
		// apply color class
		matrixLineDiv.classList.add(applyColorClass(forecast[j].values[i], criteria.body[j]));
		// apply touchstart listener
		matrixLineDiv.addEventListener("touchstart", (event) => {
			populatePopup(event, criteria.body[j], forecast[j].fullName);
			console.log(event);
			// display popup after setTimout
			timeout = setTimeout(() => showPopup(true), 800);
		});
		// apply touchend listener
		matrixLineDiv.addEventListener("touchend", () => {
			clearTimeout(timeout);
			showPopup(false);
		});

		matrix.append(matrixLineDiv);
	}
};

const applyColorClass = (value, criteria) => {
	// check if variable is sfc wind to remove directional component
	if (criteria.variable === "maxSfcWind") {
		value = Number(value.slice(2));
	}
	// return color for associated class
	if (value > criteria.yellow) {
		return "red";
	} else if (value > criteria.green) {
		return "yellow";
	} else {
		return "green";
	}
};

// creates the criteria popup information
const populatePopup = (event, criteria, field) => {
	// get position of click
	const position = event.touches[0].clientY - 95;
	// build criteria popup
	criteriaPopupName.innerText = field;
	criteriaPopupTable.innerHTML = "";
	for (let i = 0; i < criteria.textArray.length; i++) {
		const newDiv = document.createElement("div");
		newDiv.innerText = criteria.textArray[i];
		newDiv.classList.add(criteria.colorsClass[i]);
		criteriaPopupTable.append(newDiv);
	}
	// reveal popup at proper position
	criteriaPopup.style.top = `${position}px`;
};

// displays/hides popup
const showPopup = (value) => {
	if (value) {
		criteriaPopup.classList.remove("hidden");
	} else {
		criteriaPopup.classList.add("hidden");
	}
};

getDataForMatrix();
