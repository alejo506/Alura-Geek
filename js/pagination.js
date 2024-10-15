const paginationElement = document.querySelector("[data-pagination]");

// Función para crear la paginación
export function createPagination(totalItems, itemsPerPage, currentPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Limpiar la paginación existente
    paginationElement.innerHTML = "";

    // Crear enlace de "anterior"
    const prevLink = document.createElement('a');
    prevLink.className = "prev";
    prevLink.innerHTML = "&laquo;";
    prevLink.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            console.log("Página anterior: ", currentPage - 1);
            onPageChange(currentPage - 1);
        }
    });
    paginationElement.appendChild(prevLink);

    // Crear enlaces de páginas
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.className = "page";
        pageLink.innerText = i;
        pageLink.setAttribute('data-page', i);

        // Agregar evento de clic
        pageLink.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Página seleccionada: ", i);
            onPageChange(i);
        });

        // Marcar la página actual como activa
        if (i === currentPage) {
            pageLink.classList.add('activo');
        }

        paginationElement.appendChild(pageLink);
    }

    // Crear enlace de "siguiente"
    const nextLink = document.createElement('a');
    nextLink.className = "next";
    nextLink.innerHTML = "&raquo;";
    nextLink.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            console.log("Página siguiente: ", currentPage + 1);
            onPageChange(currentPage + 1);
        }
    });
    paginationElement.appendChild(nextLink);
}