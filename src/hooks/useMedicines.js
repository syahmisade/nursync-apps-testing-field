import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Reads medicines from the Base44 `Medicine` entity and maps `legacyId` -> `id`
// so the existing screen/save logic (which keys off `medicine.id`) keeps working.
function mapRecord(r) {
  return { ...r, id: r.legacyId };
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function buildCategories(records) {
  const unique = new Map();

  for (const record of records) {
    if (!hasText(record.category)) continue;

    const label = record.category.trim();
    const key = label.toLowerCase();
    if (!unique.has(key)) unique.set(key, label);
  }

  return ['All', ...Array.from(unique.values()).sort((a, b) => a.localeCompare(b))];
}

export function useMedicines() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const records = await base44.entities.Medicine.list('legacyId', 500);
      const medicines = records.map(mapRecord);
      return {
        medicines,
        categories: buildCategories(medicines),
      };
    },
  });

  return { medicines: data?.medicines ?? [], categories: data?.categories ?? ['All'], isLoading, error };
}
