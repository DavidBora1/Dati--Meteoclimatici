<template>
  <div class="grafi-tab">
    <div v-if="temperatureData.length">
      <h1 class="chart-title">Temperature</h1>
      <apexchart type="area" :options="temperatureChartOptions" :series="temperatureChartData"></apexchart>
    </div>
    <div v-if="precipitazioniData.length">
      <h1 class="chart-title">Precipitazioni</h1>
      <apexchart type="area" :options="precipitazioniChartOptions" :series="precipitazioniChartData"></apexchart>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import * as XLSX from 'xlsx';

export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      precipitazioniData: [],
      temperatureData: [],
      precipitazioniChartOptions: {
        chart: {
          type: 'area',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#1E90FF'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Millimetri (mm)'
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " mm";
            }
          }
        },
        title: {
          text: 'Precipitazioni annuali',
          align: 'center',
          style: {
            fontSize: '18px',
            fontWeight: 'bold'
          }
        }
      },
      precipitazioniChartData: [{
        name: 'Precipitazioni',
        data: []
      }],
      temperatureChartOptions: {
        chart: {
          type: 'area',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#FF6347'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Gradi Celsius (°C)'
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " °C";
            }
          }
        },
        title: {
          text: 'Temperature annuali',
          align: 'center',
          style: {
            fontSize: '18px',
            fontWeight: 'bold'
          }
        }
      },
      temperatureChartData: [{
        name: 'Temperatura',
        data: []
      }]
    };
  },
  mounted() {
    this.loadLocalData('precipitazioni');
    this.loadLocalData('temperature');
  },
  methods: {
    async loadExcelFile(type) {
      try {
        const response = await fetch(new URL(`@/assets/${type}.xlsx`, import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (type === 'precipitazioni') {
          this.precipitazioniData = json;
          this.updateChartData(this.precipitazioniData, this.precipitazioniChartData, this.precipitazioniChartOptions);
        } else {
          this.temperatureData = json;
          this.updateChartData(this.temperatureData, this.temperatureChartData, this.temperatureChartOptions);
        }
      } catch (error) {
        console.error(`Error loading ${type} Excel file:`, error);
      }
    },
    updateChartData(data, chartDataArray, options) {
      if (Array.isArray(data) && data.length > 1) {
        options.xaxis.categories = data.slice(1).map(item => item[0]);
        chartDataArray[0].data = data.slice(1).map(item => parseFloat(item[1]));
      }
    },
    loadLocalData(type) {
      const localData = localStorage.getItem(`${type}_data`);
      if (localData) {
        const parsedData = JSON.parse(localData);
        if (type === 'precipitazioni') {
          this.precipitazioniData = parsedData;
          this.updateChartData(parsedData, this.precipitazioniChartData, this.precipitazioniChartOptions);
        } else {
          this.temperatureData = parsedData;
          this.updateChartData(parsedData, this.temperatureChartData, this.temperatureChartOptions);
        }
      }
    }
  }
};
</script>

<style scoped>
.grafi-tab {
  background-color: #ffffff; /* White background */
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: auto;
  margin-top: 20px;
}

.chart-title {
  color: #333333; /* Dark grey title */
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Helvetica', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
