(() => {
  /* ===========================
     СКРИПТ: полный рабочий файл
     + loader (анимация)
     + автоворот (rotate toggle)
     + retry/fallback для .glb
     =========================== */

  const MENU = [
    {
      id: "page1",
      name: "Школьный музей",
      price: 9.5,
      image: "https://maksim15132.github.io/museum/assets/i.jpg",
      description: "Здесь вы можете увидеть экспонаты нашего прекрасного музея",
      modelGlb: "https://maksim15132.github.io/museum/assets/modelGlb/margarita/pizza.glb",
      modelUsdz: "https://modelviewer.dev/shared-assets/models/Pizza.usdz",
      link: "https://maksim15132.github.io/museum/ar-models/",
    },
    {
      id: "page2",
      name: "Литература",
      price: 11.0,
      image: "https://maksim15132.github.io/museum/assets/1546106602_carti-14.jpg",
      description: "Здесь вы можите увидеть коллекцию книг, посвящённых различным историческим событиям.",
      modelGlb: "https://maksim15132.github.io/museum/assets/modelGlb/piperoni/pizza.glb",
      modelUsdz: "https://maksim15132.github.io/museum/assets/modelUsdz/Pepperoni_and_Spinach_Pizza.usdz",
      link: "https://maksim15132.github.io/museum/books/",
    },
  
    
  ];

  // ===== DOM =====
  const toggleStateBtn = document.getElementById("toggle-state-btn");
  const menuGrid = document.getElementById("menu-grid");
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalPrice = document.getElementById("modal-price");
  const modalDesc = document.getElementById("modal-desc");
  const modelViewer = document.getElementById("model-viewer");
  const arLink = document.getElementById("ar-link");
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modelStatus = document.getElementById("model-status");
  const modelError = document.getElementById("model-error");
  const modalPanel = document.querySelector(".modal-panel");
  const modalPreview = document.querySelector(".modal-preview");

  const cartBtn = document.getElementById("cart-btn");
  const cartCount = document.getElementById("cart-count");
  const cartPreview = document.getElementById("cart-preview");
  const cartItemsCount = document.getElementById("cart-items-count");
  const cartTotal = document.getElementById("cart-total");
  const orderBtn = document.getElementById("order-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // ===== UI Improvements: inject loader + styles dynamically (works без изменения HTML) =====
  (function injectLoaderStylesAndNode() {
    const style = document.createElement("style");
    style.textContent = `
      /* loader overlay for model-viewer */
      .mv-loader {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .mv-loader .spinner {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 6px solid rgba(255,255,255,0.08);
        border-top-color: rgba(255,255,255,0.95);
        animation: mv-spin 1s linear infinite;
        box-shadow: 0 6px 18px rgba(2,6,23,0.6);
      }
      @keyframes mv-spin { to { transform: rotate(360deg); } }
      .mv-overlay {
        position: relative;
      }
      .mv-controls {
        margin-top: 10px;
        display:flex;
        gap:8px;
        align-items:center;
      }
      .mv-btn {
        padding:8px 10px;
        border-radius:8px;
        border:1px solid rgba(255,255,255,0.06);
        background:transparent;
        cursor:pointer;
        font-weight:700;
      }
      .mv-btn.active {
        background: linear-gradient(90deg,var(--accent),#ffb28b); color:#071022;
        color:#071022;
      }
      .mv-retry {
        padding:6px 8px;
        border-radius:8px;
        background: rgba(255,255,255,0.04);
        border:1px solid rgba(255,255,255,0.06);
        cursor:pointer;
      }
    `;
    document.head.appendChild(style);

    // create loader overlay element and attach inside modal-preview
    const loader = document.createElement("div");
    loader.className = "mv-loader";
    loader.style.display = "none"; // hidden by default
    loader.innerHTML = `<div class="spinner" aria-hidden="true"></div>`;
    // wrap preview in mv-overlay
    if (modalPreview) {
      modalPreview.classList.add("mv-overlay");
      modalPreview.appendChild(loader);
    }
    // expose to outer scope
    window.__mv_loader_node = loader;
  })();

  // ===== Theme =====
  function setTheme(theme) {
    if (theme === "light") {
      body.classList.remove("dark"); body.classList.add("light");
      themeToggle.textContent = "🌙 Тёмная";
    } else {
      body.classList.remove("light"); body.classList.add("dark");
      themeToggle.textContent = "☀️ Светлая";
    }
    localStorage.setItem("ar_theme", theme);
  }
  const savedTheme = localStorage.getItem("ar_theme") || "dark";
  setTheme(savedTheme);
  themeToggle.onclick = () => {
    const newTheme = body.classList.contains("light") ? "dark" : "light";
    setTheme(newTheme);
  };

  // ===== Cart =====
  let cart = JSON.parse(localStorage.getItem("ar_cart") || "[]");
  function saveCart() { localStorage.setItem("ar_cart", JSON.stringify(cart)); }
  function updateCartUI() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cartCount) { cartCount.style.display = count > 0 ? "inline-block" : "none"; cartCount.textContent = count; }
    if (cartItemsCount) cartItemsCount.textContent = count + " шт";
    const total = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
    if (cartTotal) cartTotal.innerHTML = `Итого: <strong>€${total.toFixed(2)}</strong>`;
    if (cartPreview) cartPreview.style.display = count > 0 ? "flex" : "none";
  }
  function addToCart(dish, qty = 1) {
    const found = cart.find((item) => item.id === dish.id);
    if (found) found.qty += qty; else cart.push({ ...dish, qty });
    saveCart(); updateCartUI();
  }
  function clearCart() { cart = []; saveCart(); updateCartUI(); }
  orderBtn.onclick = () => alert("Оформление заказа пока не реализовано (демо).");
  clearCartBtn.onclick = () => clearCart();
 
  updateCartUI();

  // ===== Render hero-cards =====
  function createHeroCard(dish, index) {
    const article = document.createElement("article");
    article.className = "hero-card";

    const media = document.createElement("div"); media.className = "card-media";
    const img = document.createElement("img"); img.src = dish.image; img.alt = dish.name;
    media.appendChild(img);

    const content = document.createElement("div"); content.className = "card-content";
    const meta = document.createElement("div"); meta.className = "meta";
    const nameDiv = document.createElement("div"); nameDiv.style.fontWeight = "800"; nameDiv.textContent = dish.name;
    const priceDiv = document.createElement("div"); priceDiv.className = "price"; priceDiv.textContent = `€${dish.price.toFixed(2)}`;
    meta.appendChild(nameDiv); meta.appendChild(priceDiv);

    const desc = document.createElement("p");
    desc.style.color = "var(--muted)"; desc.style.marginTop = "8px"; desc.style.fontSize = "32px";
    desc.textContent = dish.description;

    const buttonsDiv = document.createElement("div"); buttonsDiv.className = "card-actions";

    const detailsBtn = document.createElement("button");  // создаём <a> вместо <button>
    detailsBtn.className = "btn btn-primary big-btn";     // сохраняем те же стили
    detailsBtn.textContent = "Перейти в раздел";         // текст ссылки
    detailsBtn.onclick = () => {
      window.location.href = dish.link;
    
};


    buttonsDiv.appendChild(detailsBtn);

    content.appendChild(meta); content.appendChild(desc); content.appendChild(buttonsDiv);

    article.appendChild(media); article.appendChild(content);
    return article;
  }
  function renderMenu() {
    menuGrid.innerHTML = "";
    MENU.forEach((dish, i) => { menuGrid.appendChild(createHeroCard(dish, i)); });
  }
  renderMenu();

  // ===== Modal behavior + Model Viewer enhancements =====
  let currentDish = null;
  let lastModelFailed = false;
  let autoRotate = false; // state for auto-rotation
  let phoneState = "closed";

  // helper to access injected loader node
  const loaderNode = window.__mv_loader_node || null;

  // create rotate + retry controls inside modal-actions (if not present)
  (function ensureMvControls() {
    // find modal-actions area (exists in HTML)
    const modalActions = document.querySelector(".modal-actions");
    if (!modalActions) return;
    // create rotate button
    if (!document.getElementById("mv-rotate-btn")) {
      const rotateBtn = document.createElement("button");
      rotateBtn.id = "mv-rotate-btn";
      rotateBtn.className = "mv-btn";
      rotateBtn.textContent = "Авто-вращение";
      rotateBtn.title = "Включить/выключить автоматическое вращение модели";
      rotateBtn.onclick = () => {
        autoRotate = !autoRotate;
        rotateBtn.classList.toggle("active", autoRotate);
        toggleAutoRotate(autoRotate);
      };
      modalActions.insertBefore(rotateBtn, modalActions.firstChild);
    }
    // create retry button placeholder
    if (!document.getElementById("mv-retry-btn")) {
      const retryWrap = document.createElement("div");
      retryWrap.style.display = "none";
      retryWrap.id = "mv-retry-wrap";
      retryWrap.style.marginLeft = "8px";

      const retryBtn = document.createElement("button");
      retryBtn.id = "mv-retry-btn";
      retryBtn.className = "mv-retry";
      retryBtn.textContent = "Попробовать загрузить снова";
      retryBtn.onclick = () => {
        if (currentDish && currentDish.modelGlb) {
          lastModelFailed = false;
          startModelLoad(currentDish.modelGlb);
        }
      };

      const downloadLink = document.createElement("a");
      downloadLink.id = "mv-download-link";
      downloadLink.className = "mv-retry";
      downloadLink.style.marginLeft = "8px";
      downloadLink.textContent = "Скачать .glb";
      downloadLink.target = "_blank";
      downloadLink.rel = "noopener noreferrer";

      retryWrap.appendChild(retryBtn);
      retryWrap.appendChild(downloadLink);
      modalActions.appendChild(retryWrap);
    }
  })();

  function showLoader(show) {
    if (!loaderNode) return;
    loaderNode.style.display = show ? "flex" : "none";
  }

  function toggleAutoRotate(enable) {
    if (!modelViewer) return;
    if (enable) {
      // model-viewer supports "auto-rotate"
      modelViewer.setAttribute("auto-rotate", "");
      modelViewer.setAttribute("rotation-per-second", "30deg");
    } else {
      modelViewer.removeAttribute("auto-rotate");
      modelViewer.removeAttribute("rotation-per-second");
    }
  }

  // centralised start loader -> attaches listeners and sets src
function startModelLoad(glbUrl) {
  if (!glbUrl) return;

  showLoader(true);
  modelError.style.display = "none";
  modelStatus.textContent = "Статус 3D: загрузка...";

  modelViewer.style.display = "block";
  modelViewer.style.visibility = "visible";
  modelViewer.style.opacity = "1";

  modelViewer.removeAttribute("src");

  const onLoad = () => {
    showLoader(false);
    modelStatus.textContent = "Статус 3D: модель загружена ✅";
    modalImg.style.display = "none";
    modalPanel.classList.add("model-loaded");
    modelViewer.removeEventListener("load", onLoad);
    modelViewer.removeEventListener("error", onError);
  };

  const onError = () => {
    showLoader(false);
    modelStatus.textContent = "Статус 3D: ошибка загрузки ❌";
    modelError.style.display = "block";
    modelViewer.removeEventListener("load", onLoad);
    modelViewer.removeEventListener("error", onError);
  };

  modelViewer.addEventListener("load", onLoad, { once: true });
  modelViewer.addEventListener("error", onError, { once: true });

  requestAnimationFrame(() => {
    modelViewer.src = glbUrl;
  });
}


  function openModal(dish) {
    currentDish = dish;
    modal.style.display = "flex";
    body.classList.add("modal-open");

    modalTitle.textContent = dish.name;
    modalPrice.textContent = `Цена: €${dish.price.toFixed(2)}`;
    modalDesc.textContent = dish.description;

    modelViewer.poster = dish.image;
    modelViewer.alt = dish.name;

    arLink.href = dish.modelUsdz || "#";
    arLink.style.display = dish.modelUsdz ? "inline-block" : "none";

    toggleStateBtn.style.display = dish.hasStates ? "inline-block" : "none";
    if (dish.hasStates) toggleStateBtn.textContent = "Открыть телефон";

    startModelLoad(dish.modelGlb); // 🔥 ЕДИНСТВЕННАЯ загрузка
}


  function closeModal() {
    modal.style.display = "none";
    body.classList.remove("modal-open");

    // remove listeners and reset viewer
    try { modelViewer.removeEventListener("load", onModelLoaded); } catch(e) {}
    try { modelViewer.removeEventListener("error", onModelError); } catch(e) {}
    try { modelViewer.removeAttribute("src"); } catch(e) {}
    modelViewer.style.display = "none";
    modelViewer.style.visibility = "hidden";
    toggleStateBtn.style.display = "none";
    modalImg.style.display = "block";
    modelStatus.textContent = "Статус 3D: idle";
    modelError.style.display = "none";
    showLoader(false);
    modalPanel.classList.remove("model-loaded");

    // hide retry UI
    const retryWrap = document.getElementById("mv-retry-wrap");
    if (retryWrap) retryWrap.style.display = "none";

    // ensure auto-rotate off visually (but preserve state)
    const rotateBtn = document.getElementById("mv-rotate-btn");
    if (rotateBtn) rotateBtn.classList.toggle("active", autoRotate);
  }

  closeModalBtn.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  addToCartBtn.onclick = () => {
    if (currentDish) { addToCart(currentDish, 1); alert("Добавлено в корзину"); }
  };






 

  // ===== attach modal events to cards =====
  function createHeroCardWithEvents(dish) {
    // reuse previous card builder for consistency
    return createHeroCard(dish, 0); // createHeroCard already sets up button to openModal
  }

  // (we already used renderMenu earlier)

  // ===== Accessibility & cleanup on unload =====
  window.addEventListener("beforeunload", () => {
    try { modelViewer.removeAttribute("src"); } catch(e) {}
  });

  // extra: keyboard support (Esc to close)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") closeModal();
  });

  // Keep API-compatible functions exported to window for debugging (optional)
  window.__ar_shop = {
    openModal: (id) => {
      const dish = MENU.find(d => d.id === id);
      if (dish) openModal(dish);
    },
    reLoadModel: () => {
      if (currentDish && currentDish.modelGlb) startModelLoad(currentDish.modelGlb);
    },
    toggleAutoRotate: (val) => {
      autoRotate = !!val;
      toggleAutoRotate(autoRotate);
      const btn = document.getElementById("mv-rotate-btn");
      if (btn) btn.classList.toggle("active", autoRotate);
    }
  };

  // === ПЕРЕКЛЮЧЕНИЕ ОТКРЫТО / ЗАКРЫТО ===
  toggleStateBtn.onclick = () => {
  if (!currentDish || !currentDish.hasStates) return;

  if (phoneState === "closed") {
    phoneState = "open";
    toggleStateBtn.textContent = "Закрыть телефон";
    startModelLoad(currentDish.modelOpenGlb);
    arLink.href = currentDish.modelOpenUsdz;
  } else {
    phoneState = "closed";
    toggleStateBtn.textContent = "Открыть телефон";
    startModelLoad(currentDish.modelClosedGlb);
    arLink.href = currentDish.modelClosedUsdz;
  }
};

})();



// =====================
// ВСПЛЫВАЮЩЕЕ МЕНЮ
// =====================
const cartBtn = document.getElementById("cart-btn");
const siteMenu = document.getElementById("site-menu");
const menuClose = document.getElementById("menu-close");

if (cartBtn && siteMenu) {
  cartBtn.addEventListener("click", () => {
    siteMenu.classList.add("open");
    siteMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  });
}

if (menuClose) {
  menuClose.addEventListener("click", closeMenu);
}

siteMenu.addEventListener("click", (e) => {
  if (e.target === siteMenu) closeMenu();
});

function closeMenu() {
  siteMenu.classList.remove("open");
  siteMenu.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

// закрытие по ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && siteMenu.classList.contains("open")) {
    closeMenu();
  }
});
