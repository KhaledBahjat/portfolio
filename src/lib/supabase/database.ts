import { supabase } from './supabase';

export async function getCollection(table: string, options: { 
  order?: { column: string, ascending?: boolean },
  limit?: number 
} = {}) {
  let query = supabase.from(table).select('*');
  
  if (options.order) {
    query = query.order(options.order.column, { ascending: options.order.ascending ?? false });
  }
  
  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getDocument(table: string, id: string | number, idColumn: string = 'id') {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(idColumn, id)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  return data;
}

export async function addDocument(table: string, data: any) {
  const { data: result, error } = await supabase
    .from(table)
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateDocument(table: string, id: string | number, data: any, idColumn: string = 'id') {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq(idColumn, id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function deleteDocument(table: string, id: string | number, idColumn: string = 'id') {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq(idColumn, id);

  if (error) throw error;
}
