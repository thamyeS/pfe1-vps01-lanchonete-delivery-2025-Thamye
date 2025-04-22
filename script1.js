document.addEventListener('DOMContentLoaded', function() {
    // Verificar se a página é realmente a de pedidos finalizados
    if (window.location.pathname.includes('concluidos.html')) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedidosFinalizados = pedidos.filter(pedido => pedido.status === 'finalizado');
        
        const table = document.getElementById('finalizadosTable');
        
        if (table) {
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
        } else {
            console.error("A tabela de finalizados não foi encontrada.");
        }
    }
});