export async function getFilterOptions(categoryId) {
    const res = await fetch(`http://localhost:5000/api/filters/${categoryId}`);
    return res.json();
  }
  