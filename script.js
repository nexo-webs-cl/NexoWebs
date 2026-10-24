/**
 * ============================================================================
 * CONFIGURACIÓN RÁPIDA DEL ESTUDIO
 * Cambia aquí el nombre de tu equipo, tu número de WhatsApp y correo cuando
 * definan la identidad final. Se actualizará automáticamente en toda la web.
 * ============================================================================
 */
const STUDIO_CONFIG = {
  brandName: 'Nexo Webs',
  whatsappNumber: '56972652673', // +56 9 7265 2673 (Formato internacional sin '+' ni espacios)
  whatsappDisplay: '+56 9 7265 2673',
  contactEmail: 'nexowebs.1@gmail.com',
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sincronizar nombre de marca y enlaces de contacto desde STUDIO_CONFIG
  document.querySelectorAll('[data-brand-name]').forEach((el) => {
    el.textContent = STUDIO_CONFIG.brandName;
  });

  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const directWaLink = document.getElementById('direct-wa-link');
  if (directWaLink) {
    const defaultMsg = encodeURIComponent(
      `Hola ${STUDIO_CONFIG.brandName}! Me gustaría cotizar una página web para mi emprendimiento.`
    );
    directWaLink.href = `https://wa.me/${STUDIO_CONFIG.whatsappNumber}?text=${defaultMsg}`;
  }

  // 2. Control de Modo Oscuro / Claro (dark-mode-toggle)
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
  const themeToggleBtn = document.getElementById('theme-toggle');

  const getStoredScheme = () => {
    try {
      const val = localStorage.getItem('color-scheme');
      return val === 'light' || val === 'dark' ? val : null;
    } catch {
      return null;
    }
  };

  const getSystemScheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  if (themeToggleBtn && colorSchemeMeta) {
    themeToggleBtn.addEventListener('click', () => {
      const stored = getStoredScheme();
      const system = getSystemScheme();
      const currentRendered = stored ?? system;
      const targetScheme = currentRendered === 'dark' ? 'light' : 'dark';

      // Comprobar divergencia únicamente al guardar
      if (targetScheme !== system) {
        try {
          localStorage.setItem('color-scheme', targetScheme);
        } catch {}
        colorSchemeMeta.content = targetScheme;
      } else {
        try {
          localStorage.removeItem('color-scheme');
        } catch {}
        colorSchemeMeta.content = 'light dark';
      }
    });

    // Sincronizar cambios realizados desde otra pestaña
    window.addEventListener('storage', (e) => {
      if (e.key === 'color-scheme') {
        colorSchemeMeta.content = e.newValue === 'light' || e.newValue === 'dark' ? e.newValue : 'light dark';
      }
    });
  }

  // 3. Fallback para animaciones de entrada al hacer scroll (scroll-entry-exit-effects)
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12 }
      );
      revealElements.forEach((el) => observer.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add('is-visible'));
    }
  }

  // 4. Menú de navegación móvil
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileNav.hidden = isExpanded;
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      });
    });
  }

  // 5. Conmutador interactivo PC / Móvil en el Hero
  const heroViewport = document.getElementById('hero-viewport');
  const deviceButtons = document.querySelectorAll('.device-btn');

  if (heroViewport && deviceButtons.length > 0) {
    deviceButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetDevice = btn.getAttribute('data-device') || 'desktop';
        heroViewport.setAttribute('data-view', targetDevice);

        deviceButtons.forEach((otherBtn) => {
          const isCurrent = otherBtn === btn;
          otherBtn.classList.toggle('active', isCurrent);
          otherBtn.setAttribute('aria-pressed', String(isCurrent));
        });
      });
    });
  }

  // 6. Tabs de Ejemplos por Rubro con soporte para hidden="until-found" y beforematch
  const showcase = document.getElementById('industry-showcase');
  if (showcase) {
    const tabs = showcase.querySelectorAll('.industry-tab');
    const panels = showcase.querySelectorAll('.industry-panel');

    const activatePanel = (targetPanelId) => {
      panels.forEach((panel) => {
        if (panel.id === targetPanelId) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', 'until-found');
        }
      });

      tabs.forEach((tab) => {
        const isSelected = tab.getAttribute('aria-controls') === targetPanelId;
        tab.setAttribute('aria-selected', String(isSelected));
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('aria-controls');
        if (targetId) {
          activatePanel(targetId);
        }
      });
    });

    // Sincronizar estado cuando el navegador revela contenido oculto mediante "Buscar en la página"
    showcase.addEventListener('beforematch', (e) => {
      const matchedPanel = e.target.closest('.industry-panel');
      if (!matchedPanel) return;

      panels.forEach((panel) => {
        if (panel !== matchedPanel) {
          panel.setAttribute('hidden', 'until-found');
        }
      });

      tabs.forEach((tab) => {
        const controls = tab.getAttribute('aria-controls');
        tab.setAttribute('aria-selected', controls === matchedPanel.id ? 'true' : 'false');
      });
    });

    // Fallback para navegadores que aún no soportan onbeforematch
    if (!('onbeforematch' in HTMLElement.prototype)) {
      panels.forEach((panel, index) => {
        if (index !== 0) {
          panel.hidden = true;
        }
      });
    }
  }

  // 7. Botones "Cotizar este formato" y "Cotizar por rubro" -> Pre-llenan el formulario
  const packageSelect = document.getElementById('package-select');
  const businessInput = document.getElementById('business-name');
  const clientNameInput = document.getElementById('client-name');
  const quoteSection = document.getElementById('cotizar');

  document.querySelectorAll('.js-select-package').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedPkg = btn.getAttribute('data-package');
      if (packageSelect && selectedPkg) {
        packageSelect.value = selectedPkg;
      }
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        if (clientNameInput) clientNameInput.focus();
      }, 450);
    });
  });

  document.querySelectorAll('.js-select-industry').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedPkg = btn.getAttribute('data-package');
      const selectedIndustry = btn.getAttribute('data-industry');

      if (packageSelect && selectedPkg) {
        packageSelect.value = selectedPkg;
      }
      if (businessInput && selectedIndustry && !businessInput.value.trim()) {
        businessInput.value = selectedIndustry;
      }
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        if (clientNameInput) clientNameInput.focus();
      }, 450);
    });
  });

  // 8. Validación accesible y envío del Cotizador (WhatsApp o Email)
  const quoteForm = document.getElementById('quote-form');
  const sendEmailBtn = document.getElementById('send-email-btn');
  const errorSummary = document.getElementById('form-error-summary');
  const errorList = document.getElementById('form-error-list');
  const formFeedback = document.getElementById('form-feedback');

  const validateQuoteForm = () => {
    const errors = [];
    const nameVal = clientNameInput ? clientNameInput.value.trim() : '';
    const bizVal = businessInput ? businessInput.value.trim() : '';

    const nameErrorEl = document.getElementById('error-client-name');
    const bizErrorEl = document.getElementById('error-business-name');

    if (!nameVal) {
      errors.push({ id: 'client-name', message: 'Ingresa tu nombre.' });
      if (clientNameInput) clientNameInput.setAttribute('aria-invalid', 'true');
      if (nameErrorEl) nameErrorEl.hidden = false;
    } else {
      if (clientNameInput) clientNameInput.removeAttribute('aria-invalid');
      if (nameErrorEl) nameErrorEl.hidden = true;
    }

    if (!bizVal) {
      errors.push({ id: 'business-name', message: 'Indica el nombre o rubro de tu emprendimiento.' });
      if (businessInput) businessInput.setAttribute('aria-invalid', 'true');
      if (bizErrorEl) bizErrorEl.hidden = false;
    } else {
      if (businessInput) businessInput.removeAttribute('aria-invalid');
      if (bizErrorEl) bizErrorEl.hidden = true;
    }

    if (errors.length > 0) {
      if (errorList && errorSummary) {
        errorList.innerHTML = '';
        errors.forEach((err) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${err.id}`;
          a.textContent = err.message;
          li.appendChild(a);
          errorList.appendChild(li);
        });
        errorSummary.hidden = false;
        errorSummary.focus();
      }
      return null;
    }

    if (errorSummary) {
      errorSummary.hidden = true;
    }

    const pkgVal = packageSelect ? packageSelect.value : 'Página web a medida';
    const detailsEl = document.getElementById('project-details');
    const detailsVal = detailsEl ? detailsEl.value.trim() : '';

    return {
      clientName: nameVal,
      businessName: bizVal,
      packageType: pkgVal,
      projectDetails: detailsVal,
    };
  };

  const buildQuoteMessage = (data) => {
    const lines = [
      `Hola ${STUDIO_CONFIG.brandName}! Quiero cotizar una página web para mi emprendimiento:`,
      ``,
      `• Nombre: ${data.clientName}`,
      `• Emprendimiento / Rubro: ${data.businessName}`,
      `• Formato de interés: ${data.packageType}`,
    ];
    if (data.projectDetails) {
      lines.push(`• Idea / Detalles: ${data.projectDetails}`);
    }
    return lines.join('\n');
  };

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = validateQuoteForm();
      if (!data) return;

      const message = buildQuoteMessage(data);
      const waUrl = `https://wa.me/${STUDIO_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
      if (formFeedback) {
        formFeedback.textContent = 'Abriendo WhatsApp con tu solicitud lista...';
      }
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      const data = validateQuoteForm();
      if (!data) return;

      const subject = `Solicitud de cotización web — ${data.businessName}`;
      const body = buildQuoteMessage(data);

      if (formFeedback) {
        formFeedback.textContent = 'Abriendo Gmail con tu cotización lista para enviar...';
      }

      // Enlace directo a Gmail Web (instantáneo en PC)
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(STUDIO_CONFIG.contactEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const mailtoUrl = `mailto:${STUDIO_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = mailtoUrl;
      } else {
        const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          window.location.href = mailtoUrl;
        }
      }
    });
  }
});
