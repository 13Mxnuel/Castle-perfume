const WHATSAPP_NUMBER="18493700389";
const products=[
{id:1,name:"Bleu de Chanel",brand:"Chanel · Hombre",category:"Hombres",price:6500,image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=85",tag:"Más vendido"},
{id:2,name:"Miss Dior",brand:"Dior · Mujer",category:"Mujeres",price:6200,image:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=85"},
{id:3,name:"Y Eau de Parfum",brand:"YSL · Hombre",category:"Hombres",price:5900,image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=85"},
{id:4,name:"CK One",brand:"Calvin Klein · Unisex",category:"Unisex",price:4800,image:"https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=600&q=85"},
{id:5,name:"Sauvage",brand:"Dior · Hombre",category:"Hombres",price:7200,image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=85"},
{id:6,name:"La Vie Est Belle",brand:"Lancôme · Mujer",category:"Mujeres",price:6800,image:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=85"},
{id:7,name:"Black Opium",brand:"YSL · Mujer",category:"Ofertas",price:5400,oldPrice:6400,image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=85",tag:"Oferta"},
{id:8,name:"Acqua di Giò",brand:"Armani · Hombre",category:"Ofertas",price:4900,oldPrice:5800,image:"https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=600&q=85",tag:"Oferta"}
];
const $=id=>document.getElementById(id);
const productGrid=$("productGrid"),searchInput=$("searchInput"),cartCount=$("cartCount"),sidebar=$("sidebar"),overlay=$("overlay"),toast=$("toast");
let category="Todos",cart=[],toastTimer;
const money=n=>"RD$ "+n.toLocaleString("en-US");
function renderProducts(){
 const term=searchInput.value.trim().toLowerCase();
 const shown=products.filter(p=>(category==="Todos"||(category==="Ofertas"?p.oldPrice:p.category===category))&&[p.name,p.brand,p.category].join(" ").toLowerCase().includes(term));
 productGrid.innerHTML=shown.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"></div><div class="product-info">${p.tag?`<span class="tag">${p.tag}</span>`:""}<h3>${p.name}</h3><p class="product-brand">${p.brand}</p><div class="product-price">${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:""}${money(p.price)}</div><button class="add-button" data-add="${p.id}">Agregar al carrito</button></div></article>`).join("");
 $("noResults").hidden=shown.length>0;
}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}
function renderCart(){
 cartCount.textContent=cart.reduce((n,p)=>n+p.qty,0);
 $("cartItems").innerHTML=cart.length?cart.map(p=>`<div>${p.name} × ${p.qty} — ${money(p.price*p.qty)} <button data-remove="${p.id}" aria-label="Quitar ${p.name}">×</button></div>`).join(""):"Tu carrito está vacío.";
 $("cartTotal").textContent=money(cart.reduce((n,p)=>n+p.price*p.qty,0));
}
function closeMenu(){sidebar.classList.remove("open");overlay.style.display="none"}
document.addEventListener("click",e=>{
 const cat=e.target.closest("[data-category]");
 if(cat){category=cat.dataset.category;renderProducts();$("productos").scrollIntoView({behavior:"smooth"});closeMenu();return}
 const add=e.target.closest("[data-add]");
 if(add){const p=products.find(x=>x.id===Number(add.dataset.add));const old=cart.find(x=>x.id===p.id);if(old)old.qty++;else cart.push({...p,qty:1});renderCart();showToast(p.name+" agregado al carrito.");return}
 const remove=e.target.closest("[data-remove]");
 if(remove){cart=cart.filter(p=>p.id!==Number(remove.dataset.remove));renderCart()}
});
searchInput.addEventListener("input",()=>{category="Todos";renderProducts()});
$("menuToggle").addEventListener("click",()=>{sidebar.classList.add("open");overlay.style.display="block";overlay.style.background="#0006";overlay.style.zIndex="20";overlay.style.position="fixed";overlay.style.inset="0"});
$("closeMenu").addEventListener("click",closeMenu);overlay.addEventListener("click",closeMenu);
$("cartButton").addEventListener("click",()=>{showToast(cart.length?cart.map(p=>p.name+" × "+p.qty).join(" · "):"Tu carrito está vacío.");});
$("orderButton").addEventListener("click",()=>{
 if(!cart.length){showToast("Agrega un perfume antes de hacer tu pedido.");return}
 const lines=cart.map(p=>p.name+" x"+p.qty+" — "+money(p.price*p.qty));
 const total=cart.reduce((n,p)=>n+p.price*p.qty,0);
 const msg="¡Hola, Castle Perfume! Quiero consultar este pedido:\n"+lines.join("\n")+"\nTotal estimado: "+money(total)+"\n¿Me confirman disponibilidad?";
 window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(msg),"_blank","noopener");
});
renderProducts();renderCart();