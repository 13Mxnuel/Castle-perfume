const WHATSAPP_NUMBER = "18493700389";
const products = [
  {id:1,name:"Bleu de Chanel",brand:"Chanel · Hombre",category:"Hombres",price:6500,tag:"Más vendido",image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=85"},
  {id:2,name:"Miss Dior",brand:"Dior · Mujer",category:"Mujeres",price:6200,tag:"",image:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=85"},
  {id:3,name:"Y Eau de Parfum",brand:"Yves Saint Laurent · Hombre",category:"Hombres",price:5900,tag:"",image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85"},
  {id:4,name:"CK One",brand:"Calvin Klein · Unisex",category:"Unisex",price:4800,tag:"",image:"https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=800&q=85"},
  {id:5,name:"Oud Royale",brand:"Perfumería árabe · Unisex",category:"Ofertas",price:3500,tag:"Oferta de ejemplo",image:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=85"},
  {id:6,name:"Rose Élégance",brand:"Fragancia floral · Mujer",category:"Mujeres",price:4200,tag:"",image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=85"},
  {id:7,name:"Amber Night",brand:"Fragancia amaderada · Hombre",category:"Hombres",price:3900,tag:"",image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85"},
  {id:8,name:"Santal Mystique",brand:"Perfumería de nicho · Unisex",category:"Unisex",price:7200,tag:"",image:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=85"}
];
const $ = id => document.getElementById(id);
const productGrid=$("productGrid"),searchInput=$("searchInput"),productsHeading=$("productsHeading"),noResults=$("noResults"),cartCount=$("cartCount"),cartPanel=$("cartPanel"),overlay=$("overlay"),toast=$("toast"),sidebar=$("sidebar");
let selectedCategory="Todos",cart=[],toastTimer;
function money(value){return "RD$ "+value.toLocaleString("en-US")}
function renderProducts(){
 const term=searchInput.value.trim().toLowerCase();
 const visible=products.filter(p=>{
  const categoryMatch=selectedCategory==="Todos"||(selectedCategory==="Ofertas"?(p.tag.toLowerCase().includes("oferta")||p.category==="Ofertas"):p.category===selectedCategory);
  return categoryMatch&&`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(term);
 });
 productsHeading.textContent=selectedCategory==="Todos"?"Productos destacados":selectedCategory;
 productGrid.innerHTML=visible.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="Imagen de muestra de ${p.name}" loading="lazy">${p.tag?`<span class="tag">${p.tag}</span>`:""}</div><div class="product-info"><h3>${p.name}</h3><p class="product-brand">${p.brand}</p><div class="product-price">${money(p.price)}</div><div class="product-actions"><button class="add-button" data-add="${p.id}">＋ Agregar al carrito</button></div></div></article>`).join("");
 noResults.hidden=visible.length!==0;
}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2300)}
function addToCart(id){const item=products.find(p=>p.id===id);if(!item)return;const found=cart.find(p=>p.id===id);if(found)found.qty++;else cart.push({...item,qty:1});renderCart();showToast(`${item.name} se agregó a tu selección.`)}
function renderCart(){cartCount.textContent=cart.reduce((s,p)=>s+p.qty,0);$("cartItems").innerHTML=cart.length?cart.map(p=>`<div class="cart-item"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><small>${p.qty} × ${money(p.price)}</small></div><button class="remove-item" data-remove="${p.id}" aria-label="Quitar ${p.name}">Quitar</button></div>`).join(""):'<p class="cart-empty">Todavía no has agregado perfumes.</p>';$("cartTotal").textContent=money(cart.reduce((s,p)=>s+p.price*p.qty,0))}
function openCart(){cartPanel.classList.add("open");cartPanel.setAttribute("aria-hidden","false");overlay.classList.add("visible");overlay.classList.remove("menu-overlay")}
function closeCart(){cartPanel.classList.remove("open");cartPanel.setAttribute("aria-hidden","true");if(!sidebar.classList.contains("open"))overlay.classList.remove("visible")}
function closeMenu(){sidebar.classList.remove("open");if(!cartPanel.classList.contains("open"))overlay.classList.remove("visible")}
function setCategory(category){selectedCategory=category;searchInput.value="";renderProducts();closeMenu();$("productos").scrollIntoView({behavior:"smooth"});document.querySelectorAll(".nav-link").forEach(el=>el.classList.toggle("active",el.dataset.category===category||(category==="Todos"&&el.getAttribute("href")==="#inicio")))}
document.addEventListener("click",e=>{
 const category=e.target.closest("[data-category]");
 if(category){e.preventDefault();setCategory(category.dataset.category);return}
 const add=e.target.closest("[data-add]");if(add){addToCart(Number(add.dataset.add));return}
 const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(p=>p.id!==Number(remove.dataset.remove));renderCart();return}
});
searchInput.addEventListener("input",()=>{selectedCategory="Todos";renderProducts()});
$("cartButton").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",()=>{closeCart();closeMenu()});
$("menuToggle").addEventListener("click",()=>{sidebar.classList.add("open");overlay.classList.add("visible");overlay.classList.add("menu-overlay")});
$("closeMenu").addEventListener("click",closeMenu);
$("orderButton").addEventListener("click",()=>{if(!cart.length){showToast("Agrega al menos un perfume antes de consultar.");return}const lines=cart.map(p=>`• ${p.name} x${p.qty} — ${money(p.price*p.qty)}`),total=cart.reduce((s,p)=>s+p.price*p.qty,0);const message=`¡Hola, Castle Perfume! Me interesa consultar estos productos:\n\n${lines.join("\n")}\n\nTotal estimado: ${money(total)}\n\n¿Me confirman disponibilidad y precios actuales?`;window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener")});
$("year").textContent=new Date().getFullYear();renderProducts();renderCart();