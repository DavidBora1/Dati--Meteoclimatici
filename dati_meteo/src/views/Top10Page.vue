<template>
  <div>
    <h1>Top 10 Città Più Calde</h1>
    <apexchart type="bar" :options="chartOptions" :series="chartSeries"></apexchart>
  </div>
</template>

<script>
import { loadExcelData } from '@/services/excelService';

export default {
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'top10-chart',
        },
        xaxis: {
          categories: [],
        },
        title: {
          text: 'Top 10 Città Più Calde',
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
/* Aggiungi qui gli stili specifici per la Top10Page */
</style>
