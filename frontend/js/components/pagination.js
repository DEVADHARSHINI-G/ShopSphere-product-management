// ═══════════════════════════════════════
// ShopSphere – Pagination Component
// ═══════════════════════════════════════

const Pagination = {
  render(pagination, onPageChange) {
    if (!pagination || pagination.totalPages <= 1) return '';

    const { currentPage, totalPages, hasNext, hasPrev } = pagination;
    let pages = [];

    // Build page numbers with ellipsis
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    // Store callback for use in onclick
    window._paginationCallback = onPageChange;

    return `
      <div class="pagination">
        <button class="page-btn" onclick="window._paginationCallback(${currentPage - 1})" ${!hasPrev ? 'disabled' : ''}>
          <i class="fas fa-chevron-left"></i>
        </button>
        ${pages.map(p => {
          if (p === '...') {
            return '<span class="page-btn" style="cursor:default;border:none">...</span>';
          }
          return `
            <button class="page-btn ${p === currentPage ? 'active' : ''}"
                    onclick="window._paginationCallback(${p})">
              ${p}
            </button>
          `;
        }).join('')}
        <button class="page-btn" onclick="window._paginationCallback(${currentPage + 1})" ${!hasNext ? 'disabled' : ''}>
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;
  }
};
