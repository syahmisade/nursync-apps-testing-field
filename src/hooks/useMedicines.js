import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { categories as staticCategories } from '../data/medicines';

// Reads medicines from the Base44 `Medicine` entity and maps `legacyId` -> `id`
// so the existing screen/save logic (which keys off `medicine.id`) keeps working.
function mapRecord(r) {
  return { ...r, id: r.legacyId };
}

export function useMedicines() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const records = await base44.entities.Medicine.list('legacyId', 500);
      return records.map(mapRecord);
    },
    initialData: [],
  });

  return { medicines: data, categories: staticCategories, isLoading, error };
}