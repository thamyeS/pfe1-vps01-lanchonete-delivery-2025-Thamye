  
  
function voltar() {
  window.location.href = "home.html";
}

function carregarPedidosFinalizados() {
  const pedidos = JSON.parse(localStorage.getItem("finalizados")) || [];
  const tbody = document.querySelector("#tabelaFinalizados tbody");
  const totalDiv = document.getElementById("totalGeral");

  tbody.innerHTML = "";
  let total = 0;

  pedidos.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.cliente}</td>
      <td>${p.endereco}</td>
      <td>${p.produto}</td>
      <td>${p.data}</td>
      <td>${p.hora}</td>
      <td>${p.horaChegada  || '-'}</td>
      <td>${p.preco  || '-'}</td>
    `;
    tbody.appendChild(tr);
    if (p.preco) total += p.preco;
  });
  

  totalDiv.textContent = `Total Geral R$: ${total.toFixed(2)}`;
}

carregarPedidosFinalizados();