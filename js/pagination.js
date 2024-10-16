// Selección del elemento de paginación en el DOM
const paginationElement = document.querySelector("[data-pagination]");

/**
 * Función para crear la paginación de productos.
 * @param {number} totalItems - Total de productos disponibles para paginar.
 * @param {number} itemsPerPage - Cantidad de productos que se mostrarán por página.
 * @param {number} currentPage - Número de la página actualmente visible.
 * @param {function} onPageChange - Callback que se llama al cambiar de página, recibe como argumento el nuevo número de página.
 */
export function createPagination(totalItems, itemsPerPage, currentPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Limpiar la paginación existente
    paginationElement.innerHTML = "";

    // Crear enlace de "anterior"
    const prevLink = document.createElement('a');
    prevLink.className = "prev";
    prevLink.innerHTML = "&laquo;";
    prevLink.href = "#previous"; // Agrega href
    prevLink.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    });
    paginationElement.appendChild(prevLink);

    // Crear enlaces de páginas
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.className = "page";
        pageLink.innerText = i;
        pageLink.href = `#page${i}`; // Agrega href con un valor único
        pageLink.setAttribute('data-page', i);

        // Evento de clic
        pageLink.addEventListener('click', (event) => {
            event.preventDefault();
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
    nextLink.href = "#next"; // Agrega href
    nextLink.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    });
    paginationElement.appendChild(nextLink);
}
