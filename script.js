fetch('../assets/dados.json')
    .then(response => response.json()) 
    .then(lanches => {
        const produtoSelect = document.getElementById('produto');
        lanches.forEach(lanche => {
            const option = document.createElement('option');
            option.value = lanche.id;
            option.textContent = lanche.nome;
            produtoSelect.appendChild(option);
        });

        // Cadastro de pedidos
        document.getElementById('pedidoForm').addEventListener('submit', function (event) {
            event.preventDefault();

            const nomeCliente = document.getElementById('nomeCliente').value;
            const endereco = document.getElementById('endereco').value;  // Captura do endereço
            const produtoId = document.getElementById('produto').value;
            const produto = lanches.find(lanche => lanche.id == produtoId);

            const pedido = {
                id: Date.now(),
                nomeCliente,
                endereco, 
                produto: produto.nome,
                preco: produto.preco,
                dataHora: new Date().toLocaleString(),
                status: 'emExecucao'
            };

            // Salvar no LocalStorage
            let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
            pedidos.push(pedido);
            localStorage.setItem('pedidos', JSON.stringify(pedidos));

            // Atualizar a lista
            carregarPedidos();
            this.reset();
        });

        // Carregar pedidos
        function carregarPedidos() {
            const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
            const pedidoList = document.getElementById('pedidoList');
            const pedidoEntregueList = document.getElementById('pedidoEntregueList');
            
            pedidoList.innerHTML = '';
            pedidoEntregueList.innerHTML = '';
            
            pedidos.forEach(pedido => {
                const card = document.createElement('div');
                card.classList.add('pedido');
                card.innerHTML = `
                    <h4>${pedido.nomeCliente}</h4>
                    <p>Endereço: ${pedido.endereco}</p>
                    <p>Produto: ${pedido.produto}</p>
                    <p>Preço: R$${pedido.preco}</p>
                    <p>Data: ${pedido.dataHora}</p>
                    <button>${pedido.status === 'emExecucao' ? 'Mover para Entrega' : 'Pedido Finalizado'}</button>
                `;
                // Adicionar o evento de clique diretamente via JS
                const button = card.querySelector('button');
                button.addEventListener('click', function () {
                    mudarStatus(pedido.id);
                });

                if (pedido.status === 'emExecucao') {
                    pedidoList.appendChild(card);
                } else {
                    pedidoEntregueList.appendChild(card);
                }
            });
        }

        function mudarStatus(id) {
            const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
            const pedido = pedidos.find(pedido => pedido.id === id);
            pedido.status = pedido.status === 'emExecucao' ? 'emEntrega' : 'finalizado';
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            carregarPedidos();
        }

        // Exibir pedidos finalizados na página de finalizados (concluidos.html)
        if (window.location.pathname.includes('concluidos.html')) {
            const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
            const pedidosFinalizados = pedidos.filter(pedido => pedido.status === 'finalizado');
            
            const table = document.getElementById('finalizadosTable');
            table.innerHTML = '<tr><th>Cliente</th><th>Endereço</th><th>Produto</th><th>Preço</th><th>Data</th></tr>';
            
            pedidosFinalizados.forEach(pedido => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pedido.nomeCliente}</td>
                    <td>${pedido.endereco}</td>
                    <td>${pedido.produto}</td>
                    <td>R$${pedido.preco}</td>
                    <td>${pedido.dataHora}</td>
                `;
                table.appendChild(row);
            });
        }

        // Carregar pedidos na página principal
        document.addEventListener('DOMContentLoaded', carregarPedidos);
    })
    .catch(error => {
        console.error("Erro ao carregar os lanches:", error);
    });