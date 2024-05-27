<template>
  <div class="home-tab">
    <center>
      <h1 class="section-title">TEMPERATURE</h1>
    </center>
    <div class="container">
      <div class="button-container-left">
        <button class="data-button" @click="addNewYearColumn('temperature')">Aggiungi nuovo dato</button>
      </div>
      <table v-if="temperatureData.length" class="data-table">
        <thead>
          <tr>
            <th v-for="(value, key) in temperatureData[0]" :key="key">{{ key }}</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in temperatureData" :key="rowIndex">
            <td v-for="(value, key) in row" :key="key" @click="editCell('temperature', rowIndex, key)">
              <span v-if="!isEditing('temperature', rowIndex, key)">{{ value }}</span>
              <input v-else v-model="temperatureData[rowIndex][key]" class="editable-cell">
            </td>
            <td>
              <button class="save-button" @click="saveRow('temperature', rowIndex)">Salva</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <center>
      <h1 class="section-title">PRECIPITAZIONI</h1>
    </center>
    <div class="container">
      <div class="button-container-left">
        <button class="data-button" @click="addNewYearColumn('precipitazioni')">Aggiungi nuovo dato</button>
      </div>
      <table v-if="precipitazioniData.length" class="data-table">
        <thead>
          <tr>
            <th v-for="(value, key) in precipitazioniData[0]" :key="key">{{ key }}</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in precipitazioniData" :key="rowIndex">
            <td v-for="(value, key) in row" :key="key" @click="editCell('precipitazioni', rowIndex, key)">
              <span v-if="!isEditing('precipitazioni', rowIndex, key)">{{ value }}</span>
              <input v-else v-model="precipitazioniData[rowIndex][key]" class="editable-cell">
            </td>
            <td>
              <button class="save-button" @click="saveRow('precipitazioni', rowIndex)">Salva</button>
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
  name: 'HomeTab',
  data() {
    return {
      precipitazioniData: [],
      temperatureData: [],
      editedCells: [],
      localStorageKeys: {
        precipitazioni: 'precipitazioni_data',
        temperature: 'temperature_data'
      }
    };
  },
  mounted() {
    this.loadLocalData('precipitazioni');
    this.loadLocalData('temperature');
    if (!this.precipitazioniData.length) {
      this.loadExcelFile('precipitazioni');
    }
    if (!this.temperatureData.length) {
      this.loadExcelFile('temperature');
    }
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
        let json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (type === 'precipitazioni') {
          this.precipitazioniData = json;
        } else {
          this.temperatureData = json;
        }
        this.saveLocalData(type);
      } catch (error) {
        console.error(`Error loading ${type} Excel file:`, error);
      }
    },
    addNewYearColumn(type) {
      let data = type === 'precipitazioni' ? this.precipitazioniData : this.temperatureData;
      data.forEach((item, index) => {
        if (index === 0) {
          item.push(item[item.length - 1] + 1);
        } else {
          item.push(0);
        }
      });
      this.saveLocalData(type);
      this.updateExcelFile(type);
    },
    isEditing(type, rowIndex, key) {
      return this.editedCells.some(cell => cell.type === type && cell.rowIndex === rowIndex && cell.key === key);
    },
    editCell(type, rowIndex, key) {
      if (!this.isEditing(type, rowIndex, key)) {
        this.editedCells.push({ type, rowIndex, key });
      }
    },
    saveRow(type, rowIndex) {
      this.editedCells = this.editedCells.filter(cell => cell.rowIndex !== rowIndex || cell.type !== type);
      this.saveLocalData(type);
      this.updateExcelFile(type);
    },
    saveLocalData(type) {
      const data = type === 'precipitazioni' ? this.precipitazioniData : this.temperatureData;
      localStorage.setItem(this.localStorageKeys[type], JSON.stringify(data));
    },
    loadLocalData(type) {
      const localData = localStorage.getItem(this.localStorageKeys[type]);
      if (localData) {
        if (type === 'precipitazioni') {
          this.precipitazioniData = JSON.parse(localData);
        } else {
          this.temperatureData = JSON.parse(localData);
        }
      }
    },
    async updateExcelFile(type) {
      try {
        const data = type === 'precipitazioni' ? this.precipitazioniData : this.temperatureData;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(`Error updating ${type} Excel file:`, error);
      }
    }
  }
};
</script>

<style scoped>
.home-tab {
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

.button-container-left {
  text-align: left;
  margin-bottom: 10px;
}

.data-button {
  color: #ffffff;
  background-color: #3e3e3e;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  padding: 10px 20px;
  transition: background-color 0.3s, transform 0.3s;
}

.data-button:hover {
  background-color: #4e4e4e;
  transform: scale(1.05);
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
