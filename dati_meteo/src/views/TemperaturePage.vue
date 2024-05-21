<template>
  <div>
    <h1>Temperature Medie Annue</h1>
    <apexchart type="line" :options="chartOptions" :series="chartSeries"></apexchart>
  </div>
</template>

<script>
import { loadExcelData } from '@/services/excelService';

export default {
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'temperature-chart',
        },
        xaxis: {
          categories: [],
        },
        title: {
          text: 'Temperature Medie Annue per Città',
        },
      },
      chartSeries: [],
    };
  },
  mounted() {
    loadExcelData('Tavole-Dati-Meteoclimatici-Anno-2021.xlsx').then((data) => {
      // Processa i dati e aggiorna chartOptions e chartSeries
    }).catch((error) => {
      console.error('Errore nel caricamento dei dati Excel:', error);
    });
  },
};
</script>

<style scoped>
/* Aggiungi qui gli stili specifici per la TemperaturePage */
</style>
