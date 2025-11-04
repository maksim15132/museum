(() => {
  const MENU = [
    {
      id: "m1",
      name: "Маргарита",
      price: 9.5,
      image: "https://maksim15132.github.io/ar-shop/assets/image/margarita.jpg",
      description: "Классическая пицца Маргарита — томатный соус, моцарелла, базилик.",
      modelGlb: "https://maksim15132.github.io/ar-shop/assets/modelGlb/margarita/pizza.glb",
      modelUsdz: "https://modelviewer.dev/shared-assets/models/Pizza.usdz",
    },
    {
      id: "m2",
      name: "Пепперони",
      price: 11.0,
      image: "https://maksim15132.github.io/ar-shop/assets/image/piperoni.jpg",
      description: "Острая пепперони с хрустящей корочкой и тянущимся сыром.",
      modelGlb: "https://maksim15132.github.io/ar-shop/assets/modelGlb/piperoni/pizza.glb",
      modelUsdz: "https://maksim15132.github.io/ar-shop/assets/modelUsdz/Pepperoni_and_Spinach_Pizza.usdz",
    },
    {
      id: "s1",
      name: "Цезарь с курицей",
      price: 8.0,
      image: "https://maksim15132.github.io/ar-shop/assets/image/chiken.png",
      description: "Свежий салат Цезарь с жареной курицей и пармезаном.",
      modelGlb: "https://modelviewer.dev/shared-assets/models/Pizza.glb",
      modelUsdz: "https://modelviewer.dev/shared-assets/models/Pizza.usdz",
    },
    {
      id: "m3",
      name: "Курица",
      price: 8.0,
      image: "https://maksim15132.github.io/ar-shop/assets/image/chiken_gril.jpg",
      description: "Запечёная курица.",
      modelGlb: "https://modelviewer.dev/shared-assets/models/Pizza.glb",
      modelUsdz: "https://maksim15132.github.io/ar-shop/assets/modelUsdz/Roast_chicken.usdz",
    },
    {
      id: "f1",
      name: "Фотоаппарат Смена-8М",
      price: 20.0,
      image: "https://maksim15132.github.io/ar-shop/assets/image/smena-8m.jpg",
      description: "Фотоаппарат «Смена-8М» был одним из самых популярных в Советском Союзе. Его выпускали с 1970-х по 1990-е годы на Ленинградском оптико-механическом объединении. Простая конструкция и прочный корпус делали камеру удобной даже для начинающих фотографов. С помощью «Смены» люди снимали семейные праздники, школьные мероприятия, поездки и повседневную жизнь.",
      modelGlb: "https://maksim15132.github.io/ar-shop/assets/modelGlb/smena_8m.glb",
      modelUsdz: "https://maksim15132.github.io/ar-shop/assets/modelUsdz/Smena_8M.usdz",
    },
    {
      id: "f2",
      name: "Фотоаппарат Зенит",
      price: 40.0,
      image: "https://maksim15132.github.io/ar-shop/assets/image/zenit.jpg",
      description: "Фотоаппарат «Зенит-Е» стал одной из самых узнаваемых моделей советской фототехники. Его выпускали с середины 1960-х до 1980-х годов на Красногорском механическом заводе. Надёжный металлический корпус и зеркальная система делали камеру удобной как для любителей, так и для начинающих фотографов. На «Зенит-Е» снимали портреты, пейзажи и важные жизненные моменты, а сам аппарат стал символом эпохи плёночной фотографии.",
      modelGlb: "https://maksim15132.github.io/ar-shop/assets/modelGlb/zenit-et__free.glb",
      modelUsdz: "https://maksim15132.github.io/ar-shop/assets/modelUsdz/Zenit-ET.usdz",
    },
  ];

  // ===== DOM =====
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

  const cartBtn = document.getElementById("cart-btn");
  const cartCount = document.getElementById("cart-count");
  const cartPreview = document.getElementById("cart-preview");
  const cartItemsCount = document.getElementById("cart-items-count");
  const cartTotal = document.getElementById("cart-total");
  const orderBtn = document.getElementById("order-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // ===== Theme =====
  function setTheme(theme) {
    if (theme === "light") {
      body.classList.remove("dark");
      body.classList.add("light");
      themeToggle.textContent = "🌙 Тёмная";
    } else {
      body.classList.remove("light");
      body.classList.add("dark");
      themeToggle.textContent = "☀️ Тема";
    }
    localStorage.setItem("ar_theme", theme);
  }
  const savedTheme = localStorage.getItem("ar_theme") || "dark";
  setTheme(savedTheme);
  themeToggle.onclick = () => {
    const newTheme = body.classList.contains("light") ? "dark" : "light";
    setTheme(newTheme);
  };

  // ===== Cart (kept simple — burger shows message) =====
  let cart = JSON.parse(localStorage.getItem("ar_cart") || "[]");
  function saveCart() { localStorage.setItem("ar_cart", JSON.stringify(cart)); }
  function updateCartUI() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cartCount) {
      cartCount.style.display = count > 0 ? "inline-block" : "none";
      cartCount.textContent = count;
    }
    if (cartItemsCount) cartItemsCount.textContent = count + " шт";
    const total = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
    if (cartTotal) cartTotal.innerHTML = `Итого: <strong>€${total.toFixed(2)}</strong>`;
    if (cartPreview) cartPreview.style.display = count > 0 ? "flex" : "none";
  }
  function addToCart(dish, qty = 1) {
    const found = cart.find((item) => item.id === dish.id);
    if (found) found.qty += qty;
    else cart.push({ ...dish, qty });
    saveCart(); updateCartUI();
  }
  function clearCart() { cart = []; saveCart(); updateCartUI(); }
  orderBtn.onclick = () => alert("Оформление заказа пока не реализовано (демо).");
  clearCartBtn.onclick = () => clearCart();

  // гамбургер: выводит сообщение
  cartBtn.onclick = () => {
    alert("СКОРО этот раздел сайта в разработке");
  };

  updateCartUI();

  // ===== Render hero-cards (одна большая карточка = 2 колонки) =====
  function createHeroCard(dish, index) {
    const article = document.createElement("article");
    article.className = "hero-card";

    const media = document.createElement("div");
    media.className = "card-media";
    const img = document.createElement("img");
    img.src = dish.image;
    img.alt = dish.name;
    media.appendChild(img);

    const content = document.createElement("div");
    content.className = "card-content";
    const meta = document.createElement("div");
    meta.className = "meta";
    const nameDiv = document.createElement("div");
    nameDiv.style.fontWeight = "800";
    nameDiv.textContent = dish.name;
    const priceDiv = document.createElement("div");
    priceDiv.className = "price";
    priceDiv.textContent = `€${dish.price.toFixed(2)}`;
    meta.appendChild(nameDiv);
    meta.appendChild(priceDiv);

    const desc = document.createElement("p");
    desc.style.color = "var(--muted)";
    desc.style.marginTop = "8px";
    desc.style.fontSize = "14px";
    desc.textContent = dish.description;

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "card-actions";
    const detailsBtn = document.createElement("button");
    detailsBtn.className = "btn btn-primary";
    detailsBtn.textContent = "Подробнее";
    detailsBtn.onclick = () => openModal(dish);
    const addBtn = document.createElement("button");
    addBtn.className = "btn btn-ghost";
    addBtn.textContent = "В корзину";
    addBtn.onclick = () => { addToCart(dish, 1); alert("Добавлено в корзину"); };

    buttonsDiv.appendChild(detailsBtn);
    buttonsDiv.appendChild(addBtn);

    content.appendChild(meta);
    content.appendChild(desc);
    content.appendChild(buttonsDiv);

    article.appendChild(media);
    article.appendChild(content);

    return article;
  }

  function renderMenu() {
    menuGrid.innerHTML = "";
    MENU.forEach((dish, i) => {
      menuGrid.appendChild(createHeroCard(dish, i));
    });
  }
  renderMenu();

  // ===== Modal behavior: show preview left, info right.
  // After model loads -> swap (add .model-loaded to .modal-panel)
  let currentDish = null;
  const modalPanel = document.querySelector(".modal-panel");
  function openModal(dish) {
    currentDish = dish;
    modal.style.display = "flex";
    // lock body scroll
    body.classList.add("modal-open");

    // set preview image and info
    modalImg.src = dish.image;
    modalImg.alt = dish.name;
    modalTitle.textContent = dish.name;
    modalPrice.textContent = `Цена: €${dish.price.toFixed(2)}`;
    modalDesc.textContent = dish.description;

    // prepare model-viewer
    modelViewer.style.display = "none";
    modelViewer.removeAttribute("src");
    modelViewer.poster = dish.image;
    modelViewer.alt = dish.name;

    arLink.href = dish.modelUsdz || "#";
    arLink.style.display = dish.modelUsdz ? "inline-block" : "none";

    modelError.style.display = "none";
    modelStatus.textContent = "Статус 3D: загрузка...";

    // ensure panel is not in model-loaded state
    modalPanel.classList.remove("model-loaded");

    // small delay to attach listeners freshly
    setTimeout(() => {
      modelViewer.addEventListener("load", onModelLoaded);
      modelViewer.addEventListener("error", onModelError);
      // set src last — чтобы событие загрузки сработало корректно
      modelViewer.src = dish.modelGlb || "";
      // show model-viewer only when loaded; keep image visible until then
    }, 50);
  }

  function closeModal() {
    modal.style.display = "none";
    body.classList.remove("modal-open");
    modelViewer.removeEventListener("load", onModelLoaded);
    modelViewer.removeEventListener("error", onModelError);
    // hide model viewer
    try { modelViewer.style.display = "none"; } catch(e){}
    modalPanel.classList.remove("model-loaded");
    currentDish = null;
  }
  closeModalBtn.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  addToCartBtn.onclick = () => {
    if (currentDish) { addToCart(currentDish, 1); alert("Добавлено в корзину"); }
  };

  function onModelLoaded() {
    // когда модель загрузилась — показываем её вместо картинки и меняем порядок
    modelStatus.textContent = "Статус 3D: модель загружена";
    modelError.style.display = "none";
    // показываем model-viewer
    modelViewer.style.display = "block";
    // добавляем класс, который меняет шаблон (модель показывается справа/слева в зависимости от CSS)
    modalPanel.classList.add("model-loaded");
  }
  function onModelError() {
    modelStatus.textContent = "Статус 3D: ошибка загрузки";
    modelError.style.display = "block";
  }

  // отмена прокрутки страницы под модалкой на мобильных: handled via CSS body.modal-open + modal-panel overflow
})();
