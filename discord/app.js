(() => {
  const mobileSearch = document.querySelector('#mobile-search');
  const search = document.querySelector('#link-search');
  const rows = [...document.querySelectorAll('#link-list a')];
  const emptyState = document.querySelector('#empty-state');

  mobileSearch?.addEventListener('click', () => {
    search?.scrollIntoView({ block: 'center' });
    search?.focus({ preventScroll: true });
  });

  const filterRows = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    rows.forEach(row => {
      const haystack = `${row.textContent} ${row.dataset.search || ''}`.toLowerCase();
      const match = !query || haystack.includes(query);
      row.hidden = !match;
      if (match) visible += 1;
    });
    emptyState.hidden = visible !== 0;
  };

  search?.addEventListener('input', filterRows);

  document.addEventListener('keydown', event => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    if (event.key === '/' && !typing) {
      event.preventDefault();
      search?.focus();
    }
    if (event.key === 'Escape' && document.activeElement === search) {
      search.value = '';
      filterRows();
      search.blur();
    }
  });
})();
