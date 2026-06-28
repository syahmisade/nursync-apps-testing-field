import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Reads procedures from the Base44 `Procedure` entity and maps `legacyId` -> `id`
// so the existing screen/save logic (which keys off `procedure.id`) keeps working.
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

export function useProcedures() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['procedures'],
    queryFn: async () => {
      const records = await base44.entities.Procedure.list('legacyId', 500);
      const procedures = records.map(mapRecord);
      return {
        procedures,
        procedureCategories: buildCategories(procedures),
      };
    },
  });

  return {
    procedures: data?.procedures ?? [],
    procedureCategories: data?.procedureCategories ?? ['All'],
    isLoading,
    error,
  };
}
