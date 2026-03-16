import { ServiceItem } from '@/types';
import { getCollection } from '@/lib/supabase/database';

const TABLE = 'services';

export const getServices = async (): Promise<ServiceItem[]> => {
  const data = await getCollection(TABLE, { 
    order: { column: 'order_index', ascending: true } 
  });
  
  return data.map((item: any) => ({
    id: item.id,
    key: item.key,
    icon: item.icon,
    color: item.color,
    tech: item.tech || [],
    orderIndex: item.order_index
  }));
};
