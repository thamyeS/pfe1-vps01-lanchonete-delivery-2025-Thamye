const produtos = [
    { id: 1, nome: "Hamburguer", preco: 15.00 },
    { id: 2, nome: "X-Burguer", preco: 18.00 },
    { id: 3, nome: "X-Salada", preco: 20.00 },
    { id: 4, nome: "X-Bacon", preco: 25.00 },
    { id: 5, nome: "X-Egg", preco: 30.00 },
    { id: 6, nome: "X-Tudo", preco: 35.00 }
];

const clienteInput = document.getElementById("cliente");
const enderecoInput = document.getElementById("endereco");
const produtoSelect = document.getElementById("produto");
const gerarPedidoBtn = document.getElementById("gerarPedido");
const execucaoContainer = document.getElementById("execucao");
const entregaContainer = document.getElementById("entrega");

window.onload = () => {
    preencherProdutos();
    listarPedidos();
};

function preencherProdutos() {
    produtos.forEach(p => {
        const option = document.createElement("option");
        option.value = p.nome;
        option.textContent = p.nome;
        produtoSelect.appendChild(option);
    });
}

function gerarPedido() {
    const cliente = clienteInput.value;
    const endereco = enderecoInput.value;
    const produto = produtoSelect.value;
    const data = new Date();

    if (!cliente || !endereco || !produto) {
        alert("Preencha todos os campos!");
        return;
    }

    const pedido = {
        id: Date.now(),
        cliente,
        endereco,
        produto,
        data: data.toLocaleDateString(),
        hora: data.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "execucao"
    };

    const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    clienteInput.value = "";
    enderecoInput.value = "";
    produtoSelect.selectedIndex = 0;

    listarPedidos();
}

function listarPedidos() {
    execucaoContainer.innerHTML = "";
    entregaContainer.innerHTML = "";

    const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");

    pedidos.forEach(pedido => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <p><strong>Id:</strong> ${pedido.id} <strong>Cliente:</strong> ${pedido.cliente}</p>
            <p><strong>Produto:</strong> ${pedido.produto}</p>
            <p><strong>Endereço:</strong> ${pedido.endereco}</p>
            <p><strong>Data:</strong> ${pedido.data}</p>
            <p><strong>Horário:</strong> ${pedido.hora}</p>
        `;

        const btn = document.createElement("button");
        btn.className = "acao";

        if (pedido.status === "execucao") {
            btn.textContent = "Enviar Entrega";
            btn.onclick = () => atualizarStatus(pedido.id, "entrega");
            card.appendChild(btn);
            execucaoContainer.appendChild(card);
        } else if (pedido.status === "entrega") {
            const agora = new Date();
            const horaEntrega = agora.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            card.innerHTML += `<p><strong>Entrega:</strong> ${horaEntrega}</p>`;
            btn.textContent = "Pedido entregue";
            btn.onclick = () => finalizarPedido(pedido.id, horaEntrega);
            card.appendChild(btn);
            entregaContainer.appendChild(card);
        }
    });
}

function atualizarStatus(id, novoStatus) {
    const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) pedido.status = novoStatus;
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    listarPedidos();
}

function finalizarPedido(id, horaEntrega) {
    const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;

    const agora = new Date();
    pedido.horaSaida = agora.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    pedido.horaChegada = horaEntrega;
    pedido.preco = calcularPreco(pedido.produto); // Chama a função calcularPreco

    const finalizados = JSON.parse(localStorage.getItem("finalizados") || "[]");
    finalizados.push(pedido);

    const novosPedidos = pedidos.filter(p => p.id !== id);
    localStorage.setItem("pedidos", JSON.stringify(novosPedidos));
    localStorage.setItem("finalizados", JSON.stringify(finalizados));


    function calcularPreco(nomeProduto) {
        const produto = produtos.find(p => p.nome === nomeProduto);

        if (produto) {
    
            if (produto.preco !== undefined) {
                return produto.preco;
            } else {
        
                const precoBase = 10.00;
                const custoIngredienteExtra = 2.00; 
    
               
                return precoBase + (produto.ingredientes.length - 3) * custoIngredienteExtra;
            }
        }

        return 0;
    }
    alert("Pedido finalizado com sucesso!");
    listarPedidos();
}


gerarPedidoBtn.addEventListener("click", gerarPedido);