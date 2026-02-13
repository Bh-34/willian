<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- Column 1: Brand -->
        <div class="footer-column">
          <div class="footer-logo">
            <span class="logo-icon">TS</span>
            <span class="logo-text">Tech Store</span>
          </div>
          <p class="footer-desc">Plataforma de aprendizado online com cursos de alta qualidade para sua formação profissional.</p>
          <div class="social-links">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">X</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Instagram">ig</a>
          </div>
        </div>

        <!-- Column 2: Product -->
        <div class="footer-column">
          <h4 class="footer-title">Produto</h4>
          <ul class="footer-links">
            <li><router-link to="/">Dashboard</router-link></li>
            <li><router-link to="/perfil">Perfil</router-link></li>
            <li><a href="#">Cursos</a></li>
            <li><a href="#">Certificados</a></li>
          </ul>
        </div>

        <!-- Column 3: Support -->
        <div class="footer-column">
          <h4 class="footer-title">Suporte</h4>
          <ul class="footer-links">
            <li><a href="#">Central de Ajuda</a></li>
            <li><a href="#">Contato</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Comunidade</a></li>
          </ul>
        </div>

        <!-- Column 4: Company -->
        <div class="footer-column">
          <h4 class="footer-title">Empresa</h4>
          <ul class="footer-links">
            <li><a href="#">Sobre Nós</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Carreiras</a></li>
            <li><a href="#">Imprensa</a></li>
          </ul>
        </div>

        <!-- Column 5: Legal -->
        <div class="footer-column">
          <h4 class="footer-title">Legal</h4>
          <ul class="footer-links">
            <li><a href="#">Privacidade</a></li>
            <li><a href="#">Termos</a></li>
            <li><a href="#">Cookies</a></li>
            <li><a href="#">Licenças</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-divider"></div>

      <div class="footer-bottom">
        <p class="copyright">© 2026 Tech Store. Todos os direitos reservados.</p>
        <div class="footer-badges">
          <span class="badge">Seguro</span>
          <span class="badge">Confiável</span>
          <span class="badge">Certificado</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer'
})
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #5A4436 0%, #85685A 100%);
  color: #E5E7EB;
  padding: var(--spacing-3xl) 0;
  margin-top: var(--spacing-3xl);
  border-top: 1px solid rgba(133, 104, 90, 0.2);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-3xl);
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.logo-icon {
  font-size: 1.8rem;
}

.logo-text {
  font-size: 1.3rem;
  font-weight: 800;
  color: #E5E7EB;
  letter-spacing: -0.5px;
}

.footer-desc {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(229, 231, 235, 0.8);
  margin: 0;
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.social-links a {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(133, 104, 90, 0.2);
  border-radius: var(--radius-lg);
  color: #85685A;
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  border: 1px solid rgba(133, 104, 90, 0.3);
}

.social-links a:hover {
  background: #85685A;
  color: white;
  border-color: #85685A;
  transform: translateY(-3px);
}

.footer-title {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0;
  margin-bottom: var(--spacing-md);
  letter-spacing: -0.3px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-links li {
  margin: 0;
}

.footer-links a {
  color: rgba(229, 231, 235, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: var(--transition);
  display: inline-block;
}

.footer-links a:hover {
  color: #4A90E2;
  transform: translateX(4px);
}

.footer-divider {
  height: 1px;
  background: rgba(74, 144, 226, 0.2);
  margin-bottom: var(--spacing-2xl);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.copyright {
  font-size: 0.9rem;
  color: rgba(229, 231, 235, 0.7);
  margin: 0;
}

.footer-badges {
  display: flex;
  gap: var(--spacing-md);
}

.badge {
  padding: 6px 12px;
  background: rgba(133, 104, 90, 0.15);
  border: 1px solid rgba(133, 104, 90, 0.3);
  border-radius: var(--radius-md);
  color: #85685A;
  font-size: 0.8rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .footer {
    padding: var(--spacing-2xl) 0;
  }

  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .footer-badges {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
  }

  .footer-column:first-child {
    order: -1;
  }
}
</style>
