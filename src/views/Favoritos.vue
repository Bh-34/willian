<template>
  <div class="favorites">
    <div class="header">
      <h1>TS Tech Store</h1>
      <nav>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/perfil">Perfil</a></li>
        </ul>
      </nav>
    </div>

    <div class="content">
      <h2>Seus cursos favoritos</h2>
      <input type="text" placeholder="🔍 Buscar cursos..." v-model="searchQuery" />
      <p>{{ filteredCourses.length }} cursos encontrados</p>
      <div class="courses">
        <div v-for="course in filteredCourses" :key="course.id" class="course-card">
          <h3>{{ course.title }}</h3>
          <p>{{ course.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      courses: [
        { id: 1, title: "Curso de Vue", description: "hellow" },
        { id: 2, title: "Curso de Vue", description: "hellow" },
        { id: 3, title: "sobeeba de Vue", description: "hellow" },
      ],
    };
  },
  computed: {
    filteredCourses() {
      return this.courses.filter((course) =>
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
};
</script>

<style scoped>
.favorites {
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  padding: 20px;
}

.header {
  background-color: #0d1117;
  color: #f0f6fc;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
}

.header nav ul {
  list-style: none;
  display: flex;
  gap: 15px;
  margin: 0;
  padding: 0;
}

.header nav ul li a {
  color: #f0f6fc;
  text-decoration: none;
}

.content {
  margin-top: 20px;
  text-align: center;
}

.content h2 {
  color: #0d1117;
}

.content input {
  padding: 10px;
  width: 80%;
  max-width: 400px;
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.courses {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.course-card {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.course-card h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #0d1117;
}

.course-card p {
  margin: 0;
  color: #6c757d;
}
</style>