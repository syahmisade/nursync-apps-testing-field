import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { procedureCategories as staticCategories } from '../data/procedures';

// Reads procedures from the Base44 `Procedure` entity and maps `legacyId` -> `id`
// so the existing screen/save logic (which keys off `procedure.id`) keeps working.
function mapRecord(r) {
  return { ...r, id: r.legacyId };
}

export function useProcedures() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['procedures'],
    queryFn: async () => {
      const records = await base44.entities.Procedure.list('legacyId', 500);
      return records.map(mapRecord);
    },
    initialData: [],
  });

  return { procedures: data, procedureCategories: staticCategories, isLoading, error };
}