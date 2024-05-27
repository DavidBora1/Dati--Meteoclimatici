<template>
  <div class="container">
    <header>
      <h1>STORIA METEO</h1>
    </header>
    <nav>
      <div class="navbar">
        <button @click="goHome" :class="{ active: currentRoute === '/HomeTab' }">Dati</button>
        <button @click="goGrafici" :class="{ active: currentRoute === '/GrafiTab' }">Grafici dei Dati</button>
        <button @click="goComunii" :class="{ active: currentRoute === '/Top10Page' }">Top 10 Comuni Più Caldi</button>
      </div>
    </nav>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentRoute: ''
    };
  },
  created() {
    this.currentRoute = this.$route.path;
  },
  methods: {
    goHome() {
      this.$router.push('/HomeTab');
    },
    goGrafici() {
      this.$router.push('/GrafiTab');
    },
    goComunii() {
      this.$router.push('/Top10Page');
    },
    goGraficii() {
      this.$router.push('/Top10Grafi');
    }
  },
  watch: {
    '$route'(to) {
      this.currentRoute = to.path;
    }
  }
};
</script>

<style>
body {
  background-color: #121212;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
}

.container {
  text-align: center;
  padding: 20px;
}

header {
  background-color: #1f1f1f;
  color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.navbar {
  display: flex;
  justify-content: center;
  background-color: #333333;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.navbar button {
  font-weight: bold;
  color: #ffffff;
  background-color: #1f1f1f;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  padding: 10px 20px;
  margin-right: 10px;
  transition: background-color 0.3s, transform 0.3s;
}

.navbar button:hover {
  background-color: #3e3e3e;
  transform: scale(1.05);
}

.navbar button.active {
  color: #1f1f1f;
  background-color: #bb86fc;
}

main {
  padding: 20px;
}
</style>
