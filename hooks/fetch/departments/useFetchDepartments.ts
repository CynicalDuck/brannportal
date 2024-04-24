import { useState, useEffect } from 'react';
import { supabase } from '../../../app/supabase';
import { useSession } from '../../authentication/useSession';

export function useFetchSingleDepartment() {
  const { session } = useSession();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchDepartment() {
      if (session && session.user && session.user.departmentId) {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_connection_department')
          .select('*, department (*)')
          .eq('user', session.user.id)

        setLoading(false);
        if (error) {
          setError(error);
        } else {
          setDepartment(data[0].department || null);
        }
      }
    }

    fetchDepartment();
  }, [session]);

  return { department, loading, error };
}