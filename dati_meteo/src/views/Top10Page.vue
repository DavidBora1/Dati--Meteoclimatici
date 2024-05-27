<template>
  <div class="top10-page">
    <center>
      <h1 class="section-title">Top 10 Comuni Più Caldi</h1>
    </center>
    <div class="container">
      <table v-if="jsonData.length" class="data-table">
        <thead>
          <tr>
            <th v-for="(value, key) in jsonData[0]" :key="key">{{ key }}</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in top10ComuniCaldi" :key="rowIndex">
            <td v-for="(value, key) in row" :key="key" @click="editCell(rowIndex, key)">
              <span v-if="!isEditing(rowIndex, key)">{{ value }}</span>
              <input v-else v-model="jsonData[rowIndex][key]" class="editable-cell">
            </td>
            <td>
              <button class="save-button" @click="saveRow(rowIndex)">Salva</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  name: 'Top10Page',
  data() {
    return {
      jsonData: [],
      originalData: [],
      editedCells: [],
      localStorageKey: 'temperature_data'
    }
  },
  computed: {
    top10ComuniCaldi() {
      return this.jsonData
        .slice()
        .sort((a, b) => b.Temperature - a.Temperature)
        .slice(0, 10);
    }
  },
  mounted() {
    this.loadLocalData();
    if (!this.jsonData.length) {
      this.loadExcelFile();
    }
    this.saveLocalData();
  },
  methods: {
    async loadExcelFile() {
      try {
        const response = await fetch(new URL('@/assets/temperature.xlsx', import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        let json = XLSX.utils.sheet_to_json(worksheet);

        json = json.filter(row => Object.values(row).some(cell => cell !== ''));

        this.jsonData = json;
        this.originalData = JSON.parse(JSON.stringify(json));
        this.saveLocalData();
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    },
    isEditing(rowIndex, key) {
      return this.editedCells.some(cell => cell.rowIndex === rowIndex && cell.key === key);
    },
    editCell(rowIndex, key) {
      if (!this.isEditing(rowIndex, key)) {
        this.editedCells.push({ rowIndex, key });
      }
    },
    saveRow(rowIndex) {
      this.editedCells = this.editedCells.filter(cell => cell.rowIndex !== rowIndex);
      this.updateExcelFile();
      this.saveLocalData();
    },
    saveLocalData() {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.jsonData));
    },
    loadLocalData() {
      const localData = localStorage.getItem(this.localStorageKey);
      if (localData) {
        this.jsonData = JSON.parse(localData);
      }
    },
    async updateExcelFile() {
      try {
        const worksheet = XLSX.utils.json_to_sheet(this.jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

        await fetch('/api/update-excel', {
          method: 'POST',
          body: excelData,
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        });

        console.log('File Excel aggiornato con successo');
      } catch (error) {
        console.error('Errore durante l\'aggiornamento del file Excel:', error);
      }
    }
  }
};
</script>

<style scoped>
.top10-page {
  color: #ffffff;
}

.section-title {
  color: #bb86fc;
  margin-bottom: 20px;
}

.container {
  background-color: #1f1f1f;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.data-table th,
.data-table td {
  border: 1px solid #3e3e3e;
  padding: 8px;
  text-align: left;
}

.editable-cell {
  background-color: #1f1f1f;
  color: #ffffff;
  border: none;
  width: 100%;
  padding: 5px;
}

.save-button {
  color: #ffffff;
  background-color: #bb86fc;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 5px 10px;
  transition: background-color 0.3s, transform 0.3s;
}

.save-button:hover {
  background-color: #cfb2f2;
  transform: scale(1.05);
}
</style>
