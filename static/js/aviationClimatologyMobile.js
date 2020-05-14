// API url locations for climatology
const urlKTUS = "https://api.jsonbin.io/b/5ea1fc202940c704e1dd7991";

const climatologyChart = document.getElementById("climatologyChart");
const chartDiv = document.querySelector(".chart");
const loader = document.querySelector(".loader");

const colors = ["#E81D11", "#FF931F", "#333", "#6EAF3D"];
let labels = [];
let datasetLabels = [];
let datasetByLabel = {};

function getData() {
	axios
		.get(urlKTUS)
		.then(({ data: climatology }) => {
			labels = climatology.labels;
			datasetLabels = climatology.datasetLabels;
			datasetByLabel = climatology.datasetByLabel;
		})
		.then(() => {
			loader.classList.toggle("display-none");
			chartDiv.classList.toggle("display-none");
			let myLineChart = new Chart(climatologyChart, {
				type: "line",
				data: {
					labels: labels,
					datasets: buildDataset(),
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					title: {
						display: true,
						text: "Density Altitude By Month - KTUS",
						fontSize: 20,
					},
				},
			});
		});
}

function buildDataset() {
	const datasets = [];
	for (let i = 0; i < datasetLabels.length; i++) {
		const datasetObject = {};
		datasetObject.label = datasetLabels[i].toUpperCase();
		datasetObject.data = datasetByLabel[datasetLabels[i]];
		datasetObject.borderColor = colors[i];
		datasetObject.backgroundColor = "rgba(0,0,0,0)";
		datasetObject.lineTension = 0.3;
		datasets.push(datasetObject);
	}
	return datasets;
}

getData();
