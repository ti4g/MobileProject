document.addEventListener("DOMContentLoaded", () => {
  // Dados simulados
  const completedPercentage = 30; // Porcentagem de tarefas concluídas
  const monthlyCount = 45; // Número total de tarefas feitas no mês

  // Exibir os dados
  const completedPercentageElem = document.getElementById("completed-percentage");
  const completedProgressElem = document.getElementById("completed-progress");
  const monthlyCountElem = document.getElementById("monthly-count");

  // Atualizar os valores
  completedPercentageElem.textContent = `${completedPercentage}%`;
  completedProgressElem.style.width = `${completedPercentage}%`; // Barra de progresso
  monthlyCountElem.textContent = monthlyCount; // Número de anotações feitas
});
